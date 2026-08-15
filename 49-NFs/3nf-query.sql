-- 1. Table NOT in 3NF

DROP TABLE IF EXISTS students;

CREATE TABLE students (
    student_id INT PRIMARY KEY,
    student_name TEXT,
    department_id INT,
    department TEXT
);

INSERT INTO students
VALUES
(1, 'Anil', 10, 'Computer Science'),
(2, 'Rahul', 20, 'Mechanical'),
(3, 'Amit', 10, 'Computer Science');


-- 2. Check the table

SELECT * FROM students;


-- 3. Tables in 3NF

DROP TABLE IF EXISTS students_3nf;
DROP TABLE IF EXISTS departments;

CREATE TABLE departments (
    department_id INT PRIMARY KEY,
    department TEXT
);

CREATE TABLE students_3nf (
    student_id INT PRIMARY KEY,
    student_name TEXT,
    department_id INT REFERENCES departments(department_id)
);


-- 4. Insert departments

INSERT INTO departments
VALUES
(10, 'Computer Science'),
(20, 'Mechanical');


-- 5. Insert students

INSERT INTO students_3nf
VALUES
(1, 'Anil', 10),
(2, 'Rahul', 20),
(3, 'Amit', 10);


-- 6. Check the data

SELECT * FROM departments;

SELECT * FROM students_3nf;


-- 7. Get the original information using JOIN

SELECT
    s.student_id,
    s.student_name,
    s.department_id,
    d.department
FROM students_3nf s
JOIN departments d
    ON s.department_id = d.department_id;