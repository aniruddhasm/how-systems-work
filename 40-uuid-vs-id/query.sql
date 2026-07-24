CREATE TABLE users_int (
    id SERIAL PRIMARY KEY,
    name TEXT
);


-- Enable the pgcrypto extension to generate UUIDs
CREATE EXTENSION IF NOT EXISTS pgcrypto;


CREATE TABLE users_uuid (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT
);

INSERT INTO users_int(name)
SELECT 'User'
FROM generate_series(1,100000);



INSERT INTO users_uuid(name)
SELECT 'User'
FROM generate_series(1,100000);


-- compare size of both tables
SELECT pg_size_pretty(pg_total_relation_size('users_int')) AS users_int_size,
       pg_size_pretty(pg_total_relation_size('users_uuid')) AS users_uuid_size;


-- compare index size of both tables
SELECT pg_size_pretty(pg_indexes_size('users_int')) AS users_int_index_size,
       pg_size_pretty(pg_indexes_size('users_uuid')) AS users_uuid_index_size;


-- cursor pagination for users_int
SELECT *
FROM users
WHERE id > 100
ORDER BY id
LIMIT 20;

SELECT *
FROM users_uuid
WHERE id > '550e8400-e29b-41d4-a716-446655440000'
ORDER BY id
LIMIT 20;