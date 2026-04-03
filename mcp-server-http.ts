#!/usr/bin/env node
/**
 * Remote HTTP MCP server for this-year-garden.
 *
 * Exposes the same tools as mcp-server.ts but listens on an HTTP port so that
 * cloud agents (e.g. GitHub Copilot cloud agent) can connect to it remotely.
 *
 * Authentication (two layers):
 *  - Inbound:  requests must carry `Authorization: Bearer <MCP_SERVER_SECRET>`
 *  - Outbound: calls to the garden REST API use `x-api-key: <MCP_API_KEY>`
 *
 * Environment variables:
 *  PORT              – HTTP port to listen on (default: 3001)
 *  MCP_SERVER_SECRET – shared secret that inbound clients must supply
 *  GARDEN_API_URL    – base URL of the deployed garden app
 *                      (default: https://this-year-garden.vercel.app)
 *  MCP_API_KEY       – API key forwarded to /api/mcp/* endpoints
 */
import * as http from 'node:http';
import { randomUUID } from 'node:crypto';

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { z } from 'zod';

// ── Config ────────────────────────────────────────────────────────────────────

const PORT = parseInt(process.env.PORT ?? '3001', 10);
const SERVER_SECRET = process.env.MCP_SERVER_SECRET ?? '';
const BASE_URL = process.env.GARDEN_API_URL ?? 'https://this-year-garden.vercel.app';
const API_KEY = process.env.MCP_API_KEY ?? '';

if (!SERVER_SECRET) {
  console.error('ERROR: MCP_SERVER_SECRET is not set. All requests will be rejected.');
  process.exit(1);
}
if (!API_KEY) {
  console.error('ERROR: MCP_API_KEY is not set. Garden API calls will fail.');
  process.exit(1);
}

// ── Garden API helper ─────────────────────────────────────────────────────────

function gardenHeaders(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY,
  };
}

async function apiFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      ...gardenHeaders(),
      ...((options?.headers as Record<string, string>) ?? {}),
    },
  });
  if (res.status === 204) return null;
  return res.json();
}

// ── Auth helper ───────────────────────────────────────────────────────────────

function isAuthenticated(authHeader: string | undefined): boolean {
  if (!authHeader) return false;
  if (!authHeader.startsWith('Bearer ')) return false;
  return authHeader.slice(7) === SERVER_SECRET;
}

// ── MCP server factory ────────────────────────────────────────────────────────
// A new McpServer is created for every stateless request so there is no
// shared mutable state between requests.

