CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    product TEXT
);

-- Insert 50 users
INSERT INTO users (name)
SELECT 'User ' || g
FROM generate_series(1, 50) AS g;

-- Insert 3 orders for each user (150 orders total)
INSERT INTO orders (user_id, product)
SELECT
    u.id,
    p.product
FROM users u
CROSS JOIN (
    VALUES
        ('Laptop'),
        ('Mouse'),
        ('Keyboard')
) AS p(product);

-- Older way to join tables
SELECT users.id, users.name, orders.product
FROM users, orders
WHERE users.id = orders.user_id
ORDER BY users.id;