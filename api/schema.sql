-- Plants table (replaces localStorage plant stages)
CREATE TABLE IF NOT EXISTS plants (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  emoji TEXT,
  stage TEXT NOT NULL DEFAULT 'sown',
  next_step TEXT,
  placement TEXT,
  min_temp INTEGER,
  frost_sensitive BOOLEAN DEFAULT false,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Shopping items table (replaces localStorage shopping state)
CREATE TABLE IF NOT EXISTS shopping_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  bought BOOLEAN DEFAULT false,
  updated_at TIMESTAMP DEFAULT NOW()
);