function buildMcpServer(): McpServer {
  const server = new McpServer({
    name: 'this-year-garden',
    version: '1.0.0',
  });

  // ── Plants ──────────────────────────────────────────────────────────────────

  server.tool('list_plants', 'List all plants in the garden', {}, async () => {
    const data = await apiFetch('/api/mcp/plants');
    return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
  });

  server.tool(
    'add_plant',
    'Add or upsert a plant in the garden',
    {
      id: z.string().describe('Unique plant identifier'),
      name: z.string().describe('Plant name'),
      emoji: z.string().optional().describe('Emoji representing the plant'),
      stage: z.string().describe('Growth stage (e.g. seedling, growing, harvesting)'),
      next_step: z.string().optional().describe('Next action for this plant'),
      placement: z.string().optional().describe('Where the plant is located'),
      min_temp: z.number().optional().describe('Minimum temperature tolerance (°C)'),
      frost_sensitive: z.boolean().optional().describe('Whether the plant is frost sensitive'),
    },
    async (params) => {
      const data = await apiFetch('/api/mcp/plants', {
        method: 'POST',
        body: JSON.stringify(params),
      });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    'update_plant',
    'Update an existing plant by id',
    {
      id: z.string().describe('Plant id to update'),
      name: z.string().optional().describe('Plant name'),
      emoji: z.string().optional().describe('Emoji representing the plant'),
      stage: z.string().optional().describe('Growth stage'),
      next_step: z.string().optional().describe('Next action for this plant'),
      placement: z.string().optional().describe('Where the plant is located'),
      min_temp: z.number().optional().describe('Minimum temperature tolerance (°C)'),
      frost_sensitive: z.boolean().optional().describe('Whether the plant is frost sensitive'),
    },
    async ({ id, ...fields }) => {
      const data = await apiFetch(`/api/mcp/plants/${id}`, {
        method: 'PUT',
        body: JSON.stringify(fields),
      });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    'delete_plant',
    'Delete a plant by id',
    { id: z.string().describe('Plant id to delete') },
    async ({ id }) => {
      await apiFetch(`/api/mcp/plants/${id}`, { method: 'DELETE' });
      return { content: [{ type: 'text', text: `Plant ${id} deleted.` }] };
    },
  );

  // ── Containers ──────────────────────────────────────────────────────────────

  server.tool(
    'list_containers',
    'List all containers with their plant allocations',
    {},
    async () => {
      const data = await apiFetch('/api/mcp/containers');
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    'create_container',
    'Add or upsert a container in the garden',
    {
      id: z.string().describe('Unique container identifier'),
      name: z.string().describe('Container name'),
      type: z
        .string()
        .describe(
          "Container type: 'pot' | 'planter' | 'raised_bed' | 'grow_bag' | 'trellis_planter'",
        ),
      emoji: z.string().optional().describe('Emoji representing the container'),
      size: z.string().optional().describe('Container size description'),
      notes: z.string().optional().describe('General notes about the container'),
      on_hold: z.boolean().optional().describe('Whether the container is on hold'),
      diagram_id: z.string().optional().describe('ID used for frontend diagram linking'),
    },
    async (params) => {
      const data = await apiFetch('/api/mcp/containers', {
        method: 'POST',
        body: JSON.stringify(params),
      });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    'update_container',
    'Update an existing container by id',
    {
      id: z.string().describe('Container id to update'),
      name: z.string().optional().describe('Container name'),
      type: z.string().optional().describe('Container type'),
      emoji: z.string().optional().describe('Emoji representing the container'),
      size: z.string().optional().describe('Container size description'),
      notes: z.string().optional().describe('General notes about the container'),
      on_hold: z.boolean().optional().describe('Whether the container is on hold'),
      diagram_id: z.string().optional().describe('ID used for frontend diagram linking'),
    },
    async ({ id, ...fields }) => {
      const data = await apiFetch(`/api/mcp/containers/${id}`, {
        method: 'PUT',
        body: JSON.stringify(fields),
      });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    'delete_container',
    'Delete a container by id',
    { id: z.string().describe('Container id to delete') },
    async ({ id }) => {
      await apiFetch(`/api/mcp/containers/${id}`, { method: 'DELETE' });
      return { content: [{ type: 'text', text: `Container ${id} deleted.` }] };
    },
  );

  // ── Allocations ─────────────────────────────────────────────────────────────

  server.tool(
    'list_allocations',
    'List all plant-to-container allocations',
    {},
    async () => {
      const data = await apiFetch('/api/mcp/allocations');
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    'create_allocation',
    'Add or upsert a plant-to-container allocation',
    {
      id: z.string().describe('Unique allocation identifier'),
      plant_id: z.string().describe('ID of the plant being allocated'),
      container_id: z.string().describe('ID of the container receiving the plant'),
      zone: z
        .string()
        .optional()
        .describe("Zone within the container (e.g. 'Side A', 'centre')"),
      status: z
        .string()
        .optional()
        .describe("Allocation status: 'past' | 'current' | 'future' (default: 'current')"),
      sort_order: z
        .number()
        .optional()
        .describe('Ordering within a container journey (default: 0)'),
    },
    async (params) => {
      const data = await apiFetch('/api/mcp/allocations', {
        method: 'POST',
        body: JSON.stringify(params),
      });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    'update_allocation',
    'Update an existing plant-to-container allocation by id',
    {
      id: z.string().describe('Allocation id to update'),
      plant_id: z.string().optional().describe('ID of the plant'),
      container_id: z.string().optional().describe('ID of the container'),
      zone: z.string().optional().describe('Zone within the container'),
      status: z
        .string()
        .optional()
        .describe("Allocation status: 'past' | 'current' | 'future'"),
      sort_order: z.number().optional().describe('Ordering within a container journey'),
    },
    async ({ id, ...fields }) => {
      const data = await apiFetch(`/api/mcp/allocations/${id}`, {
        method: 'PUT',
        body: JSON.stringify(fields),
      });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    'delete_allocation',
    'Delete a plant-to-container allocation by id',
    { id: z.string().describe('Allocation id to delete') },
    async ({ id }) => {
      await apiFetch(`/api/mcp/allocations/${id}`, { method: 'DELETE' });
      return { content: [{ type: 'text', text: `Allocation ${id} deleted.` }] };
    },
  );

  return server;
}

// ── HTTP server ───────────────────────────────────────────────────────────────

// Session map for stateful connections (GET /mcp streams).
const sessions = new Map<
  string,
  { transport: StreamableHTTPServerTransport; server: McpServer }
>();

function readBody(req: http.IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
    req.on('error', reject);
  });
}

const httpServer = http.createServer(async (req, res) => {
  // CORS headers (adjust origin restriction as needed)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, DELETE, OPTIONS',
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, Mcp-Session-Id',
  );

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Authentication
  if (!isAuthenticated(req.headers['authorization'])) {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Unauthorized' }));
    return;
  }

  const url = new URL(req.url ?? '/', `http://localhost:${PORT}`);

  if (url.pathname !== '/mcp') {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
    return;
  }

  try {
    if (req.method === 'POST') {
      // Parse body for the transport
      const rawBody = await readBody(req);
      const parsedBody = rawBody ? JSON.parse(rawBody) : undefined;

      // Stateful: reuse existing session if Mcp-Session-Id is provided
      const sessionId = req.headers['mcp-session-id'] as string | undefined;
      if (sessionId && sessions.has(sessionId)) {
        const { transport } = sessions.get(sessionId)!;
        await transport.handleRequest(req, res, parsedBody);
        return;
      }

      // New stateless/stateful request
      const mcpServer = buildMcpServer();
      const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
        onsessioninitialized: (id) => {
          sessions.set(id, { transport, server: mcpServer });
        },
      });

      transport.onclose = () => {
        const id = transport.sessionId;
        if (id) sessions.delete(id);
      };

      await mcpServer.connect(transport);
      await transport.handleRequest(req, res, parsedBody);
    } else if (req.method === 'GET') {
      // SSE streaming connection for server-to-client notifications
      const sessionId = req.headers['mcp-session-id'] as string | undefined;
      if (sessionId && sessions.has(sessionId)) {
        const { transport } = sessions.get(sessionId)!;
        await transport.handleRequest(req, res);
        return;
      }
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Missing or invalid Mcp-Session-Id' }));
    } else if (req.method === 'DELETE') {
      // Client-initiated session termination
      const sessionId = req.headers['mcp-session-id'] as string | undefined;
      if (sessionId && sessions.has(sessionId)) {
        const { transport, server } = sessions.get(sessionId)!;
        sessions.delete(sessionId);
        await transport.close();
        await server.close();
        res.writeHead(204);
        res.end();
        return;
      }
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Session not found' }));
    } else {
      res.writeHead(405, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Method Not Allowed' }));
    }
  } catch (err) {
    console.error('MCP request error:', err);
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
  }
});

httpServer.listen(PORT, () => {
  console.log(`this-year-garden MCP HTTP server listening on port ${PORT}`);
  console.log(`MCP endpoint: http://localhost:${PORT}/mcp`);
});
