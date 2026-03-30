import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { isMcpAuthenticated, corsHeaders, handleOptions } from '../../../_mcp-auth';
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
    const fields = (await request.json()) as Partial<{
      plant_id: string;
      container_id: string;
      zone: string;
      status: string;
      sort_order: number;
    }>;
    const rows = await sql`
      UPDATE plant_allocations SET
        plant_id     = COALESCE(${fields.plant_id !== undefined ? fields.plant_id : null}, plant_id),
        container_id = COALESCE(${fields.container_id !== undefined ? fields.container_id : null}, container_id),
        zone         = COALESCE(${fields.zone !== undefined ? fields.zone : null}, zone),
        status       = COALESCE(${fields.status !== undefined ? fields.status : null}, status),
        sort_order   = COALESCE(${fields.sort_order !== undefined ? fields.sort_order : null}, sort_order),
        updated_at   = NOW()
      WHERE id = ${id}
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
    await sql`DELETE FROM plant_allocations WHERE id = ${id}`;
    return new NextResponse(null, { status: 204, headers: corsHeaders });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500, headers: corsHeaders });
  }
}
