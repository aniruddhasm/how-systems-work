CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    name TEXT,
    balance INT
);

INSERT INTO accounts(name,balance) VALUES ('Alice',1000), ('Bob',1000);

-- terminal 1
BEGIN;
UPDATE accounts
SET balance = balance - 100
WHERE id = 1;


-- Terminal 2
BEGIN;
UPDATE accounts
SET balance = balance - 100
WHERE id = 2;

-- Terminal 1
UPDATE accounts
SET balance = balance + 100
WHERE id = 2;

-- Terminal 2
UPDATE accounts
SET balance = balance + 100
WHERE id = 1;

SHOW deadlock_timeout;