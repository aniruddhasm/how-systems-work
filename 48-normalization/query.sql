DROP TABLE IF EXISTS orders;

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_name TEXT,
    customer_email TEXT,
    product TEXT
);

INSERT INTO orders
(customer_name, customer_email, product)
VALUES
('Anil', 'anil@gmail.com', 'Laptop'),
('Anil', 'anil@gmail.com', 'Mouse'),
('Anil', 'anil@gmail.com', 'Keyboard'),
('Rahul', 'rahul@gmail.com', 'Monitor');


SELECT * FROM orders;

-- DATA NORMALIZATION
DROP TABLE IF EXISTS orders;

CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name TEXT,
    email TEXT
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES customers(id),
    product TEXT
);

-- Inserting data into customers table
INSERT INTO customers(name, email)
VALUES
('Anil', 'anil@gmail.com'),
('Rahul', 'rahul@gmail.com');

-- Inserting data into orders table
INSERT INTO orders(customer_id, product)
VALUES
((SELECT id FROM customers WHERE name = 'Anil'), 'Laptop'),
((SELECT id FROM customers WHERE name = 'Anil'), 'Mouse'),
((SELECT id FROM customers WHERE name = 'Anil'), 'Keyboard'),
((SELECT id FROM customers WHERE name = 'Rahul'), 'Monitor');

-- OR 
INSERT INTO orders(customer_id, product)
VALUES
(1, 'Laptop'),
(1, 'Mouse'),
(1, 'Keyboard'),
(2, 'Monitor');

-- FETCH data from orders table
SELECT
    orders.id,
    customers.name,
    customers.email,
    orders.product
FROM orders
JOIN customers
    ON customers.id = orders.customer_id;