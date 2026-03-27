import { NextResponse } from 'next/server';

// Returns true if the request has a valid MCP API key
export function isMcpAuthenticated(request: Request): boolean {
  const apiKey = process.env.MCP_API_KEY;
  if (!apiKey) return false; // key not configured = deny
  return request.headers.get('x-api-key') === apiKey;
}

// CORS headers required for cross-origin clients (Claude mobile, external tools)
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-api-key',
};

// Handles CORS preflight (OPTIONS) requests
export function handleOptions() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}
