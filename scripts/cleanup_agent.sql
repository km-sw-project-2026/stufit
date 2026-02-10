BEGIN TRANSACTION;
DELETE FROM challenge_members
 WHERE user_id IN (SELECT user_id FROM users WHERE username LIKE 'agent_test_%');

DELETE FROM users WHERE username LIKE 'agent_test_%';
COMMIT;