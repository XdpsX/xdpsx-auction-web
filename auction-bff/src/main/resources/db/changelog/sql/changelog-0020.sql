ALTER TABLE bids
    MODIFY status ENUM ('ACTIVE', 'WON', 'LOST', 'PAID');