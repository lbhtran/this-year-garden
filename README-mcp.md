# MCP Setup Guide

This guide explains how to connect Claude to your garden app via the Model Context Protocol (MCP).

---

## How it works

- **Claude Desktop** connects natively via the MCP server (`mcp-server.ts`) running as a local subprocess.
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
- PUT    /api/mcp/plants/:id          — update a plant
- DELETE /api/mcp/plants/:id          — delete a plant
- GET    /api/mcp/shopping            — list all shopping items
- POST   /api/mcp/shopping            — add a shopping item { id, name, category, bought }
- PUT    /api/mcp/shopping/:id        — update a shopping item
- DELETE /api/mcp/shopping/:id        — delete a shopping item
```

Replace `https://your-app.vercel.app` with your actual deployed URL and `your-secret-key-here` with your `MCP_API_KEY` value.

Claude will be able to reason about which API calls to make and can generate `fetch` requests or `curl` commands for you to execute.
