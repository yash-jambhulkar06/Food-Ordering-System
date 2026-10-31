/**
 * Authentication & User Profile Routes
 */

const express = require('express');
const router = express.Router();
const DB = require('../db');

// Helper to sanitize user object (strip password)
function sanitizeUser(user) {
    if (!user) return null;
    const { password, ...safeUser } = user;
    return safeUser;
}

// POST /api/auth/login
router.post('/login', (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }

        const cleanEmail = email.trim().toLowerCase();
        const cleanPass = password.trim();

        const user = DB.get('SELECT * FROM users WHERE LOWER(email) = ? AND password = ?', [cleanEmail, cleanPass]);
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        return res.json({
            success: true,
            user: sanitizeUser(user)
        });
    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ success: false, message: 'Server error during login' });
    }
});

// POST /api/auth/register
router.post('/register', (req, res) => {
    try {
        const { name, email, password, phone, address } = req.body;
        if (!name || !email || !password || !phone) {
            return res.status(400).json({ success: false, message: 'Please provide all required fields' });
        }

        const cleanEmail = email.trim().toLowerCase();

        // Check if user already exists
        const existing = DB.get('SELECT user_id FROM users WHERE LOWER(email) = ?', [cleanEmail]);
        if (existing) {
            return res.status(409).json({ success: false, message: 'An account with this email address already exists.' });
        }

        const result = DB.run(`
            INSERT INTO users (name, email, password, phone, address, role)
            VALUES (?, ?, ?, ?, ?, 'customer')
        `, [name.trim(), cleanEmail, password, phone.trim(), (address || '').trim()]);

        const newUser = DB.get('SELECT * FROM users WHERE user_id = ?', [result.lastInsertRowid]);

        return res.status(201).json({
            success: true,
            user: sanitizeUser(newUser)
        });
    } catch (err) {
        console.error('Registration error:', err);
        return res.status(500).json({ success: false, message: 'Server error during registration' });
    }
});

// GET /api/auth/profile/:id
router.get('/profile/:id', (req, res) => {
    try {
        const user = DB.get('SELECT * FROM users WHERE user_id = ?', [req.params.id]);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        return res.json({ success: true, user: sanitizeUser(user) });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});

// PUT /api/auth/profile/:id
router.put('/profile/:id', (req, res) => {
    try {
        const { name, phone, address } = req.body;
        const userId = req.params.id;

        DB.run(`
            UPDATE users
            SET name = ?, phone = ?, address = ?
            WHERE user_id = ?
        `, [name.trim(), phone.trim(), address.trim(), userId]);

        const updated = DB.get('SELECT * FROM users WHERE user_id = ?', [userId]);
        if (!updated) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        return res.json({
            success: true,
            user: sanitizeUser(updated)
        });
    } catch (err) {
        console.error('Profile update error:', err);
        return res.status(500).json({ success: false, message: 'Failed to update profile' });
    }
});

module.exports = router;
