require('dotenv').config();
const fs = require('fs');
const path = require('path');
const db = require('./db');

async function runMigration() {
    try {
        const sql = fs.readFileSync(path.join(__dirname, 'migrations', 'create_tables.sql')).toString();
        await db.pool.query(sql);
        console.log('Migrations executed successfully');
        await db.pool.end();
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        try { await db.pool.end(); } catch (e) { /* ignore */ }
        process.exit(1);
    }
}

runMigration();
