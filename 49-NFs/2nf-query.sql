DROP TABLE IF EXISTS enrollments;

CREATE TABLE enrollments (
    student_id INT,
    course_id INT,
    student_name TEXT,
    course TEXT,
    PRIMARY KEY (student_id, course_id)
);

INSERT INTO enrollments
(student_id, course_id, student_name, course)
VALUES
(1, 101, 'Anil', 'Database'),
(1, 102, 'Anil', 'Java'),
(2, 101, 'Rahul', 'Database');

-- problem
SELECT * FROM enrollments;

-- Convert it to 2NF
CREATE TABLE students (
    student_id INT PRIMARY KEY,
    student_name TEXT
);

CREATE TABLE courses (
    course_id INT PRIMARY KEY,
    course TEXT
);

CREATE TABLE enrollments_nf (
    student_id INT REFERENCES students(student_id),
    course_id INT REFERENCES courses(course_id),
    PRIMARY KEY (student_id, course_id)
);

INSERT INTO students
VALUES
(1, 'Anil'),
(2, 'Rahul');

INSERT INTO courses
VALUES
(101, 'Database'),
(102, 'Java');

INSERT INTO enrollments_nf
VALUES
(1, 101),
(1, 102),
(2, 101);

-- fetch the data
SELECT
    s.student_id,
    c.course_id,
    s.student_name,
    c.course
FROM enrollments_nf e
JOIN students s
    ON s.student_id = e.student_id
JOIN courses c
    ON c.course_id = e.course_id;