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


-- Query 1: Simple query without index
EXPLAIN ANALYZE SELECT *
FROM users
WHERE first_name='Alice'
AND last_name='Smith';

-- Create composite index
CREATE INDEX idx_users_name ON users(first_name, last_name);

-- Query 2: Query with composite index
EXPLAIN ANALYZE SELECT *
FROM users
WHERE first_name='Alice'
AND last_name='Smith';

-- Query 3: Query using first_name only
EXPLAIN ANALYZE SELECT *
FROM users
WHERE first_name='Alice';

-- OUTPUT: index scan only on first_name


-- Query 4: Query using last_name only
EXPLAIN ANALYZE SELECT *
FROM users
WHERE last_name='Smith';

-- OUTPUT: sequential scan only on last_name due to LEFT-MOST INDEX MATCH rule