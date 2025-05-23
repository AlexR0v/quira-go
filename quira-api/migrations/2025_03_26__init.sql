CREATE TABLE IF NOT EXISTS users
(
    id         BIGSERIAL    NOT NULL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name  VARCHAR(255) NOT NULL,
    password   VARCHAR(255) NOT NULL,
    email      VARCHAR(255) NOT NULL UNIQUE,
    role       VARCHAR(255) NOT NULL NOT NULL DEFAULT 'USER' check (role in ('USER', 'ADMIN')),
    created_at TIMESTAMP    NOT NULL          DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (first_name, last_name, email, password, role)
values ('admin',
        'admin',
        'admin@admin.com',
        '$2a$10$3eeeFDuRNY2fh.y2TS92lu2oHb1.7otZvrAdbzEa460/BwtIFVVYS',
        'ADMIN');

CREATE TABLE if not exists workspaces
(
    id          BIGSERIAL    NOT NULL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    invite_code VARCHAR(10)  NOT NULL,
    user_id     BIGINT,
    image       TEXT         NOT NULL DEFAULT '',
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE workspaces
    ADD CONSTRAINT FK_WORKSPACES_ON_USER FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE;

create table if not exists members
(
    id           BIGSERIAL    NOT NULL PRIMARY KEY,
    user_id      BIGINT
        constraint FK_MEMBERS_ON_USER references users (id) ON DELETE CASCADE,
    workspace_id BIGINT
        constraint FK_MEMBERS_ON_WORKSPACE references workspaces (id) ON DELETE CASCADE,
    created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    role         VARCHAR(255) NOT NULL DEFAULT 'USER' check (role in ('USER', 'ADMIN'))
);

CREATE TABLE if not exists projects
(
    id           BIGSERIAL    NOT NULL PRIMARY KEY,
    name         VARCHAR(255) NOT NULL,
    workspace_id BIGINT,
    image        TEXT         NOT NULL DEFAULT '',
    created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE projects
    ADD CONSTRAINT FK_PROJECTS_ON_WORKSPACE FOREIGN KEY (workspace_id) REFERENCES workspaces (id) ON DELETE CASCADE;

CREATE TYPE task_status_enum AS ENUM ('BACKLOG', 'TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE');

CREATE TABLE if not exists tasks
(
    id           BIGSERIAL    NOT NULL PRIMARY KEY,
    name         VARCHAR(255) NOT NULL,
    workspace_id BIGINT       NOT NULL,
    project_id   BIGINT       NOT NULL,
    assignee_id  BIGINT       NOT NULL,
    description  TEXT                  DEFAULT '',
    due_date     TIMESTAMP    NOT NULL,
    status task_status_enum NOT NULL DEFAULT 'BACKLOG',
    position     INT          NOT NULL,
    created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE tasks
    ADD CONSTRAINT FK_TASKS_ON_WORKSPACE FOREIGN KEY (workspace_id) REFERENCES workspaces (id) ON DELETE CASCADE,
    ADD CONSTRAINT FK_TASKS_ON_PROJECT FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE,
    ADD CONSTRAINT FK_TASKS_ON_ASSIGNEE FOREIGN KEY (assignee_id) REFERENCES users (id) ON DELETE CASCADE;