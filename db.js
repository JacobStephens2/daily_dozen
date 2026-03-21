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

    CREATE TABLE IF NOT EXISTS password_resets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        token TEXT UNIQUE NOT NULL,
        expires_at TEXT NOT NULL,
        used INTEGER DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users(id)
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
    createReset: db.prepare('INSERT INTO password_resets (user_id, token, expires_at) VALUES (?, ?, datetime(\'now\', \'+1 hour\'))'),
    getValidReset: db.prepare('SELECT * FROM password_resets WHERE token = ? AND used = 0 AND expires_at > datetime(\'now\')'),
    markResetUsed: db.prepare('UPDATE password_resets SET used = 1 WHERE id = ?'),
    updatePassword: db.prepare('UPDATE users SET password_hash = ? WHERE id = ?'),
    upsertData: db.prepare(`
        INSERT INTO user_data (user_id, data, updated_at)
        VALUES (?, ?, datetime('now'))
        ON CONFLICT(user_id) DO UPDATE SET data = excluded.data, updated_at = datetime('now')
    `),
};

module.exports = { db, stmts };
