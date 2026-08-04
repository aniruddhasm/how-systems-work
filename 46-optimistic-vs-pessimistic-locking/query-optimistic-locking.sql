DROP TABLE IF EXISTS accounts;

CREATE TABLE accounts(
    id SERIAL PRIMARY KEY,
    name TEXT,
    balance INT,
    version INT DEFAULT 1
);

INSERT INTO accounts(name,balance) VALUES ('Alice',1000);

-- Show current balance
SELECT * FROM accounts;



-- User A updates the balance
UPDATE accounts
SET balance = 900,
version = version + 1
WHERE id = 1
AND version = 1;


-- User B tries to update the balance with an outdated version
UPDATE accounts
SET balance = 800,
version = version + 1
WHERE id = 1
AND version = 1;