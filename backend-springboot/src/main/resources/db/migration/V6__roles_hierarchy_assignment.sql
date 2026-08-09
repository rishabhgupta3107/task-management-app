-- ----- Organisational hierarchy on users -----
ALTER TABLE users ADD COLUMN org_role   VARCHAR(20) NOT NULL DEFAULT 'WORKER';
ALTER TABLE users ADD COLUMN manager_id BIGINT;
ALTER TABLE users ADD CONSTRAINT fk_users_manager FOREIGN KEY (manager_id) REFERENCES users (id);
CREATE INDEX idx_users_manager ON users (manager_id);

-- Seed user is the top manager.
UPDATE users SET org_role = 'MANAGER' WHERE username = 'rishabh';

-- ----- Task assignment (assignee separate from creator) -----
ALTER TABLE task ADD COLUMN assignee_id BIGINT;
UPDATE task SET assignee_id = user_id WHERE assignee_id IS NULL;
ALTER TABLE task ALTER COLUMN assignee_id SET NOT NULL;
ALTER TABLE task ADD CONSTRAINT fk_task_assignee FOREIGN KEY (assignee_id) REFERENCES users (id);
CREATE INDEX idx_task_assignee ON task (assignee_id);
