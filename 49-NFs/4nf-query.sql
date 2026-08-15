-- 1. Table NOT in 4NF

DROP TABLE IF EXISTS student_details;

CREATE TABLE student_details (
    student_id INT,
    skill TEXT,
    language TEXT
);

INSERT INTO student_details
VALUES
(1, 'Java', 'English'),
(1, 'Java', 'Marathi'),
(1, 'Python', 'English'),
(1, 'Python', 'Marathi');


-- 2. Tables in 4NF

DROP TABLE IF EXISTS student_skills;
DROP TABLE IF EXISTS student_languages;

CREATE TABLE student_skills (
    student_id INT,
    skill_id INT,
    PRIMARY KEY (student_id, skill_id)
);

CREATE TABLE student_languages (
    student_id INT,
    language_id INT,
    PRIMARY KEY (student_id, language_id)
);


-- 3. Skills

DROP TABLE IF EXISTS skills;

CREATE TABLE skills (
    skill_id INT PRIMARY KEY,
    skill TEXT
);

INSERT INTO skills
VALUES
(1, 'Java'),
(2, 'Python');


-- 4. Languages

DROP TABLE IF EXISTS languages;

CREATE TABLE languages (
    language_id INT PRIMARY KEY,
    language TEXT
);

INSERT INTO languages
VALUES
(1, 'English'),
(2, 'Marathi');


-- 5. Student Skills

INSERT INTO student_skills
VALUES
(1, 1),
(1, 2);


-- 6. Student Languages

INSERT INTO student_languages
VALUES
(1, 1),
(1, 2);


-- 7. Check the data

SELECT * FROM student_details;

SELECT * FROM student_skills;

SELECT * FROM student_languages;

SELECT * FROM skills;

SELECT * FROM languages;