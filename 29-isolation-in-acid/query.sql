-- CREATE TABLE
CREATE TABLE accounts (
    id INT PRIMARY KEY,
    balance INT
);

-- INSERT DATA
INSERT INTO accounts VALUES
(1, 1000);

-- TERMINAL 1
BEGIN;

SELECT balance
FROM accounts
WHERE id = 1;

-- then execute the above 

-- TERMINAL 2
BEGIN;

SELECT balance
FROM accounts
WHERE id = 1;
-- then execute the above 

-- COMMENTS
-- Balance = 1000 both decide: withdraw: 800


-- TERMINAL 1
UPDATE accounts
SET balance = 200
WHERE id = 1;

COMMIT;

-- TERMINAL 2
UPDATE accounts
SET balance = 200
WHERE id = 1;

COMMIT;

-- FINAL BALANCE 
SELECT * FROM accounts;

--
-- User A got 800
-- User B got 800

-- Total withdrawn = 1600

-- Original balance = 1000


-- VERY IMPORTANT ROW LEVEL LOCKING 
-- TERMINAL 1
BEGIN;

SELECT *
FROM accounts
WHERE id = 1
FOR UPDATE; -- VERY IMPORTANT

-- TERMINAL 2
BEGIN;

SELECT *
FROM accounts
WHERE id = 1
FOR UPDATE;

-- TERMINAL 1
UPDATE accounts
SET balance = balance - 800
WHERE id = 1;

COMMIT;

-- AFTER TERMINAL 1 COMMIT 
-- TERMINAL 2
UPDATE accounts
SET balance = balance - 800
WHERE id = 1;