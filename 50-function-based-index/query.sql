DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT,
    email TEXT,
    dob DATE,
    created_at TIMESTAMP
);

INSERT INTO users(name, email, dob, created_at)
SELECT
    'User ' || gs,
    'user' || gs || '@gmail.com',
    DATE '1990-01-01' + (gs % 10000),
    TIMESTAMP '2026-08-01 00:00:00'
        + (gs % 27) * INTERVAL '1 day'
FROM generate_series(1, 100000) gs;


-- ============================================
-- Example 1: LOWER(email)
-- ============================================

EXPLAIN ANALYZE
SELECT *
FROM users
WHERE LOWER(email) = 'user50000@gmail.com';


-- Create expression index

CREATE INDEX idx_lower_email
ON users (LOWER(email));


-- Run the same query again

EXPLAIN ANALYZE
SELECT *
FROM users
WHERE LOWER(email) = 'user50000@gmail.com';


-- ============================================
-- Example 2: DATE(created_at)
-- ============================================

EXPLAIN ANALYZE
SELECT *
FROM users
WHERE DATE(created_at) = '2026-08-27';


-- Create expression index

CREATE INDEX idx_created_date
ON users (DATE(created_at));


-- Run the same query again

EXPLAIN ANALYZE
SELECT *
FROM users
WHERE DATE(created_at) = '2026-08-27';


-- ============================================
-- Example 3: Custom Function
-- ============================================

CREATE OR REPLACE FUNCTION get_age(dob DATE)
RETURNS INT
LANGUAGE SQL
STABLE
AS $$
    SELECT EXTRACT(
        YEAR FROM AGE(CURRENT_DATE, dob)
    )::INT;
$$;


-- Test the function

SELECT
    name,
    dob,
    get_age(dob) AS age
FROM users;


-- Find users whose age is 36

SELECT *
FROM users
WHERE get_age(dob) = 36;


-- ============================================
-- This will fail
-- because get_age() depends on CURRENT_DATE
-- and therefore is not IMMUTABLE.
-- ============================================

CREATE INDEX idx_users_age
ON users (get_age(dob));


-- ============================================
-- Better approach:
-- Index the DOB column
-- ============================================

CREATE INDEX idx_users_dob
ON users(dob);


-- Find users who are currently 36 years old

EXPLAIN ANALYZE
SELECT *
FROM users
WHERE dob > CURRENT_DATE - INTERVAL '37 years'
  AND dob <= CURRENT_DATE - INTERVAL '36 years';