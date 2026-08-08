-- Seed user. Credentials: rishabh / password  (BCrypt hash, cost 10).
INSERT INTO users (username, password, role)
VALUES ('rishabh', '$2a$10$NBgK87OWFpG53jLytBB63.4w2e15uMECXQnkL4NIv2s5RSPgkWpR6', 'ROLE_USER');

-- Example tasks owned by the seed user.
INSERT INTO task (title, description, status, priority, due_date, user_id)
VALUES ('Task 1', 'Description for task 1', 'TO_DO', 'HIGH', '2026-12-01',
        (SELECT id FROM users WHERE username = 'rishabh')),
       ('Task 2', 'Description for task 2', 'IN_PROGRESS', 'MEDIUM', '2026-12-02',
        (SELECT id FROM users WHERE username = 'rishabh')),
       ('Task 3', 'Description for task 3', 'DONE', 'LOW', '2026-12-03',
        (SELECT id FROM users WHERE username = 'rishabh'));
