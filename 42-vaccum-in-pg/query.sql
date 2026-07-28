-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT
);

-- Insert users
INSERT INTO users(name)
SELECT
'User ' || gs
FROM generate_series(1,100000) gs;

-- Table size before vacuum
SELECT pg_size_pretty(pg_relation_size('users')) AS size_before_vacuum;

-- Delete half of the users
DELETE FROM users WHERE id >= 50000;

-- Table size after delete
SELECT pg_size_pretty(pg_relation_size('users')) AS size_after_delete;

-- SHOW DEAD TUPLES
SELECT
    n_live_tup,
    n_dead_tup
FROM pg_stat_user_tables
WHERE relname = 'users';

-- Run vacuum to reclaim space
VACUUM ANALYZE users;

-- SHOW DEAD TUPLES AFTER VACUUM
SELECT
    n_live_tup,
    n_dead_tup
FROM pg_stat_user_tables
WHERE relname = 'users';

-- Table size after vacuum
SELECT pg_size_pretty(pg_relation_size('users')) AS size_after_vacuum;

-- Instead of growing, PostgreSQL reuses the dead space.
INSERT INTO users(name)
SELECT
'New User'
FROM generate_series(1,50000) gs;