-- create users and orders table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(255),
    city VARCHAR(50)
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    product VARCHAR(100),
    amount NUMERIC(10,2)
);

-- Insert users
INSERT INTO users(name, email, city)
SELECT
    'User ' || gs,
    'user' || gs || '@gmail.com',
    CASE
        WHEN gs % 5 = 0 THEN 'Pune'
        WHEN gs % 5 = 1 THEN 'Mumbai'
        WHEN gs % 5 = 2 THEN 'Delhi'
        WHEN gs % 5 = 3 THEN 'Bangalore'
        ELSE 'Chennai'
    END
FROM generate_series(1,100000) gs;


-- Insert orders
INSERT INTO orders(user_id, product, amount)
SELECT
    id,
    'Product ' || id,
    (random() * 5000)::numeric(10,2)
FROM users;

-- Seq scan - PostgreSQL checked every row.
EXPLAIN ANALYZE
SELECT *
FROM users
WHERE email='user99999@gmail.com';


-- create index on email column
CREATE INDEX idx_email ON users(email);

-- Index scan - PostgreSQL used the index to find the row.
EXPLAIN ANALYZE
SELECT *
FROM users
WHERE email='user99999@gmail.com';

-- create index on email column including name column
CREATE INDEX idx_email_name ON users(email) INCLUDE (name);

-- Running vaccum to update the statistics after creating the index
VACUUM ANALYZE users;

-- Index scan - PostgreSQL used the index to find the row and also retrieved the name column from the index itself.
EXPLAIN ANALYZE
SELECT name
FROM users
WHERE email='user99999@gmail.com';

-- bitmap scan, Bitmap Index Scan, Bitmap Heap Scan
CREATE INDEX idx_city
ON users(city);

EXPLAIN ANALYZE
SELECT *
FROM users
WHERE city='Pune'
OR city='Mumbai';


-- Nested Loop Join
EXPLAIN ANALYZE
SELECT *
FROM users
JOIN orders
ON users.id = orders.user_id
WHERE users.id < 10;


-- Hash Join Removed filter condition to make it a hash join
EXPLAIN ANALYZE
SELECT *
FROM users
JOIN orders
ON users.id = orders.user_id;