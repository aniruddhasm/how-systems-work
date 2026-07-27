-- create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT,
    deleted_at TIMESTAMP DEFAULT NULL
);

-- Insert users
INSERT INTO users(name)
VALUES('Alice'),('Bob'),('John'),('Emma');


-- Automatic cleanup of soft-deleted users after 30 days
DELETE FROM users
WHERE deleted_at < NOW() - INTERVAL '30 days';