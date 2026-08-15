DROP TABLE IF EXISTS supplier_parts;
DROP TABLE IF EXISTS supplier_projects;
DROP TABLE IF EXISTS project_parts;

CREATE TABLE supplier_parts (
    supplier_id INT,
    part_id INT,
    PRIMARY KEY (supplier_id, part_id)
);

CREATE TABLE supplier_projects (
    supplier_id INT,
    project_id INT,
    PRIMARY KEY (supplier_id, project_id)
);

CREATE TABLE project_parts (
    project_id INT,
    part_id INT,
    PRIMARY KEY (project_id, part_id)
);

INSERT INTO supplier_parts
VALUES
(1, 101),
(1, 102),
(2, 101);

INSERT INTO supplier_projects
VALUES
(1, 1001),
(2, 1001),
(2, 1002);

INSERT INTO project_parts
VALUES
(1001, 101),
(1001, 102),
(1002, 101);

-- Show Data
SELECT * FROM supplier_parts;

SELECT * FROM supplier_projects;

SELECT * FROM project_parts;

-- Restructured Query
SELECT
    sp.supplier_id,
    sp.part_id,
    sj.project_id
FROM supplier_parts sp
JOIN supplier_projects sj
    ON sp.supplier_id = sj.supplier_id
JOIN project_parts pp
    ON pp.project_id = sj.project_id
   AND pp.part_id = sp.part_id;