ALTER TABLE auctions
    ADD COLUMN cleaned_description TEXT;

CREATE TABLE auction_inverted_index (
    term VARCHAR(255) NOT NULL,
    auction_ids_title TEXT,
    auction_ids_description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (term)
);