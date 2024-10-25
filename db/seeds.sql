INSERT INTO departments (id, department_name)
VALUES (1, 'Engineering'),
       (2, 'Finance'),
       (3, 'Legal'),
       (4, 'Sales');

    INSERT INTO roles (id, title, salary, department_id)
    VALUES  (1, 'Software Engineer', 100000, 1),
            (2, 'Accountant', 75000, 2),
            (3, 'Lawyer', 110000, 3),
            (4, 'Sales Lead', 80000, 4);


        INSERT INTO employees (id, first_name, last_name, role_id, manager_id)
        VALUES  (1, 'Alice', 'Smith', 1, NULL),
                (2, 'Bob', 'Jones', 2, 1),
                (3, 'Charlie', 'Brown', 3, NULL),
                (4, 'Diane', 'Keaton', 4, 3);
