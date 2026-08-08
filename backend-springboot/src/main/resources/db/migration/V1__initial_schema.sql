-- Users
CREATE TABLE users (
    id       BIGSERIAL PRIMARY KEY,
    username VARCHAR(50)  NOT NULL,
    password VARCHAR(100) NOT NULL,
    role     VARCHAR(20)  NOT NULL DEFAULT 'ROLE_USER',
    CONSTRAINT uq_users_username UNIQUE (username)
);

-- Tasks (owned by a user)
CREATE TABLE task (
    id          BIGSERIAL PRIMARY KEY,
    title       VARCHAR(100)  NOT NULL,
    description VARCHAR(1000) NOT NULL,
    status      VARCHAR(20)   NOT NULL,
    priority    VARCHAR(20)   NOT NULL DEFAULT 'MEDIUM',
    due_date    DATE,
    user_id     BIGINT        NOT NULL,
    CONSTRAINT fk_task_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE INDEX idx_task_user_id ON task (user_id);
CREATE INDEX idx_task_status ON task (status);
