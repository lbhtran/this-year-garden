import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET() {
  const sql = neon(process.env.POSTGRES_URL!);
  const rows = await sql`SELECT * FROM containers ORDER BY id`;
  return NextResponse.json(rows);
}
