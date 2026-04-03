import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { isMcpAuthenticated, getMcpUserId, corsHeaders, handleOptions } from '../../_mcp-auth';

export function OPTIONS() {
  return handleOptions();
}

export async function GET(request: Request) {
  if (!isMcpAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders });
  }
  const sql = neon(process.env.POSTGRES_URL!);
  const userId = getMcpUserId();
  const rows = await sql`SELECT * FROM shopping_items WHERE user_id = ${userId} ORDER BY id`;
  return NextResponse.json(rows, { headers: corsHeaders });
}

export async function POST(request: Request) {
  if (!isMcpAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders });
  }
  const sql = neon(process.env.POSTGRES_URL!);
  const body = (await request.json()) as {
    id: string;
    name: string;
    category?: string;
    bought?: boolean;
  };
  const { id, name, category, bought } = body;
  const userId = getMcpUserId();
  const rows = await sql`
    INSERT INTO shopping_items (user_id, id, name, category, bought, updated_at)
    VALUES (${userId}, ${id}, ${name}, ${category ?? null}, ${bought ?? false}, NOW())
    ON CONFLICT (user_id, id) DO UPDATE SET
      name = EXCLUDED.name,
      category = EXCLUDED.category,
      bought = EXCLUDED.bought,
      updated_at = NOW()
    RETURNING *
  `;
  return NextResponse.json(rows[0], { headers: corsHeaders });
}
