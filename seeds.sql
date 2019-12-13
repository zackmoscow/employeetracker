USE employee_db;

INSERT INTO employee (first_name, last_name, role_id, manager_id) values ('John', 'Doe', 1, NULL);
INSERT INTO employee (first_name, last_name, role_id, manager_id) values ('Mike', 'Chan', 2, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id) values ('Ashley', 'Rodriguez', 3, 9);
INSERT INTO employee (first_name, last_name, role_id, manager_id) values ('Kevin', 'Tupik', 4, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id) values ('Malia', 'Brown', 5, NULL);
INSERT INTO employee (first_name, last_name, role_id, manager_id) values ('Sarah', 'Lourd', 6, NULL);
INSERT INTO employee (first_name, last_name, role_id, manager_id) values ('Tom', 'Allen', 7, 6);
INSERT INTO employee (first_name, last_name, role_id, manager_id) values ('Christian', 'Eckenrode', 4, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id) values ('Zack', 'Moscow', 3, NULL);

INSERT INTO department (name) values ("Sales");
INSERT INTO department (name) values ("Engineering");
INSERT INTO department (name) values ("Finance");
INSERT INTO department (name) values ("Legal");

INSERT INTO role (title, salary, department_id) values ("Sales Lead", 100000.00, 1);
INSERT INTO role (title, salary, department_id) values ("Salesperson", 80000.00, 1);
INSERT INTO role (title, salary, department_id) values ("Lead Engineer", 150000.00, 2);
INSERT INTO role (title, salary, department_id) values ("Software Engineer", 120000.00, 2);
INSERT INTO role (title, salary, department_id) values ("Accountant", 125000.00, 3);
INSERT INTO role (title, salary, department_id) values ("Legal Team Lead", 250000.00, 4);
INSERT INTO role (title, salary, department_id) values ("Lawyer", 190000.00, 4);

SELECT * FROM employee;
SELECT * FROM department;
SELECT * FROM role;