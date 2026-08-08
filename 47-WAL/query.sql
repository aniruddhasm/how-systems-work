DROP TABLE IF EXISTS accounts;

CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    name TEXT,
    balance INT
);

INSERT INTO accounts(name, balance)
VALUES ('Alice', 1000);


-- Check current WAL position
SELECT pg_current_wal_lsn(); -- 0/3D68750

-- start a transaction
BEGIN;

UPDATE accounts
SET balance = 900
WHERE id = 1;

-- Check WAL position after update
SELECT pg_current_wal_lsn();  -- 0/3D68808

-- Commit the transaction
COMMIT;

-- Check WAL position after commit
SELECT pg_current_wal_lsn();  -- 0/3D68830


-- Query to check bytes written to WAL
SELECT pg_wal_lsn_diff(pg_current_wal_lsn(), '0/3D68750') AS bytes_written_to_wal;