CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    stock INT NOT NULL
);

INSERT INTO products (name, stock)
VALUES ('iPhone', 10);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);