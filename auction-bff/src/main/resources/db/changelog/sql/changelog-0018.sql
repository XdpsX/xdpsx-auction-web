CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    track_number VARCHAR(255),
    auction_name VARCHAR(255),
    total_amount DECIMAL(10, 2),
    shipping_address VARCHAR(255),
    status ENUM('Pending', 'Confirmed', 'Shipped', 'Delivered', 'Completed', 'Cancelled', 'Returned'),
    user_id BIGINT,
    seller_id BIGINT,
    auction_id BIGINT,
    auction_image_id BIGINT,
    note VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (seller_id) REFERENCES users(id),
    FOREIGN KEY (auction_id) REFERENCES auctions(id),
    FOREIGN KEY (auction_image_id) REFERENCES medias(id)
);
