-- Add popular_reward_paid column to posts table
ALTER TABLE posts ADD COLUMN popular_reward_paid INTEGER NOT NULL DEFAULT 0;
