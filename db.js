const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
}

const db = new Database(path.join(DATA_DIR, 'daily_dozen.db'));

// Enable WAL mode for better concurrent read performance
db.pragma('journal_mode = WAL');

db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS user_data (
        user_id INTEGER PRIMARY KEY,
        data TEXT NOT NULL,
        updated_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (user_id) REFERENCES users(id)
    );
`);

const stmts = {
    createUser: db.prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)'),
    getUserByEmail: db.prepare('SELECT * FROM users WHERE email = ?'),
    getUserById: db.prepare('SELECT id, email, created_at FROM users WHERE id = ?'),
    getData: db.prepare('SELECT data, updated_at FROM user_data WHERE user_id = ?'),
    upsertData: db.prepare(`
        INSERT INTO user_data (user_id, data, updated_at)
        VALUES (?, ?, datetime('now'))
        ON CONFLICT(user_id) DO UPDATE SET data = excluded.data, updated_at = datetime('now')
    `),
};

module.exports = { db, stmts };
