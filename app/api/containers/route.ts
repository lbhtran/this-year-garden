import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { getAuthenticatedUserId } from '../_auth';

export async function GET() {
  const sql = neon(process.env.POSTGRES_URL!);
  const rows = await sql`SELECT * FROM containers ORDER BY id`;
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const userId = await getAuthenticatedUserId(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const sql = neon(process.env.POSTGRES_URL!);
  const body = (await request.json()) as {
    id: string;
    name: string;
    emoji?: string;
    type?: string;
    size?: string;
    notes?: string;
    on_hold?: boolean;
    diagram_id?: string;
  };
  const { id, name, emoji, type, size, notes, on_hold, diagram_id } = body;
  const rows = await sql`
    INSERT INTO containers (user_id, id, name, emoji, type, size, notes, on_hold, diagram_id, updated_at)
    VALUES (${userId}, ${id}, ${name}, ${emoji ?? null}, ${type ?? null}, ${size ?? null}, ${notes ?? null}, ${on_hold ?? false}, ${diagram_id ?? null}, NOW())
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
  return NextResponse.json(rows[0]);
}
