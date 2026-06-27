CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    message TEXT
);

BEGIN;

INSERT INTO notes(message)
VALUES ('Hello Durability');

COMMIT;


SELECT * FROM notes;