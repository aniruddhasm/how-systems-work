DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT,
    email TEXT,
    created_at TIMESTAMP
);


INSERT INTO users(name, email, created_at)
SELECT
    'User ' || gs,
    'user' || gs || '@gmail.com',
    TIMESTAMP '2026-01-01 00:00:00'
        + (gs % 1000) * INTERVAL '1 day'
FROM generate_series(1, 100000) gs;


EXPLAIN ANALYZE
SELECT *
FROM users
ORDER BY created_at;


CREATE INDEX idx_users_created_at ON users(created_at);

-- ============================================
-- 3. ORDER BY with index
-- ============================================

EXPLAIN ANALYZE
SELECT *
FROM users
ORDER BY created_at;

-- ============================================
-- 4. DESC example
-- ============================================

EXPLAIN ANALYZE
SELECT *
FROM users
ORDER BY created_at DESC;

-- ============================================
-- 5. LIMIT + ORDER BY
-- ============================================

EXPLAIN ANALYZE
SELECT *
FROM users
ORDER BY created_at DESC
LIMIT 10;