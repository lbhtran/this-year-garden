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

/**
 * Returns the Clerk user ID that MCP requests should operate as.
 * Set MCP_OWNER_USER_ID to your Clerk userId (e.g. "user_abc123") so that
 * MCP writes land on the same rows as the web app.
 * Falls back to 'mcp' if not configured (preserves existing behaviour).
 */
export function getMcpUserId(): string {
  return process.env.MCP_OWNER_USER_ID ?? 'mcp';
}
