import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET() {
  const sql = neon(process.env.POSTGRES_URL!);
  const rows = await sql`SELECT * FROM plant_allocations ORDER BY container_id, sort_order`;
  return NextResponse.json(rows);
}
