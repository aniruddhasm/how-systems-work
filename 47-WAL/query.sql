DROP TABLE IF EXISTS accounts;

CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    name TEXT,
    balance INT
);

INSERT INTO accounts(name, balance) VALUES ('Alice', 1000);


-- Check current WAL position
SELECT pg_current_wal_lsn();

-- start a transaction
BEGIN;
UPDATE accounts
SET balance = 900
WHERE id = 1;

-- Check WAL position after update
SELECT pg_current_wal_lsn();

-- Commit the transaction
COMMIT;

-- Check WAL position after commit
SELECT pg_current_wal_lsn();


-- Query to check bytes written to WAL
SELECT pg_wal_lsn_diff(pg_current_wal_lsn(), OLD_LSN) AS bytes_written_to_wal;