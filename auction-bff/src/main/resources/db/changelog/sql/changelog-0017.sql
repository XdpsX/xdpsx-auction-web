ALTER TABLE notifications
    ADD COLUMN title VARCHAR(255),
    ADD COLUMN href VARCHAR(128);

ALTER TABLE notifications
    DROP COLUMN `type`;
