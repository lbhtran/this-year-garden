// TEMPORARY DEBUG ROUTE — DELETE AFTER DEBUGGING
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const received = request.headers.get('x-api-key');
  const stored = process.env.MCP_API_KEY;
  return NextResponse.json({
    received,
    stored_length: stored?.length,
    received_length: received?.length,
    match: received === stored,
  });
}
