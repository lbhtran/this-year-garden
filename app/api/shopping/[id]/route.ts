import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { getAuthenticatedUserId } from '../../_auth';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = await getAuthenticatedUserId(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  const sql = neon(process.env.POSTGRES_URL!);
  const { bought } = (await request.json()) as { bought: boolean };
  const rows = await sql`
    UPDATE shopping_items SET bought = ${bought}, updated_at = NOW()
    WHERE user_id = ${userId} AND id = ${id}
    RETURNING *
  `;
  if (rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(rows[0]);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = await getAuthenticatedUserId(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  const sql = neon(process.env.POSTGRES_URL!);
  await sql`DELETE FROM shopping_items WHERE user_id = ${userId} AND id = ${id}`;
  return new NextResponse(null, { status: 204 });
}
