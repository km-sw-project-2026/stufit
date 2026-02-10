-- schema for point_logs
SELECT * FROM pragma_table_info('point_logs');

-- schema for user_profiles
SELECT * FROM pragma_table_info('user_profiles');

-- count point_logs rows
SELECT COUNT(*) as point_logs_count FROM point_logs;

-- last 10 point_logs
SELECT * FROM point_logs ORDER BY created_at DESC LIMIT 10;

-- sample user_profiles for admin
SELECT user_id, points, score FROM user_profiles WHERE user_id = 1;
