import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { neon } from '@neondatabase/serverless';

export async function GET() {
  const sql = neon(process.env.POSTGRES_URL!);
  const rows = await sql`SELECT * FROM shopping_items ORDER BY id`;
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const sql = neon(process.env.POSTGRES_URL!);
  const body = (await request.json()) as {
    id: string;
    name: string;
    category?: string;
    bought?: boolean;
  };
  const { id, name, category, bought } = body;
  const rows = await sql`
    INSERT INTO shopping_items (id, name, category, bought, updated_at)
    VALUES (${id}, ${name}, ${category ?? null}, ${bought ?? false}, NOW())
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      category = EXCLUDED.category,
      bought = EXCLUDED.bought,
      updated_at = NOW()
    RETURNING *
  `;
  return NextResponse.json(rows[0]);
}
