import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { isMcpAuthenticated } from '../../../_mcp-auth';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isMcpAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  const sql = neon(process.env.POSTGRES_URL!);
  const fields = (await request.json()) as Partial<{
    name: string;
    emoji: string;
    stage: string;
    next_step: string;
    placement: string;
    min_temp: number;
    frost_sensitive: boolean;
  }>;
  const rows = await sql`
    UPDATE plants SET
      name = COALESCE(${fields.name !== undefined ? fields.name : null}, name),
      emoji = COALESCE(${fields.emoji !== undefined ? fields.emoji : null}, emoji),
      stage = COALESCE(${fields.stage !== undefined ? fields.stage : null}, stage),
      next_step = COALESCE(${fields.next_step !== undefined ? fields.next_step : null}, next_step),
      placement = COALESCE(${fields.placement !== undefined ? fields.placement : null}, placement),
      min_temp = COALESCE(${fields.min_temp !== undefined ? fields.min_temp : null}, min_temp),
      frost_sensitive = COALESCE(${fields.frost_sensitive !== undefined ? fields.frost_sensitive : null}, frost_sensitive),
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;
  if (rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(rows[0]);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isMcpAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  const sql = neon(process.env.POSTGRES_URL!);
  await sql`DELETE FROM plants WHERE id = ${id}`;
  return new NextResponse(null, { status: 204 });
}
