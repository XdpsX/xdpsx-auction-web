ALTER TABLE bids
    DROP COLUMN bid_time,
    DROP COLUMN payment_status;

ALTER TABLE bids
    ADD COLUMN transaction_id BIGINT NOT NULL,
    ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN updated_at TIMESTAMP;

ALTER TABLE bids
    ADD CONSTRAINT fk_transaction
        FOREIGN KEY (transaction_id) REFERENCES transactions(id);