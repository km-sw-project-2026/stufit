CREATE TABLE IF NOT EXISTS social_accounts (
  provider TEXT NOT NULL,
  social_id TEXT NOT NULL,
  user_id INTEGER NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (provider, social_id)
);
