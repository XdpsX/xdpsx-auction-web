CREATE TABLE wallets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    balance DECIMAL(15,2) NOT NULL DEFAULT 0,
    owner_id BIGINT NOT NULL,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    wallet_id BIGINT,
    amount DECIMAL(10,2) NOT NULL,
    type ENUM('WITHDRAW', 'DEPOSIT'),
    description VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (wallet_id) REFERENCES wallets(id) ON DELETE SET NULL
);
