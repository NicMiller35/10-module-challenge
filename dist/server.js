import inquirer from 'inquirer';
import express from 'express';
import { pool, connectToDb } from './connections.js';
import dotenv from 'dotenv';
import Table from 'cli-table3';
dotenv.config();
const PORT = process.env.PORT || 3001;
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const startInquirer = async () => {
    try {
        await connectToDb();
        inquirer
            .prompt([
            {
                type: 'list',
                name: 'action',
                message: 'What would you like to do?',
                choices: [
                    'View all employees',
                    'View all roles',
                    'View all departments',
                    'Add a new employee',
                    'Add a new role',
                    'Add a new department',
                    'Update an employee role',
                    'Exit',
                ],
            },
        ])
            .then((answers) => {
            switch (answers.action) {
                case 'View all employees':
                    viewAllEmployees();
                    break;
                case 'View all roles':
                    viewAllRoles();
                    break;
                case 'View all departments':
                    viewAllDepartments();
                    break;
                case 'Add a new employee':
                    addEmployee();
                    break;
                case 'Add a new role':
                    addRole();
                    break;
                case 'Add a new department':
                    addDepartment();
                    break;
                case 'Update an employee role':
                    updateEmployeeRole();
                    break;
                case 'Exit':
                    console.log('Goodbye!');
                    process.exit(0);
            }
        });
    }
    catch (err) {
        console.error('Error connecting to the database:', err);
    }
};
const viewAllEmployees = async () => {
    try {
        const result = await pool.query('SELECT employees.id AS "ID", employees.first_name AS "First Name", employees.last_name AS "Last Name", roles.title AS "Job Title", departments.name AS "Department", roles.salary AS "Salary", CONCAT(managers.first_name, \' \', managers.last_name) AS "Manager" FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id LEFT JOIN employees managers ON employees.manager_id = managers.id');
        const table = new Table({
            head: ['ID', 'First Name', 'Last Name', 'Job Title', 'Department', 'Salary', 'Manager'],
            colWidths: [5, 15, 15, 15, 15, 15, 15],
        });
        result.rows.forEach((row) => {
            table.push([row["ID"], row['First Name'], row['Last Name'], row['Job Title'], row['Department'], row['Salary'], row['Manager']]);
        });
        console.log(table.toString());
    }
    catch (err) {
        console.error('Error viewing employees:', err);
    }
    finally {
        startInquirer();
    }
};
const viewAllRoles = async () => {
    try {
        const result = await pool.query('SELECT roles.id AS "ID", roles.title AS "Job Title", roles.salary AS "Salary", departments.name AS "Department" FROM roles LEFT JOIN departments ON roles.department_id = departments.id');
        const table = new Table({
            head: ['ID', 'Job Title', 'Salary', 'Department'],
            colWidths: [5, 15, 15, 15],
        });
        result.rows.forEach((row) => {
            table.push([row['ID'], row['Job Title'], row['Salary'], row['Department']]);
        });
        console.log(table.toString());
    }
    catch (err) {
        console.error('Error viewing roles:', err);
    }
    finally {
        startInquirer();
    }
};
const viewAllDepartments = async () => {
    try {
        const result = await pool.query('SELECT id AS "ID", name AS "Department" FROM departments');
        const table = new Table({
            head: ['ID', 'Department'],
            colWidths: [5, 15],
        });
        result.rows.forEach((row) => {
            table.push([row['ID'], row['Department']]);
        });
        console.log(table.toString());
    }
    catch (err) {
        console.error('Error viewing departments:', err);
    }
    finally {
        startInquirer();
    }
};
const addEmployee = async () => {
    try {
        const employees = await pool.query('SELECT * FROM employees');
        const roles = await pool.query('SELECT * FROM roles');
        const employee = await inquirer.prompt([
            {
                type: 'input',
                name: 'first_name',
                message: 'Enter the employee\'s first name:',
            },
            {
                type: 'input',
                name: 'last_name',
                message: 'Enter the employee\'s last name:',
            },
            {
                type: 'list',
                name: 'role_id',
                message: 'Select the employee\'s role:',
                choices: roles.rows.map((role) => ({
                    name: role.title,
                    value: role.id,
                })),
            },
            {
                type: 'list',
                name: 'manager_id',
                message: 'Select the employee\'s manager:',
                choices: employees.rows.map((employee) => ({
                    name: `${employee.first_name} ${employee.last_name}`,
                    value: employee.id,
                })),
            },
        ]);
        await pool.query('INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [employee.first_name, employee.last_name, employee.role_id, employee.manager_id]);
    }
    catch (err) {
        console.error('Error adding employee:', err);
    }
    finally {
        startInquirer();
    }
};
const addRole = async () => {
    try {
        const departments = await pool.query('SELECT * FROM departments');
        const role = await inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'Enter the role title:',
            },
            {
                type: 'input',
                name: 'salary',
                message: 'Enter the role salary:',
            },
            {
                type: 'list',
                name: 'department_id',
                message: 'Select the role department:',
                choices: departments.rows.map((department) => ({
                    name: department.name,
                    value: department.id,
                })),
            },
        ]);
        await pool.query('INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3)', [role.title, role.salary, role.department_id]);
    }
    catch (err) {
        console.error('Error adding role:', err);
    }
    finally {
        startInquirer();
    }
};
const addDepartment = async () => {
    try {
        const department = await inquirer.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Enter the department name:',
            },
        ]);
        await pool.query('INSERT INTO departments (name) VALUES ($1)', [department.name]);
    }
    catch (err) {
        console.error('Error adding department:', err);
    }
    finally {
        startInquirer();
    }
};
const updateEmployeeRole = async () => {
    try {
        const employees = await pool.query('SELECT * FROM employees');
        const roles = await pool.query('SELECT * FROM roles');
        const employee = await inquirer.prompt([
            {
                type: 'list',
                name: 'id',
                message: 'Select the employee to update:',
                choices: employees.rows.map((employee) => ({
                    name: `${employee.first_name} ${employee.last_name}`,
                    value: employee.id,
                })),
            },
            {
                type: 'list',
                name: 'role_id',
                message: 'Select the employee\'s new role:',
                choices: roles.rows.map((role) => ({
                    name: role.title,
                    value: role.id,
                })),
            },
        ]);
        await pool.query('UPDATE employees SET role_id = $1 WHERE id = $2', [employee.role_id, employee.id]);
    }
    catch (err) {
        console.error('Error updating employee role:', err);
    }
    finally {
        startInquirer();
    }
};
app.use((_req, res) => {
    res.status(404).end();
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
startInquirer();
