-- Migration 0003: plant_allocations table

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
  PRIMARY KEY (user_id, id),
  FOREIGN KEY (user_id, plant_id)     REFERENCES plants(user_id, id)     ON DELETE CASCADE,
  FOREIGN KEY (user_id, container_id) REFERENCES containers(user_id, id) ON DELETE CASCADE
);
