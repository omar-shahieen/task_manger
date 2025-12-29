const express = require('express');
const db = require('../db');
const auth = require('../middleware/auth');
const router = express.Router();

// Protect all routes
router.use(auth);

// GET /tasks - list tasks for logged-in user
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC', [req.user.id]);
        res.status(200).json({ tasks: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /tasks - create task
router.post('/', async (req, res) => {
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });

    try {
        const result = await db.query(
            'INSERT INTO tasks (user_id, title, description) VALUES ($1, $2, $3) RETURNING *',
            [req.user.id, title, description]
        );
        res.status(201).json({ task: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// PUT /tasks/:id - update task (only owner)
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, status } = req.body;

    try {
        // Verify owner
        const found = await db.query('SELECT * FROM tasks WHERE id = $1', [id]);
        if (found.rows.length === 0) return res.status(404).json({ error: 'Task not found' });

        const task = found.rows[0];
        if (task.user_id !== req.user.id) return res.status(403).json({ error: 'Not authorized' });

        const updated = await db.query(
            `UPDATE tasks SET title = COALESCE($1, title), description = COALESCE($2, description), status = COALESCE($3, status)
       WHERE id = $4 RETURNING *`,
            [title, description, status, id]
        );


        res.status(200).json({ task: updated.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// DELETE /tasks/:id - delete task (only owner)
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const found = await db.query('SELECT * FROM tasks WHERE id = $1', [id]);
        if (found.rows.length === 0) return res.status(404).json({ error: 'Task not found' });
        if (found.rows[0].user_id !== req.user.id) return res.status(403).json({ error: 'Not authorized' });

        await db.query('DELETE FROM tasks WHERE id = $1', [id]);
        res.status(200).json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
