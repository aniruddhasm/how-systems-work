CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE seats (
    id SERIAL PRIMARY KEY,
    event_id INT NOT NULL,
    seat_number VARCHAR(10) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE',
    user_id INT,    
    UNIQUE(event_id, seat_number)
);

INSERT INTO events (name)
VALUES ('India vs Australia - Cricket Match');

INSERT INTO seats (event_id, seat_number)
VALUES
(1, 'A1'),
(1, 'A2'),
(1, 'A3'),
(1, 'A4'),
(1, 'A5');