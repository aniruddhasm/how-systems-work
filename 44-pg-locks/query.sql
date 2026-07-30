CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    name TEXT,
    balance INT
);

INSERT INTO accounts(name, balance) VALUES
('Alice',1000);


---- Transaction 1
BEGIN;
SELECT *
FROM accounts
WHERE id = 1
FOR UPDATE; -- ROW LEVEL LOCK

-- Transaction 2
UPDATE accounts
SET balance = balance - 100
WHERE id = 1;

-- To check locking, we can run the following query in another session to see if it is blocked by Transaction 1
SELECT
    pid,
    wait_event_type,
    wait_event,
    query
FROM pg_stat_activity
WHERE wait_event IS NOT NULL;


-- Transaction 1
UPDATE accounts
SET balance = balance - 200
WHERE id = 1;
COMMIT;


