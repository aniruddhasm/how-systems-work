DROP TABLE IF EXISTS accounts;

CREATE TABLE accounts(
    id SERIAL PRIMARY KEY,
    name TEXT,
    balance INT,
    version INT DEFAULT 1
);

INSERT INTO accounts(name,balance) VALUES ('Alice',1000);


-- Pessimistic locking
-- Terminal 1
BEGIN;
SELECT *
FROM accounts
WHERE id = 1
FOR UPDATE;


-- Terminal 2
UPDATE accounts
SET balance = 900
WHERE id = 1;

-- Terminal 1
COMMIT;