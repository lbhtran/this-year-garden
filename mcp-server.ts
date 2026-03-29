#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const BASE_URL = process.env.GARDEN_API_URL ?? '';
const API_KEY = process.env.GARDEN_API_KEY ?? '';

function headers() {
  return {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY,
  };
}

async function apiFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { ...headers(), ...(options?.headers as Record<string, string> ?? {}) },
  });
  if (res.status === 204) return null;
  return res.json();
}

const server = new McpServer({
  name: 'this-year-garden',
  version: '1.0.0',
});

// ── Plants ────────────────────────────────────────────────────────────────────

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

// ── Shopping ──────────────────────────────────────────────────────────────────

server.tool('list_shopping', 'List all shopping items', {}, async () => {
  const data = await apiFetch('/api/mcp/shopping');
  return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
});

server.tool(
  'add_shopping_item',
  'Add or upsert a shopping item',
  {
    id: z.string().describe('Unique shopping item identifier'),
    name: z.string().describe('Item name'),
    category: z.string().optional().describe('Item category'),
    bought: z.boolean().optional().describe('Whether the item has been bought'),
  },
  async (params) => {
    const data = await apiFetch('/api/mcp/shopping', {
      method: 'POST',
      body: JSON.stringify(params),
    });
    return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
  },
);

server.tool(
  'update_shopping_item',
  'Update an existing shopping item by id',
  {
    id: z.string().describe('Shopping item id to update'),
    name: z.string().optional().describe('Item name'),
    category: z.string().optional().describe('Item category'),
    bought: z.boolean().optional().describe('Whether the item has been bought'),
  },
  async ({ id, ...fields }) => {
    const data = await apiFetch(`/api/mcp/shopping/${id}`, {
      method: 'PUT',
      body: JSON.stringify(fields),
    });
    return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
  },
);

server.tool(
  'delete_shopping_item',
  'Delete a shopping item by id',
  { id: z.string().describe('Shopping item id to delete') },
  async ({ id }) => {
    await apiFetch(`/api/mcp/shopping/${id}`, { method: 'DELETE' });
    return { content: [{ type: 'text', text: `Shopping item ${id} deleted.` }] };
  },
);

// ── Start ─────────────────────────────────────────────────────────────────────

const transport = new StdioServerTransport();
await server.connect(transport);
