CREATE TABLE auctions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    description VARCHAR(2000),
    starting_price DECIMAL(15,2) NOT NULL,
    step_price DECIMAL(15,2),
    starting_time TIMESTAMP NOT NULL,
    ending_time TIMESTAMP NOT NULL,
    auction_type VARCHAR(20),
    seller_id BIGINT NOT NULL,
    category_id INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
);
