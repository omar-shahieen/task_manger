require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const authRoutes = require('./routes/auth');
const tasksRoutes = require('./routes/tasks');

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/tasks', tasksRoutes);

// Default 404 handler for unknown routes
app.use((req, res, next) => {
    res.status(404).json({ error: 'Not Found' });
});

// Generic error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 4000;

// Verify DB connection before starting the server
const db = require('./db');

(async () => {
    try {
        await db.query('SELECT 1');
        let server = app.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`);
        });

        // Graceful shutdown: close server and DB pool on SIGINT/SIGTERM
        const shutdown = async (signal) => {
            console.log(`${signal} received: closing server and database pool`);
            server.close(async () => {
                try {
                    await db.end();
                } catch (e) {
                    // ignore
                }
                process.exit(0);
            });
            // Force exit if not closed in 5s
            setTimeout(() => process.exit(1), 5000);
        };
        process.on('SIGINT', () => shutdown('SIGINT'));
        process.on('SIGTERM', () => shutdown('SIGTERM'));
    } catch (err) {
        console.error('Failed to connect to the database, aborting startup:', err.message || err);
        process.exit(1);
    }
})();
