-- Migration 0001: initial schema with per-user row ownership

CREATE TABLE IF NOT EXISTS plants (
  user_id         TEXT        NOT NULL,
  id              TEXT        NOT NULL,
  name            TEXT        NOT NULL,
  emoji           TEXT,
  stage           TEXT        NOT NULL DEFAULT 'seedling',
  next_step       TEXT,
  placement       TEXT,
  min_temp        INTEGER,
  frost_sensitive BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, id)
);

CREATE TABLE IF NOT EXISTS shopping_items (
  user_id    TEXT        NOT NULL,
  id         TEXT        NOT NULL,
  name       TEXT        NOT NULL,
  category   TEXT,
  bought     BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, id)
);
