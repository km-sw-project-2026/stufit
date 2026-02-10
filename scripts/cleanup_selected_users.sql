BEGIN TRANSACTION;

-- Delete child records referencing these users
DELETE FROM challenge_members WHERE user_id IN (7,8,9,10,11);
DELETE FROM challenge_daily_progress WHERE user_id IN (7,8,9,10,11);
DELETE FROM challenge_results WHERE user_id IN (7,8,9,10,11);
DELETE FROM point_logs WHERE user_id IN (7,8,9,10,11);
DELETE FROM attendance_logs WHERE user_id IN (7,8,9,10,11);
DELETE FROM user_profiles WHERE user_id IN (7,8,9,10,11);
DELETE FROM user_items WHERE user_id IN (7,8,9,10,11);
DELETE FROM item_wishlist WHERE user_id IN (7,8,9,10,11);
DELETE FROM megaphone_logs WHERE user_id IN (7,8,9,10,11);
DELETE FROM post_likes WHERE user_id IN (7,8,9,10,11);
DELETE FROM comment_likes WHERE user_id IN (7,8,9,10,11);
DELETE FROM comments WHERE user_id IN (7,8,9,10,11);
DELETE FROM posts WHERE user_id IN (7,8,9,10,11);

-- Finally delete users
DELETE FROM users WHERE user_id IN (7,8,9,10,11);

COMMIT;