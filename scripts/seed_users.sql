-- Seed some users and scores into D1 (Cloudflare D1 / SQLite)
PRAGMA foreign_keys = ON;

BEGIN TRANSACTION;

-- Insert users (username, password, created_at)
INSERT INTO users (username, password, created_at) VALUES ('admin', '1234', '2026-01-25');
INSERT INTO users (username, password, created_at) VALUES ('km08', '1111', '2026-02-09');
INSERT INTO users (username, password, created_at) VALUES ('이종민', '123', '2026-02-10');
INSERT INTO users (username, password, created_at) VALUES ('qkrgustj', '123456', '2026-02-10');
INSERT INTO users (username, password, created_at) VALUES ('miniani', '1015', '2026-02-10');
INSERT INTO users (username, password, created_at) VALUES ('aaaa', '1111', '2026-02-10');
INSERT INTO users (username, password, created_at) VALUES ('asasas', '123', '2026-02-10');
INSERT INTO users (username, password, created_at) VALUES ('sdsd', '123', '2026-02-10');
INSERT INTO users (username, password, created_at) VALUES ('admin2', 'admin123!!', '2026-02-10');
INSERT INTO users (username, password, created_at) VALUES ('quick_test_user_1', 'pass1234', '2026-02-10');
INSERT INTO users (username, password, created_at) VALUES ('dwdw', '123', '2026-02-11');
INSERT INTO users (username, password, created_at) VALUES ('tlqkf', '123456', '2026-02-11');
INSERT INTO users (username, password, created_at) VALUES ('qkrdmstj', '123456', '2026-02-11');
INSERT INTO users (username, password, created_at) VALUES ('dfdf', '123', '2026-02-11');
INSERT INTO users (username, password, created_at) VALUES ('dadadada', '123', '2026-02-13');
INSERT INTO users (username, password, created_at) VALUES ('wq', '123', '2026-02-13');
INSERT INTO users (username, password, created_at) VALUES ('w', '123', '2026-02-13');
INSERT INTO users (username, password, created_at) VALUES ('ww', '123', '2026-02-13');
INSERT INTO users (username, password, created_at) VALUES ('wwww', '123', '2026-02-13');
INSERT INTO users (username, password, created_at) VALUES ('wwwww', '123', '2026-02-13');
INSERT INTO users (username, password, created_at) VALUES ('www', '123', '2026-02-13');
INSERT INTO users (username, password, created_at) VALUES ('q', '123', '2026-02-13');
INSERT INTO users (username, password, created_at) VALUES ('qq', '123', '2026-02-13');
INSERT INTO users (username, password, created_at) VALUES ('qqq', '123', '2026-02-13');

-- Insert matching user_profiles with sample scores and points
INSERT INTO user_profiles (user_id, points, score) VALUES ((SELECT user_id FROM users WHERE username='admin'), 500, 3447);
INSERT INTO user_profiles (user_id, points, score) VALUES ((SELECT user_id FROM users WHERE username='km08'), 200, 1998);
INSERT INTO user_profiles (user_id, points, score) VALUES ((SELECT user_id FROM users WHERE username='이종민'), 150, 1358);
INSERT INTO user_profiles (user_id, points, score) VALUES ((SELECT user_id FROM users WHERE username='qkrgustj'), 80, 985);
INSERT INTO user_profiles (user_id, points, score) VALUES ((SELECT user_id FROM users WHERE username='miniani'), 60, 820);
INSERT INTO user_profiles (user_id, points, score) VALUES ((SELECT user_id FROM users WHERE username='aaaa'), 40, 750);
INSERT INTO user_profiles (user_id, points, score) VALUES ((SELECT user_id FROM users WHERE username='quick_test_user_1'), 10, 100);
INSERT INTO user_profiles (user_id, points, score) VALUES ((SELECT user_id FROM users WHERE username='dwdw'), 5, 50);

COMMIT;

-- Verify: SELECT username, score FROM users u JOIN user_profiles up ON up.user_id = u.user_id ORDER BY up.score DESC;
