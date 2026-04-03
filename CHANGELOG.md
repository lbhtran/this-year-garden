# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- `mcp-server-http.ts` — standalone HTTP MCP server exposing plants, containers, and allocations tools; authenticates inbound requests via `MCP_SERVER_SECRET` and forwards to `/api/mcp/*` using `MCP_API_KEY`
- `.github/copilot-coding-agent.yml` — repository-level config so the GitHub Copilot cloud agent can connect to the remote MCP server
- `npm run start:mcp-http` script to launch the HTTP MCP server
- `.env.example` entries for `MCP_SERVER_SECRET` and `GARDEN_API_URL`
- Updated `README-mcp.md` with remote MCP server deployment guide (Render / Fly.io), environment variable reference, and GitHub Copilot cloud agent setup steps
