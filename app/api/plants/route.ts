import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { getAuthenticatedUserId } from '../_auth';

export async function GET(request: Request) {
  const userId = await getAuthenticatedUserId(request);
  if (!userId) {
    return NextResponse.json([]);
  }
  const sql = neon(process.env.POSTGRES_URL!);
  const rows = await sql`SELECT * FROM plants WHERE user_id = ${userId} ORDER BY id`;
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
    stage: string;
    next_step?: string;
    placement?: string;
    min_temp?: number;
    frost_sensitive?: boolean;
  };
  const { id, name, emoji, stage, next_step, placement, min_temp, frost_sensitive } = body;
  const rows = await sql`
    INSERT INTO plants (user_id, id, name, emoji, stage, next_step, placement, min_temp, frost_sensitive, updated_at)
    VALUES (${userId}, ${id}, ${name}, ${emoji ?? null}, ${stage}, ${next_step ?? null}, ${placement ?? null}, ${min_temp ?? null}, ${frost_sensitive ?? false}, NOW())
    ON CONFLICT (user_id, id) DO UPDATE SET
      name = EXCLUDED.name,
      emoji = EXCLUDED.emoji,
      stage = EXCLUDED.stage,
      next_step = EXCLUDED.next_step,
      placement = EXCLUDED.placement,
      min_temp = EXCLUDED.min_temp,
      frost_sensitive = EXCLUDED.frost_sensitive,
      updated_at = NOW()
    RETURNING *
  `;
  return NextResponse.json(rows[0]);
}
