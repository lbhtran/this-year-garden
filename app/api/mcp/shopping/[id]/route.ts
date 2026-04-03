import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { isMcpAuthenticated, getMcpUserId, corsHeaders, handleOptions } from '../../../_mcp-auth';

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
  const { id } = await params;
  const sql = neon(process.env.POSTGRES_URL!);
  const userId = getMcpUserId();
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
    WHERE user_id = ${userId} AND id = ${id}
    RETURNING *
  `;
  if (rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404, headers: corsHeaders });
  return NextResponse.json(rows[0], { headers: corsHeaders });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isMcpAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders });
  }
  const { id } = await params;
  const sql = neon(process.env.POSTGRES_URL!);
  const userId = getMcpUserId();
  await sql`DELETE FROM shopping_items WHERE user_id = ${userId} AND id = ${id}`;
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}
