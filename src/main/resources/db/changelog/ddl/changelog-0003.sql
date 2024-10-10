CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(64) NOT NULL,
    email VARCHAR(64) NOT NULL,
    password VARCHAR(255),
    avatar_id BIGINT,
    role VARCHAR(32) NOT NULL,
    provider VARCHAR(32) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    FOREIGN KEY (avatar_id) REFERENCES medias(id) ON DELETE SET NULL
);