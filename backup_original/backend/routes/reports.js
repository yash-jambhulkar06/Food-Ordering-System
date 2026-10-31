/**
 * Sales Analytics & Reporting Routes
 */

const express = require('express');
const router = express.Router();
const DB = require('../db');

// GET /api/reports/sales (with optional ?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD)
router.get('/sales', (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        let sql = `
            SELECT o.order_id, o.user_id, o.order_date, o.total_amount, o.status,
                   o.delivery_address, o.pincode, o.delivery_boy_id,
                   u.name as customer_name, u.phone as customer_phone,
                   p.mode as payment_mode, p.payment_status, p.transaction_id
            FROM orders o
            LEFT JOIN users u ON o.user_id = u.user_id
            LEFT JOIN payments p ON o.order_id = p.order_id
            WHERE 1=1
        `;
        const params = [];

        if (startDate) {
            sql += ' AND o.order_date >= ?';
            params.push(startDate + ' 00:00:00');
        }

        if (endDate) {
            sql += ' AND o.order_date <= ?';
            params.push(endDate + ' 23:59:59');
        }

        sql += ' ORDER BY o.order_id DESC';

        const orders = DB.query(sql, params);

        const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total_amount), 0);
        const totalOrders = orders.length;
        const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;
        const pendingOrders = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length;

        return res.json({
            success: true,
            totalRevenue,
            totalOrders,
            deliveredOrders,
            pendingOrders,
            orders
        });
    } catch (err) {
        console.error('Sales report error:', err);
        return res.status(500).json({ success: false, message: 'Failed to generate sales report' });
    }
});

module.exports = router;
