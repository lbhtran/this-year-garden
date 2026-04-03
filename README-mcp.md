# MCP Setup Guide

This guide explains how to connect AI assistants to your garden app via the Model Context Protocol (MCP).

---

## How it works

- **Claude Desktop** connects natively via the MCP server (`mcp-server.ts`) running as a local subprocess.
- **GitHub Copilot cloud agent** (and other remote MCP clients) connect to the HTTP MCP server (`mcp-server-http.ts`) running as a network service.
- **Claude mobile** (which doesn't support MCP natively) can interact with the same data through the REST API endpoints at `/api/mcp/`, secured by an API key.

---

## 1. Generate a secret API key

Run the following command to generate a cryptographically strong secret:

```bash
openssl rand -hex 32
```

Keep this value — you'll need it in both Vercel and your Claude Desktop config.

---

## 2. Add `MCP_API_KEY` to Vercel

1. Go to your Vercel project → **Settings** → **Environment Variables**
2. Add a new variable:
   - **Name:** `MCP_API_KEY`
   - **Value:** the secret you generated above
3. Redeploy your app for the variable to take effect

---

## 3. Claude Desktop setup

Add the following to your Claude Desktop configuration file (`claude_desktop_config.json`):

| Platform | Config file location |
|----------|---------------------|
| macOS    | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| Windows  | `%APPDATA%\Claude\claude_desktop_config.json` |

```json
{
  "mcpServers": {
    "this-year-garden": {
      "command": "npx",
      "args": ["tsx", "/absolute/path/to/this-year-garden/mcp-server.ts"],
      "env": {
        "GARDEN_API_URL": "https://your-app.vercel.app",
        "GARDEN_API_KEY": "your-secret-key-here"
      }
    }
  }
}
```

Replace `/absolute/path/to/this-year-garden` with the actual path to your local project clone, and fill in your real `GARDEN_API_URL` and `GARDEN_API_KEY`.

Restart Claude Desktop after saving the config. You should see the **this-year-garden** MCP server appear in the tools panel.

### Available MCP tools

| Tool | Description |
|------|-------------|
| `list_plants` | List all plants |
| `add_plant` | Add or upsert a plant |
| `update_plant` | Update a plant by id |
| `delete_plant` | Delete a plant by id |
| `list_containers` | List all containers with allocations |
| `create_container` | Add or upsert a container |
| `update_container` | Update a container by id |
| `delete_container` | Delete a container by id |
| `list_allocations` | List all plant-to-container allocations |
| `create_allocation` | Add or upsert an allocation |
| `update_allocation` | Update an allocation by id |
| `delete_allocation` | Delete an allocation by id |
| `list_shopping` | List all shopping items |
| `add_shopping_item` | Add or upsert a shopping item |
| `update_shopping_item` | Update a shopping item by id |
| `delete_shopping_item` | Delete a shopping item by id |

---

## 4. Claude mobile usage

Since Claude mobile doesn't support MCP natively, paste the following system prompt context into your Claude chat session to give Claude direct API access:

```
My garden app API is available at https://your-app.vercel.app/api/mcp
Use the header: x-api-key: your-secret-key-here

Available endpoints:
- GET    /api/mcp/plants              — list all plants
- POST   /api/mcp/plants              — add a plant { id, name, emoji, stage, next_step, placement, min_temp, frost_sensitive }
- PUT    /api/mcp/plants/:id          — update a plant (send only fields to change)
- DELETE /api/mcp/plants/:id          — delete a plant
- GET    /api/mcp/containers          — list containers with allocations
- POST   /api/mcp/containers          — add a container { id, name, type, emoji, size, notes, on_hold, diagram_id }
- PUT    /api/mcp/containers/:id      — update a container
- DELETE /api/mcp/containers/:id      — delete a container
- GET    /api/mcp/allocations         — list all plant-to-container allocations
- POST   /api/mcp/allocations         — add an allocation { id, plant_id, container_id, zone, status, sort_order }
- PUT    /api/mcp/allocations/:id     — update an allocation (e.g. set status: "past" to retire a location)
- DELETE /api/mcp/allocations/:id     — delete an allocation
- GET    /api/mcp/shopping            — list all shopping items
- POST   /api/mcp/shopping            — add a shopping item { id, name, category, bought }
- PUT    /api/mcp/shopping/:id        — update a shopping item
- DELETE /api/mcp/shopping/:id        — delete a shopping item
```

Replace `https://your-app.vercel.app` with your actual deployed URL and `your-secret-key-here` with your `MCP_API_KEY` value.

Claude will be able to reason about which API calls to make and can generate `fetch` requests or `curl` commands for you to execute.

---

## 5. Remote HTTP MCP server (`mcp-server-http.ts`)

`mcp-server-http.ts` is a standalone HTTP server that exposes the same tools as `mcp-server.ts` but listens on a network port. This is required for **cloud agents** (like GitHub Copilot cloud agent) that cannot run a local subprocess.

### Authentication (two layers)

| Layer | Variable | Where used |
|-------|----------|-----------|
| Inbound (clients → MCP server) | `MCP_SERVER_SECRET` | Clients must send `Authorization: Bearer <value>` |
| Outbound (MCP server → garden app) | `MCP_API_KEY` | Forwarded as `x-api-key` to `/api/mcp/*` |

### Environment variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `MCP_SERVER_SECRET` | **yes** | — | Shared secret for inbound client auth |
| `MCP_API_KEY` | **yes** | — | Garden REST API key (same as Vercel env var) |
| `GARDEN_API_URL` | no | `https://this-year-garden.vercel.app` | Base URL of the deployed garden app |
| `PORT` | no | `3001` | HTTP port to listen on |

### Running locally

```bash
# Generate a new server secret
openssl rand -hex 32

# Set environment variables
export MCP_SERVER_SECRET=<secret-from-above>
export MCP_API_KEY=<your-MCP_API_KEY-value>
export GARDEN_API_URL=https://this-year-garden.vercel.app   # or http://localhost:3000 for local dev

# Start the HTTP MCP server
npm run start:mcp-http
# → this-year-garden MCP HTTP server listening on port 3001
# → MCP endpoint: http://localhost:3001/mcp
```

### MCP endpoint

All MCP traffic goes to a single URL:

```
POST   /mcp   — send MCP JSON-RPC messages
GET    /mcp   — open SSE stream (requires Mcp-Session-Id from a prior POST)
DELETE /mcp   — terminate a session (requires Mcp-Session-Id)
```

---

## 6. Deploying the HTTP MCP server

The HTTP MCP server can be deployed to any Node.js-compatible platform. Choose whichever you prefer:

### Option A — Render (recommended, free tier available)

1. Create a new **Web Service** on [render.com](https://render.com)
2. Connect the `lbhtran/this-year-garden` repository
3. Set:
   - **Build command:** `npm install`
   - **Start command:** `npm run start:mcp-http`
4. Add the environment variables below under **Environment**
5. Note the public URL Render assigns (e.g. `https://this-year-garden-mcp.onrender.com`)

### Option B — Fly.io

```bash
# From the repo root
fly launch --name this-year-garden-mcp --no-deploy
fly secrets set MCP_SERVER_SECRET=<value> MCP_API_KEY=<value> GARDEN_API_URL=https://this-year-garden.vercel.app
fly deploy
```

Fly will use the `start:mcp-http` npm script if you add a `fly.toml` with:

```toml
[http_service]
  internal_port = 3001
  force_https = true

[[vm]]
  memory = "256mb"
  cpu_kind = "shared"
  cpus = 1
```

### Option C — Vercel Serverless (not recommended for streaming)

The MCP streamable-HTTP transport keeps long-lived SSE connections open, which is incompatible with Vercel's serverless function timeout. Use Render or Fly.io instead.

### Required environment variables on the host

```
MCP_SERVER_SECRET=<strong-random-secret>
MCP_API_KEY=<same-value-as-on-vercel>
GARDEN_API_URL=https://this-year-garden.vercel.app
PORT=3001
```

---

## 7. GitHub Copilot cloud agent setup

The Copilot cloud (coding) agent can call your MCP server tools when it works on issues in this repository. The configuration lives in `.github/copilot-coding-agent.yml`.

### Step 1 — Deploy the HTTP MCP server

Follow §6 above. Note the public URL (e.g. `https://this-year-garden-mcp.onrender.com`).

### Step 2 — Add repository secrets

Go to **GitHub → repository → Settings → Secrets and variables → Actions** and add:

| Secret name | Value |
|-------------|-------|
| `COPILOT_MCP_SERVER_URL` | Full MCP endpoint URL, e.g. `https://this-year-garden-mcp.onrender.com/mcp` |
| `COPILOT_MCP_SERVER_SECRET` | The `MCP_SERVER_SECRET` value you set on the host |

> **Tip:** Use **Codespaces secrets** (not Actions secrets) if you want the agent to access the MCP server from a Codespace environment.

### Step 3 — Verify the config file

The file `.github/copilot-coding-agent.yml` already references these secrets:

```yaml
mcp_servers:
  - name: this-year-garden
    type: http
    url: ${{ secrets.COPILOT_MCP_SERVER_URL }}
    headers:
      Authorization: Bearer ${{ secrets.COPILOT_MCP_SERVER_SECRET }}
```

No changes are needed — just ensure the secrets are set.

### Step 4 — Use the agent

Open or create an issue in this repository. GitHub Copilot will automatically use the configured MCP server to:
- List and update plants, containers, and allocations
- Manage the garden layout via natural-language task descriptions

> **Note:** GitHub Copilot cloud agent MCP support requires an active Copilot subscription with coding agent access. See [GitHub docs](https://docs.github.com/en/copilot/how-tos/agents/copilot-coding-agent/customizing-the-development-environment-for-copilot-coding-agent) for the latest requirements.

