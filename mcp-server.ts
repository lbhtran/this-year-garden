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

// ── Containers ────────────────────────────────────────────────────────────────

server.tool('list_containers', 'List all containers with their plant allocations', {}, async () => {
  const data = await apiFetch('/api/mcp/containers');
  return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
});

server.tool(
  'create_container',
  'Add or upsert a container in the garden',
  {
    id: z.string().describe('Unique container identifier'),
    name: z.string().describe('Container name'),
    type: z.string().describe("Container type: 'pot' | 'planter' | 'raised_bed' | 'grow_bag' | 'trellis_planter'"),
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

// ── Allocations ───────────────────────────────────────────────────────────────

server.tool('list_allocations', 'List all plant-to-container allocations', {}, async () => {
  const data = await apiFetch('/api/mcp/allocations');
  return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
});

server.tool(
  'create_allocation',
  'Add or upsert a plant-to-container allocation',
  {
    id: z.string().describe('Unique allocation identifier'),
    plant_id: z.string().describe('ID of the plant being allocated'),
    container_id: z.string().describe('ID of the container receiving the plant'),
    zone: z.string().optional().describe("Zone within the container (e.g. 'Side A', 'centre')"),
    status: z.string().optional().describe("Allocation status: 'past' | 'current' | 'future' (default: 'current')"),
    sort_order: z.number().optional().describe('Ordering within a container journey (default: 0)'),
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
    status: z.string().optional().describe("Allocation status: 'past' | 'current' | 'future'"),
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

// ── Start ─────────────────────────────────────────────────────────────────────

const transport = new StdioServerTransport();
await server.connect(transport);
