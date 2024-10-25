import inquirer from 'inquirer';
import express from 'express';
import { pool, connectToDb } from './connections.js';
await connectToDb();
const PORT = process.env.PORT || 3001;
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
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
            app.get('api/employees', async (_req, res) => {
                const result = await pool.query('SELECT * FROM employees');
                res.json(result.rows);
            });
            break;
        case 'View all roles':
            app.get('api/roles', async (_req, res) => {
                const result = await pool.query('SELECT * FROM roles');
                res.json(result.rows);
            });
            break;
        case 'View all departments':
            app.get('api/departments', async (_req, res) => {
                const result = await pool.query('SELECT * FROM departments');
                res.json(result.rows);
            });
            break;
        case 'Add a new employee':
            app.post('api/new employee', async (_req, res) => {
                const result = await pool.query('SELECT * FROM employees');
                res.json(result.rows);
            });
            break;
        case 'Add a new role':
            app.post('api/new role', async (_req, res) => {
                const result = await pool.query('SELECT * FROM roles');
                res.json(result.rows);
            });
            break;
        case 'Add a new department':
            app.post('api/new department', async (_req, res) => {
                const result = await pool.query('SELECT * FROM departments');
                res.json(result.rows);
            });
            break;
        case 'Delete an employee':
            app.delete('api/employee/:id', async (req, res) => {
                const result = await pool.query('DELETE FROM employees WHERE id = $1', [req.params.id]);
                res.json(result.rows);
            });
            break;
        case 'Delete a role':
            app.delete('api/role/:id', async (req, res) => {
                const result = await pool.query('DELETE FROM roles WHERE id = $1', [req.params.id]);
                res.json(result.rows);
            });
            break;
        case 'Delete a department':
            app.delete('api/department/:id', async (req, res) => {
                const result = await pool.query('DELETE FROM departments WHERE id = $1', [req.params.id]);
                res.json(result.rows);
            });
            break;
        case 'Update an employee role':
            app.put('api/employee/:id', async (req, res) => {
                const result = await pool.query('UPDATE employees SET role_id = $1 WHERE id = $2', [req.body.role_id, req.params.id]);
                res.json(result.rows);
            });
            break;
    }
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
