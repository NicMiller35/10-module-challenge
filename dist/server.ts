import inquirer from 'inquirer';
import express from 'express';
import pg from 'pg';
import { pool, connectToDb } from './connections.ts';

await connectToDb();

const PORT = process.env.PORT || 3001;
const app = express();


inquirer 
    .prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: ['Add a new employee', 'Add a new role', 'Add a new department', 'View all employees', 'View all roles', 'View all departments', 'Delete an employee', 'Delete a role', 'Delete a department'],
        },
    ])

    .then(({ action }) => {
        switch (action) {
            case 'View all employees':
                app.get ('api/employees', (_req, res) => {
                    const result = pool.query('SELECT * FROM employees');
                    res.json(result.rows);
                });
                break;
                
            case 'View all roles':
                app.get ('api/roles', (_req, res) => {
                    const result = pool.query('SELECT * FROM roles');
                    res.json(result.rows);
                });
                break;
                
            case 'View all departments':
                app.get ('api/departments', (_req, res) => {
                    const result = pool.query('SELECT * FROM departments');
                    res.json(result.rows);
                });
                break;
                
            case 'Add a new employee':
                app.post ('api/new employee', (req, res) => {
                    const result = pool.query('SELECT * FROM employees');
                    res.json(result.rows);
                });
                break;
            case 'Add a new role':
                app.post ('api/new role', (req, res) => {
                    const result = pool.query('SELECT * FROM roles');
                    res.json(result.rows);
                });
                break;
            case 'Add a new department':
                app.post ('api/new department', (req, res) => {
                    const result = pool.query('SELECT * FROM departments');
                    res.json(result.rows);
                };
                break;
            case 'Delete an employee':
                deleteEmployee();
                break;
            case 'Delete a role':
                deleteRole();
                break;
            case 'Delete a department':
                deleteDepartment();
                break;
            case 'Update an employee role':
                    updateEmployeeRole();
                break;
        }
    });






















app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post ('api/new employee', ({body}, res) => {
    const sql = `INSTER INTO employees (first_name, last_name, role_id, manager_id)
    VALUES ($1, $2, $3, $4)`;
    const params = [body.first_name, body.last_name, body.role_id, body.manager_id];

    pool.query(sql, params, (err, _result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: body,
        });
    });
})

app.post   ('api/new role', ({body}, res) => {
    const sql = `INSTER INTO roles (title, salary, department_id)
    VALUES ($1, $2, $3)`;
    const params = [body.title, body.salary, body.department_id];

    pool.query(sql, params, (err, _result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: body,
        });
    });
})

app.post ('api/new department', ({body}, res) => {
    const sql = `INSTER INTO departments (name)
    VALUES ($1)`;
    const params = [body.name];

    pool.query(sql, params, (err, _result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: body,
        });
    });
})

app.get ('api/employees', (_req, res) => {
    const sql = `SELECT id, first_name, last_name, role_id, manager_id FROM employees`;

    pool.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        const { rows } = result;
        res.json({
            message: 'success',
            data: rows,
        });
    });
})

app.get ('api/roles', (_req, res) => {
    const sql = `SELECT id, title, salary, department_id FROM roles`;

    pool.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        const { rows } = result;
        res.json({
            message: 'success',
            data: rows,
        });
    });
})

app.get ('api/departments', (_req, res) => {
    const sql = `SELECT id, name FROM departments`;

    pool.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        const { rows } = result;
        res.json({
            message: 'success',
            data: rows,
        });
    });
})

app.delete ('api/employee/:id', (req, res) => {
    const sql = `DELETE FROM employees WHERE id = $1`;
    const params = [req.params.id];

    pool.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
        } else if (!result.rowCount) {
            res.json({
                message: 'Employee not found',
            });
        } else {
            res.json({
                message: 'deleted',
                changes: result.rowCount,
                id: req.params.id,
            });
        }
    });
})

app.delete ('api/role/:id', (req, res) => {
    const sql = `DELETE FROM roles WHERE id = $1`;
    const params = [req.params.id];

    pool.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
        } else if (!result.rowCount) {
            res.json({
                message: 'Role not found',
            });
        } else {
            res.json({
                message: 'deleted',
                changes: result.rowCount,
                id: req.params.id,
            });
        }
    });
})

app.delete ('api/department/:id', (req, res) => {
    const sql = `DELETE FROM departments WHERE id = $1`;
    const params = [req.params.id];

    pool.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
        } else if (!result.rowCount) {
            res.json({
                message: 'Department not found',
            });
        } else {
            res.json({
                message: 'deleted',
                changes: result.rowCount,
                id: req.params.id,
            });
        }
    });
})
