/**
 * Staff & User Accounts Directory Routes
 */

const express = require('express');
const router = express.Router();
const DB = require('../db');

// GET /api/users (with optional ?role=delivery, customer, admin)
router.get('/', (req, res) => {
    try {
        const { role } = req.query;
        let users;
        if (role) {
            users = DB.query(`
                SELECT user_id, name, email, phone, address, role, created_at
                FROM users
                WHERE LOWER(role) = LOWER(?)
                ORDER BY user_id ASC
            `, [role]);
        } else {
            users = DB.query(`
                SELECT user_id, name, email, phone, address, role, created_at
                FROM users
                ORDER BY user_id ASC
            `);
        }
        return res.json({ success: true, users });
    } catch (err) {
        console.error('Fetch users error:', err);
        return res.status(500).json({ success: false, message: 'Failed to retrieve users' });
    }
});

// GET /api/users/delivery-staff
router.get('/delivery-staff', (req, res) => {
    try {
        const staff = DB.query(`
            SELECT user_id, name, email, phone, address, role
            FROM users
            WHERE LOWER(role) = 'delivery'
            ORDER BY user_id ASC
        `);
        return res.json({ success: true, staff });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
