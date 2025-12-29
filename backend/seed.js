require('dotenv').config();
const bcrypt = require('bcrypt');
const db = require('./db');

async function seed() {
    try {
        await db.pool.query('BEGIN');

        const users = [
            { name: 'Alice', email: 'alice@example.com', password: 'password123' },
            { name: 'Bob', email: 'bob@example.com', password: 'password123' }
        ];

        const createdUsers = {};

        for (const u of users) {
            const hashed = await bcrypt.hash(u.password, 10);
            const res = await db.query(
                `INSERT INTO users (name, email, password)
                 VALUES ($1, $2, $3)
                 ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, password = EXCLUDED.password
                 RETURNING id`,
                [u.name, u.email, hashed]
            );
            createdUsers[u.email] = res.rows[0].id;
        }

        const tasks = [
            {
                userEmail: 'alice@example.com',
                title: 'Buy groceries',
                description: 'Milk, eggs, bread',
                status: 'pending'
            },
            {
                userEmail: 'alice@example.com',
                title: 'Finish report',
                description: 'Complete the project report and send to manager',
                status: 'in_progress'
            },
            {
                userEmail: 'bob@example.com',
                title: 'Plan trip',
                description: 'Book flights and hotel for conference',
                status: 'done'
            }
        ];

        for (const t of tasks) {
            const userId = createdUsers[t.userEmail];
            if (!userId) continue;
            // remove potential duplicate seeded task
            await db.query('DELETE FROM tasks WHERE user_id = $1 AND title = $2', [userId, t.title]);
            await db.query(
                'INSERT INTO tasks (user_id, title, description, status) VALUES ($1, $2, $3, $4)',
                [userId, t.title, t.description, t.status]
            );
        }

        await db.pool.query('COMMIT');
        console.log('Database seeded successfully ✅');
    } catch (err) {
        console.error('Seeding failed:', err);
        try { await db.pool.query('ROLLBACK'); } catch (e) { /* ignore */ }
        process.exitCode = 1;
    } finally {
        try { await db.pool.end(); } catch (e) { /* ignore */ }
    }
}

seed();
