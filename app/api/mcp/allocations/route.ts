import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { isMcpAuthenticated, corsHeaders, handleOptions } from '../../_mcp-auth';

export function OPTIONS() {
  return handleOptions();
}

export async function GET(request: Request) {
  if (!isMcpAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders });
  }
  try {
    const sql = neon(process.env.POSTGRES_URL!);
    const rows = await sql`SELECT * FROM plant_allocations ORDER BY container_id, sort_order`;
    return NextResponse.json(rows, { headers: corsHeaders });
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
    const sql = neon(process.env.POSTGRES_URL!);
    const body = (await request.json()) as {
      id: string;
      plant_id: string;
      container_id: string;
      zone?: string;
      status?: string;
      sort_order?: number;
    };
    const { id, plant_id, container_id, zone, status, sort_order } = body;
    const rows = await sql`
      INSERT INTO plant_allocations (user_id, id, plant_id, container_id, zone, status, sort_order, updated_at)
      VALUES ('mcp', ${id}, ${plant_id}, ${container_id}, ${zone ?? null}, ${status ?? 'current'}, ${sort_order ?? 0}, NOW())
      ON CONFLICT (user_id, id) DO UPDATE SET
        plant_id     = EXCLUDED.plant_id,
        container_id = EXCLUDED.container_id,
        zone         = EXCLUDED.zone,
        status       = EXCLUDED.status,
        sort_order   = EXCLUDED.sort_order,
        updated_at   = NOW()
      RETURNING *
    `;
    return NextResponse.json(rows[0], { headers: corsHeaders });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500, headers: corsHeaders });
  }
}
