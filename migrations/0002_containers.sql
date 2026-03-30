-- Migration 0002: containers table

CREATE TABLE IF NOT EXISTS containers (
  user_id    TEXT        NOT NULL,
  id         TEXT        NOT NULL,
  emoji      TEXT,
  name       TEXT        NOT NULL,
  type       TEXT        NOT NULL,  -- 'pot' | 'planter' | 'raised_bed' | 'grow_bag' | 'trellis_planter'
  size       TEXT,
  notes      TEXT,
  on_hold    BOOLEAN     NOT NULL DEFAULT FALSE,
  diagram_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, id)
);
