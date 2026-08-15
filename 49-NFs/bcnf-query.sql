-- 1. Table NOT in BCNF

DROP TABLE IF EXISTS student_courses;

CREATE TABLE student_courses (
    student_id INT,
    course_id INT,
    instructor_id INT,
    PRIMARY KEY (student_id, course_id)
);

INSERT INTO student_courses
VALUES
(1, 101, 10),
(2, 101, 10),
(3, 102, 20),
(4, 102, 20);


-- 2. Check the table

SELECT * FROM student_courses;


-- 3. Tables in BCNF

DROP TABLE IF EXISTS instructors;
DROP TABLE IF EXISTS enrollments;

CREATE TABLE instructors (
    instructor_id INT PRIMARY KEY,
    course_id INT
);

CREATE TABLE enrollments (
    student_id INT,
    instructor_id INT,
    PRIMARY KEY (student_id, instructor_id)
);


-- 4. Insert instructors

INSERT INTO instructors
VALUES
(10, 101),
(20, 102);


-- 5. Insert student enrollments

INSERT INTO enrollments
VALUES
(1, 10),
(2, 10),
(3, 20),
(4, 20);


-- 6. Check the data

SELECT * FROM instructors;

SELECT * FROM enrollments;