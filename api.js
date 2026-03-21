const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { stmts } = require('./db');

const router = express.Router();

// --- JWT secret ---

function getJwtSecret() {
    const secretPath = path.join(__dirname, 'data', '.jwt-secret');
    try {
        return fs.readFileSync(secretPath, 'utf8').trim();
    } catch {
        const secret = crypto.randomBytes(64).toString('hex');
        fs.writeFileSync(secretPath, secret);
        return secret;
    }
}

const JWT_SECRET = process.env.JWT_SECRET || getJwtSecret();
const TOKEN_EXPIRY = '30d';

function signToken(user) {
    return jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

// --- Auth middleware ---

function authenticate(req, res, next) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    try {
        const decoded = jwt.verify(header.slice(7), JWT_SECRET);
        req.user = decoded;
        next();
    } catch {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}

// --- Rate limiting ---

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    message: { error: 'Too many attempts. Please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});

const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5,
    message: { error: 'Too many accounts created. Please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// --- Validation ---

function validateEmail(email) {
    if (!email || typeof email !== 'string') return false;
    const trimmed = email.trim().toLowerCase();
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) && trimmed.length <= 254;
}

function normalizeEmail(email) {
    return email.trim().toLowerCase();
}

// --- Routes ---

router.post('/register', registerLimiter, authLimiter, (req, res) => {
    const { email, password } = req.body || {};

    if (!validateEmail(email)) {
        return res.status(400).json({ error: 'Please enter a valid email address' });
    }
    if (!password || typeof password !== 'string' || password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    const normalizedEmail = normalizeEmail(email);

    const existing = stmts.getUserByEmail.get(normalizedEmail);
    if (existing) {
        return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const hash = bcrypt.hashSync(password, 10);
    const result = stmts.createUser.run(normalizedEmail, hash);
    const user = { id: result.lastInsertRowid, email: normalizedEmail };
    const token = signToken(user);

    res.status(201).json({ token, email: user.email });
});

router.post('/login', authLimiter, (req, res) => {
    const { email, password } = req.body || {};

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    const normalizedEmail = normalizeEmail(email);
    const user = stmts.getUserByEmail.get(normalizedEmail);

    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
        return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = signToken(user);
    res.json({ token, email: user.email });
});

router.get('/data', authenticate, (req, res) => {
    const row = stmts.getData.get(req.user.userId);
    if (!row) {
        return res.json({ data: null, updatedAt: null });
    }
    res.json({ data: JSON.parse(row.data), updatedAt: row.updated_at });
});

router.put('/data', authenticate, (req, res) => {
    const { data } = req.body || {};
    if (!data || typeof data !== 'object') {
        return res.status(400).json({ error: 'Invalid data payload' });
    }

    stmts.upsertData.run(req.user.userId, JSON.stringify(data));
    const row = stmts.getData.get(req.user.userId);
    res.json({ success: true, updatedAt: row.updated_at });
});

module.exports = router;
