CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100)
);

INSERT INTO users(first_name, last_name, email)
SELECT
    (ARRAY[
        'Alice','Bob','Charlie','David',
        'Emma','John','Sophia','Michael'
    ])[floor(random()*8+1)],
    (ARRAY[
        'Smith','Brown','Johnson',
        'Williams','Jones','Miller'
    ])[floor(random()*6+1)],
    'user' || gs || '@gmail.com'
FROM generate_series(1,1000000) gs;

-- Create index on email column
CREATE INDEX idx_email ON users(email);

-- Query 1: Simple query with index
EXPLAIN ANALYZE SELECT *
FROM users
WHERE email='user900000@gmail.com';

-- Query 2: Query with index covering
CREATE INDEX idx_email_covering ON users(email) INCLUDE(first_name);

-- Query 3: Query with index covering
EXPLAIN ANALYZE
SELECT first_name
FROM users
WHERE email='user900000@gmail.com';