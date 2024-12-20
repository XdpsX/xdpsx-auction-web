CREATE TABLE notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    message VARCHAR(255) NOT NULL,
    type ENUM('SYSTEM', 'AUCTION', 'EVENT') NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    user_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);