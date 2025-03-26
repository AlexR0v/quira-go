CREATE TABLE IF NOT EXISTS users
(
    id         BIGSERIAL    NOT NULL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name  VARCHAR(255) NOT NULL,
    password   VARCHAR(255) NOT NULL,
    email      VARCHAR(255) NOT NULL UNIQUE,
    role       VARCHAR(255) NOT NULL
);

INSERT INTO users (first_name, last_name, email, password, role)
values (
        'admin',
        'admin',
        'admin@admin.com',
        '$2a$10$JuL4w0R.8sq9jqx7Pa49xeqmkmQIEG2QPVKQxsRQkk83XFOvdRo1W',
        'ROLE_ADMIN'
       )
ON CONFLICT DO NOTHING
RETURNING id;

CREATE TABLE if not exists workspaces
(
    id      BIGSERIAL    NOT NULL PRIMARY KEY,
    name    VARCHAR(255) NOT NULL,
    user_id BIGINT
);

ALTER TABLE workspaces
    ADD CONSTRAINT FK_WORKSPACES_ON_USER FOREIGN KEY (user_id) REFERENCES users (id);