// Returns true if the request has a valid MCP API key
export function isMcpAuthenticated(request: Request): boolean {
  const apiKey = process.env.MCP_API_KEY;
  if (!apiKey) return false; // key not configured = deny
  return request.headers.get('x-api-key') === apiKey;
}
