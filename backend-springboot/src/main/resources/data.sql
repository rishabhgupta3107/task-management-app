-- Initialize example data for tasks
INSERT INTO TASK (id, title, description, status, due_date) VALUES (1, 'Task 1', 'Description for task 1', 'TO_DO', '2023-12-01');
INSERT INTO TASK (id, title, description, status, due_date) VALUES (2, 'Task 2', 'Description for task 2', 'IN_PROGRESS', '2023-12-02');
INSERT INTO TASK (id, title, description, status, due_date) VALUES (3, 'Task 3', 'Description for task 3', 'DONE', '2023-12-03');

-- User info
INSERT INTO USERS (username, password) VALUES ('rishabh', '$2y$10$f.68ZWHYdWOAtqzvr1MihOLny7o5CNiymk1C9.6IDasrAxYJOXZCy'); -- password