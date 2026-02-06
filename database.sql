PRAGMA defer_foreign_keys=TRUE;
CREATE TABLE users (
  user_id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "users" VALUES(1,'admin','1234','2026-01-25 03:45:23');
CREATE TABLE user_profiles (
  user_id INTEGER PRIMARY KEY,
  profile_image_item_id INTEGER,
  profile_border_item_id INTEGER,
  profile_background_item_id INTEGER,
  tier TEXT NOT NULL DEFAULT 'bronze',
  score INTEGER NOT NULL DEFAULT 0,
  points INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);
CREATE TABLE point_logs (
  point_log_id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  point INTEGER NOT NULL,
  reason TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);
CREATE TABLE attendance_logs (
  user_id INTEGER NOT NULL,
  date TEXT NOT NULL,
  PRIMARY KEY (user_id, date),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);
CREATE TABLE items (
  item_id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  price INTEGER NOT NULL,
  image_url TEXT
);
CREATE TABLE user_items (
  user_id INTEGER NOT NULL,
  item_id INTEGER NOT NULL,
  PRIMARY KEY (user_id, item_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (item_id) REFERENCES items(item_id)
);
CREATE TABLE item_wishlist (
  user_id INTEGER NOT NULL,
  item_id INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, item_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (item_id) REFERENCES items(item_id)
);
CREATE TABLE megaphone_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  item_id INTEGER NOT NULL,
  target_type TEXT NOT NULL,
  target_id INTEGER NOT NULL,
  used_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (item_id) REFERENCES items(item_id)
);
CREATE TABLE challenges (
  challenge_id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_by_user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  goal TEXT NOT NULL,
  end_date TEXT NOT NULL,
  max_members INTEGER NOT NULL,
  is_private INTEGER NOT NULL DEFAULT 0,
  challenge_code TEXT,
  category TEXT NOT NULL,
  timer_hours INTEGER DEFAULT 0,
  timer_minutes INTEGER DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TEXT,
  FOREIGN KEY (created_by_user_id) REFERENCES users(user_id)
);
CREATE TABLE challenge_members (
  challenge_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  joined_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (challenge_id, user_id),
  FOREIGN KEY (challenge_id) REFERENCES challenges(challenge_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);
CREATE TABLE challenge_daily_progress (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  challenge_id INTEGER NOT NULL,
  date TEXT NOT NULL,
  study_time_minutes INTEGER DEFAULT 0,
  is_checked INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (challenge_id) REFERENCES challenges(challenge_id)
);
CREATE TABLE challenge_results (
  user_id INTEGER NOT NULL,
  challenge_id INTEGER NOT NULL,
  score INTEGER NOT NULL,
  PRIMARY KEY (user_id, challenge_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (challenge_id) REFERENCES challenges(challenge_id)
);
CREATE TABLE posts (
  post_id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  view_count INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT,
  deleted_at TEXT,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);
INSERT INTO "posts" VALUES(1,1,'test','test',0,'2026-01-25 03:45:26',NULL,NULL);
CREATE TABLE post_likes (
  post_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (post_id, user_id),
  FOREIGN KEY (post_id) REFERENCES posts(post_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);
CREATE TABLE comments (
  comment_id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts(post_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);
CREATE TABLE comment_likes (
  comment_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (comment_id, user_id),
  FOREIGN KEY (comment_id) REFERENCES comments(comment_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);
DELETE FROM sqlite_sequence;
INSERT INTO "sqlite_sequence" VALUES('users',1);
INSERT INTO "sqlite_sequence" VALUES('posts',1);
