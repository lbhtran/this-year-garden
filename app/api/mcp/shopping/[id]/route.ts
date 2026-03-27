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
    category: string;
    bought: boolean;
  }>;
  const rows = await sql`
    UPDATE shopping_items SET
      name = COALESCE(${fields.name !== undefined ? fields.name : null}, name),
      category = COALESCE(${fields.category !== undefined ? fields.category : null}, category),
      bought = COALESCE(${fields.bought !== undefined ? fields.bought : null}, bought),
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
  await sql`DELETE FROM shopping_items WHERE id = ${id}`;
  return new NextResponse(null, { status: 204 });
}
