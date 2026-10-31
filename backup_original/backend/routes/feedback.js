/**
 * Customer Feedback & Reviews Routes
 */

const express = require('express');
const router = express.Router();
const DB = require('../db');

// GET /api/feedback
router.get('/', (req, res) => {
    try {
        const feedbackList = DB.query(`
            SELECT f.feedback_id, f.order_id, f.user_id, f.rating, f.comment, f.date,
                   COALESCE(u.name, 'Verified Customer') as user_name
            FROM feedback f
            LEFT JOIN users u ON f.user_id = u.user_id
            ORDER BY f.feedback_id DESC
        `);
        return res.json({ success: true, feedback: feedbackList });
    } catch (err) {
        console.error('Fetch feedback error:', err);
        return res.status(500).json({ success: false, message: 'Failed to retrieve feedback' });
    }
});

// POST /api/feedback
router.post('/', (req, res) => {
    try {
        const { order_id, user_id, rating, comment } = req.body;
        if (!order_id || !rating || !comment) {
            return res.status(400).json({ success: false, message: 'Order ID, rating, and comment are required' });
        }

        let customerId = user_id ? Number(user_id) : 4;
        const validUser = DB.get('SELECT user_id FROM users WHERE user_id = ?', [customerId]);
        if (!validUser) {
            const fallbackUser = DB.get('SELECT user_id FROM users WHERE LOWER(role) = ? LIMIT 1', ['customer'])
                              || DB.get('SELECT user_id FROM users LIMIT 1');
            customerId = fallbackUser ? fallbackUser.user_id : 4;
        }

        let targetOrderId = Number(order_id);
        const validOrder = DB.get('SELECT order_id FROM orders WHERE order_id = ?', [targetOrderId]);
        if (!validOrder) {
            const latestOrder = DB.get('SELECT order_id FROM orders ORDER BY order_id DESC LIMIT 1');
            if (latestOrder) {
                targetOrderId = latestOrder.order_id;
            } else {
                return res.status(404).json({ success: false, message: 'No valid order found to link feedback' });
            }
        }

        const now = new Date();
        const formattedDate = now.getFullYear() + '-' +
            String(now.getMonth() + 1).padStart(2, '0') + '-' +
            String(now.getDate()).padStart(2, '0') + ' ' +
            String(now.getHours()).padStart(2, '0') + ':' +
            String(now.getMinutes()).padStart(2, '0') + ':' +
            String(now.getSeconds()).padStart(2, '0');

        const result = DB.run(`
            INSERT INTO feedback (order_id, user_id, rating, comment, date)
            VALUES (?, ?, ?, ?, ?)
        `, [targetOrderId, customerId, Number(rating), comment.trim(), formattedDate]);

        const newFeedback = DB.get(`
            SELECT f.feedback_id, f.order_id, f.user_id, f.rating, f.comment, f.date,
                   COALESCE(u.name, 'Verified Customer') as user_name
            FROM feedback f
            LEFT JOIN users u ON f.user_id = u.user_id
            WHERE f.feedback_id = ?
        `, [result.lastInsertRowid]);

        return res.status(201).json({ success: true, feedback: newFeedback });
    } catch (err) {
        console.error('Post feedback error:', err);
        return res.status(500).json({ success: false, message: 'Failed to submit feedback' });
    }
});

module.exports = router;
