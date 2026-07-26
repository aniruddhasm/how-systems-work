-- create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT,
    deleted BOOLEAN DEFAULT FALSE
);

-- Insert users
INSERT INTO users(name)
VALUES('Alice'),('Bob'),('John'),('Emma');