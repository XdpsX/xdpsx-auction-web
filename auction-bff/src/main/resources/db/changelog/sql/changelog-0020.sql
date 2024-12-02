ALTER TABLE seller_details
    DROP FOREIGN KEY seller_details_ibfk_1;

ALTER TABLE seller_details
    MODIFY id BIGINT AUTO_INCREMENT;

ALTER TABLE seller_details
    ADD user_id BIGINT,
    ADD FOREIGN KEY (user_id) REFERENCES users(id);
