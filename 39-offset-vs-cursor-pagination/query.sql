CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT
);

INSERT INTO users(name)
SELECT
'User ' || gs
FROM generate_series(1,1000000) gs;

--OFFSET pagination
EXPLAIN ANALYZE
SELECT *
FROM users
ORDER BY id
OFFSET 900000
LIMIT 20;

-- Cursor pagination
EXPLAIN ANALYZE
SELECT *
FROM users
WHERE id > 900000
ORDER BY id
LIMIT 20;
