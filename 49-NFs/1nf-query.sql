CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    name TEXT,
    phone_numbers TEXT
);

INSERT INTO students(name, phone_numbers)
VALUES
('Aniruddha', '9876543210,8765432109'),
('John', '7654321098');

SELECT * FROM students;

-- Convert it to 1NF
CREATE TABLE students_nf (
    id SERIAL PRIMARY KEY,
    name TEXT
);
CREATE TABLE student_phones (
    student_id INT,
    phone TEXT
);

INSERT INTO students_nf(name)
VALUES
('Aniruddha'),
('John');


INSERT INTO student_phones(student_id, phone)
VALUES
(1, '9876543210'),
(1, '8765432109'),
(2, '7654321098');


SELECT * FROM student_phones;

-- Easy to query by phone number
SELECT s.name, sp.phone
FROM students_nf s
JOIN student_phones sp ON s.id = sp.student_id
WHERE sp.phone = '8765432109';