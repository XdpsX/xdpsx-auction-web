CREATE TABLE seller_details (
    id BIGINT PRIMARY KEY,
    name VARCHAR(255),
    address VARCHAR(255),
    mobile_phone VARCHAR(20),
    avatar_id BIGINT,
    status ENUM('PENDING', 'APPROVED', 'REJECTED'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id) REFERENCES users(id),
    FOREIGN KEY (avatar_id) REFERENCES medias(id)
);
