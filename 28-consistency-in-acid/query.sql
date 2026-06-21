-- CREATE TABLE 
CREATE TABLE accounts (
    id INT PRIMARY KEY,
    name VARCHAR(50),
    balance INT CHECK(balance >= 0)
);

-- IMPORTANY CHECK
CHECK(balance >= 0)

-- INSERT DATA
INSERT INTO accounts VALUES
(1, 'Aniruddha', 1000),
(2, 'John', 500);


-- SUCCESS QUERY 
UPDATE accounts
SET balance = balance - 100
WHERE id = 1;

-- FAILURE QUERY
UPDATE accounts
SET balance = balance - 2000
WHERE id = 1;