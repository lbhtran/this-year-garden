import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { isMcpAuthenticated, corsHeaders, handleOptions } from '../../_mcp-auth';
import { ensureMcpTables } from '../_ensure-tables';

export function OPTIONS() {
  return handleOptions();
}

export async function GET(request: Request) {
  if (!isMcpAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders });
  }
  try {
    await ensureMcpTables();
    const sql = neon(process.env.POSTGRES_URL!);
    const [containers, allocations] = await Promise.all([
      sql`SELECT * FROM containers ORDER BY id`,
      sql`SELECT * FROM plant_allocations ORDER BY container_id, sort_order`,
    ]);

    const allocationsByContainer: Record<string, unknown[]> = {};
    for (const alloc of allocations as Record<string, unknown>[]) {
      const key = alloc.container_id as string;
      if (!allocationsByContainer[key]) allocationsByContainer[key] = [];
      allocationsByContainer[key].push(alloc);
    }

    const result = containers.map((c) => ({
      ...c,
      allocations: allocationsByContainer[c.id as string] ?? [],
    }));

    return NextResponse.json(result, { headers: corsHeaders });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500, headers: corsHeaders });
  }
}

export async function POST(request: Request) {
  if (!isMcpAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders });
  }
  try {
    await ensureMcpTables();
    const sql = neon(process.env.POSTGRES_URL!);
    const body = (await request.json()) as {
      id: string;
      name: string;
      emoji?: string;
      type: string;
      size?: string;
      notes?: string;
      on_hold?: boolean;
      diagram_id?: string;
    };
    const { id, name, emoji, type, size, notes, on_hold, diagram_id } = body;
    const rows = await sql`
      INSERT INTO containers (user_id, id, name, emoji, type, size, notes, on_hold, diagram_id, updated_at)
      VALUES ('mcp', ${id}, ${name}, ${emoji ?? null}, ${type}, ${size ?? null}, ${notes ?? null}, ${on_hold ?? false}, ${diagram_id ?? null}, NOW())
      ON CONFLICT (user_id, id) DO UPDATE SET
        name       = EXCLUDED.name,
        emoji      = EXCLUDED.emoji,
        type       = EXCLUDED.type,
        size       = EXCLUDED.size,
        notes      = EXCLUDED.notes,
        on_hold    = EXCLUDED.on_hold,
        diagram_id = EXCLUDED.diagram_id,
        updated_at = NOW()
      RETURNING *
    `;
    return NextResponse.json(rows[0], { headers: corsHeaders });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500, headers: corsHeaders });
  }
}
