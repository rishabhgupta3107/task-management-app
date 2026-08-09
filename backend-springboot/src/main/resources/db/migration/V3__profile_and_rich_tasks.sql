-- ----- User profile fields -----
ALTER TABLE users ADD COLUMN full_name  VARCHAR(100);
ALTER TABLE users ADD COLUMN email      VARCHAR(150);
ALTER TABLE users ADD COLUMN dob        DATE;
ALTER TABLE users ADD COLUMN avatar_url VARCHAR(500);
ALTER TABLE users ADD COLUMN title      VARCHAR(100);
ALTER TABLE users ADD COLUMN bio        VARCHAR(500);
ALTER TABLE users ADD COLUMN timezone   VARCHAR(64);
ALTER TABLE users ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT now();

-- ----- Task timestamps -----
ALTER TABLE task ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT now();
ALTER TABLE task ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT now();

-- ----- Tags -----
CREATE TABLE task_tags (
    task_id BIGINT      NOT NULL REFERENCES task (id) ON DELETE CASCADE,
    tag     VARCHAR(40) NOT NULL
);
CREATE INDEX idx_task_tags_task ON task_tags (task_id);

-- ----- Subtasks (ordered collection) -----
CREATE TABLE task_subtasks (
    task_id  BIGINT       NOT NULL REFERENCES task (id) ON DELETE CASCADE,
    position INT          NOT NULL,
    title    VARCHAR(200) NOT NULL,
    done     BOOLEAN      NOT NULL DEFAULT false,
    PRIMARY KEY (task_id, position)
);

-- ----- Enrich the seed user + tasks -----
UPDATE users
SET full_name = 'Rishabh Gupta',
    email     = 'hrrishu0001@gmail.com',
    title     = 'Founder & Operator',
    bio       = 'Building HELM — mission control for people who move fast.',
    timezone  = 'Asia/Kolkata',
    dob       = '1997-07-31'
WHERE username = 'rishabh';

INSERT INTO task_tags (task_id, tag)
SELECT id, 'seed' FROM task WHERE title IN ('Task 1', 'Task 2', 'Task 3');
