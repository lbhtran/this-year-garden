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
      name       = ${fields.name       ?? null},
      emoji      = ${fields.emoji      ?? null},
      type       = ${fields.type       ?? null},
      size       = ${fields.size       ?? null},
      notes      = ${fields.notes      ?? null},
      on_hold    = ${fields.on_hold    ?? false},
      diagram_id = ${fields.diagram_id ?? null},
      updated_at = NOW()
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
  await sql`DELETE FROM containers WHERE user_id = ${userId} AND id = ${id}`;
  return new NextResponse(null, { status: 204 });
}
