import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { isMcpAuthenticated, getMcpUserId, corsHeaders, handleOptions } from '../../../_mcp-auth';
import { ensureMcpTables } from '../../_ensure-tables';

export function OPTIONS() {
  return handleOptions();
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isMcpAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders });
  }
  try {
    await ensureMcpTables();
    const { id } = await params;
    const sql = neon(process.env.POSTGRES_URL!);
    const userId = getMcpUserId();
    const fields = (await request.json()) as Partial<{
      name: string;
      emoji: string;
      type: string;
      size: string;
      notes: string;
      on_hold: boolean;
      diagram_id: string;
    }>;
    const rows = await sql`
      UPDATE containers SET
        name       = COALESCE(${fields.name !== undefined ? fields.name : null}, name),
        emoji      = COALESCE(${fields.emoji !== undefined ? fields.emoji : null}, emoji),
        type       = COALESCE(${fields.type !== undefined ? fields.type : null}, type),
        size       = COALESCE(${fields.size !== undefined ? fields.size : null}, size),
        notes      = COALESCE(${fields.notes !== undefined ? fields.notes : null}, notes),
        on_hold    = COALESCE(${fields.on_hold !== undefined ? fields.on_hold : null}, on_hold),
        diagram_id = COALESCE(${fields.diagram_id !== undefined ? fields.diagram_id : null}, diagram_id),
        updated_at = NOW()
      WHERE user_id = ${userId} AND id = ${id}
      RETURNING *
    `;
    if (rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404, headers: corsHeaders });
    return NextResponse.json(rows[0], { headers: corsHeaders });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500, headers: corsHeaders });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isMcpAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders });
  }
  try {
    await ensureMcpTables();
    const { id } = await params;
    const sql = neon(process.env.POSTGRES_URL!);
    const userId = getMcpUserId();
    await sql`DELETE FROM containers WHERE user_id = ${userId} AND id = ${id}`;
    return new NextResponse(null, { status: 204, headers: corsHeaders });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500, headers: corsHeaders });
  }
}
