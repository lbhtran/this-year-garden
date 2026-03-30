-- Migration 0003: plant_allocations table
-- Note: no FK constraints — MCP-managed rows use user_id='mcp' while web-app
-- plants/containers may carry a Clerk user_id, so cross-user references are
-- intentional and FK enforcement would block valid inserts.

CREATE TABLE IF NOT EXISTS plant_allocations (
  user_id      TEXT        NOT NULL,
  id           TEXT        NOT NULL,
  plant_id     TEXT        NOT NULL,
  container_id TEXT        NOT NULL,
  zone         TEXT,
  status       TEXT        NOT NULL DEFAULT 'current',  -- 'past' | 'current' | 'future'
  sort_order   INTEGER     NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, id)
);
