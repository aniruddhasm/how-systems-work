-- Create partitioned table for orders
CREATE TABLE orders (
    id SERIAL,
    customer_name TEXT,
    amount INT,
    order_date DATE
) PARTITION BY RANGE(order_date); -- Create partitions for each year

-- Create partition for orders in 2023, 2024, and 2025
CREATE TABLE orders_2023
PARTITION OF orders
FOR VALUES FROM ('2023-01-01')
TO ('2024-01-01');

CREATE TABLE orders_2024
PARTITION OF orders
FOR VALUES FROM ('2024-01-01')
TO ('2025-01-01');

CREATE TABLE orders_2025
PARTITION OF orders
FOR VALUES FROM ('2025-01-01')
TO ('2026-01-01');

-- Insert sample data into the partitioned table
INSERT INTO orders(customer_name, amount, order_date)
VALUES
('Alice',100,'2023-05-10'),
('Bob',200,'2024-08-11'),
('Charlie',500,'2025-02-15');

-- Verify the correct partitions
SELECT tableoid::regclass, *
FROM orders;

-- this will only scan the partition for 2025, not the entire table
EXPLAIN ANALYZE
SELECT *
FROM orders
WHERE order_date='2025-02-15';


-- show partition pruning in action
EXPLAIN
SELECT *
FROM orders
WHERE order_date
BETWEEN '2025-01-01'
AND '2025-12-31';