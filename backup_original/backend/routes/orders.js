/**
 * Orders & Checkout Processing Routes
 */

const express = require('express');
const router = express.Router();
const DB = require('../db');

// Helper to assemble full order details with joins
function getFullOrderDetails(orderId) {
    const order = DB.get('SELECT * FROM orders WHERE order_id = ?', [orderId]);
    if (!order) return null;

    // Join order items with dish details
    const items = DB.query(`
        SELECT oi.order_item_id, oi.order_id, oi.item_id, oi.quantity, oi.price,
               fi.name, fi.image, fi.category
        FROM order_items oi
        LEFT JOIN food_items fi ON oi.item_id = fi.item_id
        WHERE oi.order_id = ?
    `, [orderId]);

    // Payment details
    const payment = DB.get('SELECT * FROM payments WHERE order_id = ?', [orderId]) || null;

    // Customer details
    const customer = DB.get(`
        SELECT user_id, name, email, phone, address, role
        FROM users WHERE user_id = ?
    `, [order.user_id]) || {};

    // Delivery boy details
    const deliveryStaff = order.delivery_boy_id ? DB.get(`
        SELECT user_id, name, email, phone, address, role
        FROM users WHERE user_id = ?
    `, [order.delivery_boy_id]) : null;

    // Feedback details
    const feedback = DB.get('SELECT * FROM feedback WHERE order_id = ?', [orderId]) || null;

    return {
        ...order,
        items,
        payment,
        customer,
        deliveryStaff,
        feedback
    };
}

// GET /api/orders (all orders or filtered by user_id, status, delivery_boy_id, order_id)
router.get('/', (req, res) => {
    try {
        const { user_id, status, delivery_boy_id, order_id } = req.query;

        let sql = 'SELECT order_id FROM orders WHERE 1=1';
        const params = [];

        if (order_id) {
            sql += ' AND order_id = ?';
            params.push(Number(order_id));
        }

        if (user_id) {
            sql += ' AND user_id = ?';
            params.push(Number(user_id));
        }

        if (status && status !== 'All') {
            sql += ' AND status = ?';
            params.push(status);
        }

        if (delivery_boy_id) {
            sql += ' AND delivery_boy_id = ?';
            params.push(Number(delivery_boy_id));
        }

        sql += ' ORDER BY order_id DESC';

        const rawRows = DB.query(sql, params);
        const orders = rawRows.map(r => getFullOrderDetails(r.order_id)).filter(Boolean);
        return res.json({ success: true, orders });
    } catch (err) {
        console.error('Fetch orders error:', err);
        return res.status(500).json({ success: false, message: 'Failed to retrieve orders' });
    }
});

// GET /api/orders/:id
router.get('/:id', (req, res) => {
    try {
        const orderId = Number(req.params.id);
        const fullOrder = getFullOrderDetails(orderId);
        if (!fullOrder) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        return res.json({ success: true, order: fullOrder });
    } catch (err) {
        console.error('Get order by id error:', err);
        return res.status(500).json({ success: false, message: err.message });
    }
});

// POST /api/orders (place new order)
router.post('/', (req, res) => {
    try {
        const { user_id, email, delivery_address, pincode, payment_mode, items, total_amount, city } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: 'Cart items are required' });
        }

        if (!delivery_address || !pincode) {
            return res.status(400).json({ success: false, message: 'Delivery address and pincode are required' });
        }

        // Determine user ID with foreign key validation
        let customerId = user_id ? Number(user_id) : null;
        let validUser = customerId ? DB.get('SELECT user_id FROM users WHERE user_id = ?', [customerId]) : null;
        
        // If not found by user_id, match by email if provided
        if (!validUser && email) {
            validUser = DB.get('SELECT user_id FROM users WHERE LOWER(email) = LOWER(?)', [email.trim()]);
            if (validUser) customerId = validUser.user_id;
        }

        if (!validUser) {
            const fallbackUser = DB.get('SELECT user_id FROM users WHERE LOWER(role) = ? LIMIT 1', ['customer']) 
                              || DB.get('SELECT user_id FROM users LIMIT 1');
            customerId = fallbackUser ? fallbackUser.user_id : 4;
        }

        // Determine delivery boy ID with foreign key validation
        const deliveryStaff = DB.get('SELECT user_id FROM users WHERE LOWER(role) = ? LIMIT 1', ['delivery']);
        const deliveryBoyId = deliveryStaff ? deliveryStaff.user_id : null;

        // Ensure city is formatted into delivery_address
        const cleanAddr = delivery_address.trim();
        const finalAddress = (city && !cleanAddr.toLowerCase().includes(city.toLowerCase()))
            ? `${cleanAddr}, ${city.trim()}`
            : cleanAddr;

        // Calculate next order ID (1001 if existing max is <= 1000)
        const maxRow = DB.get('SELECT MAX(order_id) as maxId FROM orders');
        const maxOrderId = maxRow && maxRow.maxId ? maxRow.maxId : 1000;
        const newOrderId = maxOrderId < 1000 ? 1001 : maxOrderId + 1;

        // Calculate total amount if not explicitly passed
        let subtotal = 0;
        items.forEach(item => {
            subtotal += (Number(item.price) * Number(item.quantity));
        });
        const deliveryFee = (subtotal >= 499 || subtotal === 0) ? 0 : 40;
        const finalTotal = total_amount ? Number(total_amount) : Math.round(subtotal + deliveryFee);

        // Format timestamp YYYY-MM-DD HH:mm:ss
        const now = new Date();
        const formattedDate = now.getFullYear() + '-' +
            String(now.getMonth() + 1).padStart(2, '0') + '-' +
            String(now.getDate()).padStart(2, '0') + ' ' +
            String(now.getHours()).padStart(2, '0') + ':' +
            String(now.getMinutes()).padStart(2, '0') + ':' +
            String(now.getSeconds()).padStart(2, '0');

        const initialStatus = req.body.status || 'Placed';
        const initialDeliveryBoy = req.body.delivery_boy_id !== undefined ? (req.body.delivery_boy_id ? Number(req.body.delivery_boy_id) : null) : null;

        // Insert Order
        DB.run(`
            INSERT INTO orders (order_id, user_id, order_date, total_amount, status, delivery_address, pincode, delivery_boy_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [newOrderId, customerId, formattedDate, finalTotal, initialStatus, finalAddress, pincode.trim(), initialDeliveryBoy]);

        // Insert Order Items with item_id validation
        const itemStmt = `INSERT INTO order_items (order_id, item_id, quantity, price) VALUES (?, ?, ?, ?)`;
        const firstItemInDb = DB.get('SELECT item_id FROM food_items LIMIT 1');
        const fallbackItemId = firstItemInDb ? firstItemInDb.item_id : 1;

        items.forEach(it => {
            let targetItemId = Number(it.item_id);
            const itemInDb = DB.get('SELECT item_id FROM food_items WHERE item_id = ?', [targetItemId]);
            if (!itemInDb) {
                const matchByName = it.name ? DB.get('SELECT item_id FROM food_items WHERE LOWER(name) = LOWER(?)', [it.name]) : null;
                targetItemId = matchByName ? matchByName.item_id : fallbackItemId;
            }
            DB.run(itemStmt, [newOrderId, targetItemId, Number(it.quantity) || 1, Number(it.price) || 0]);
        });

        // Insert Payment Record
        const mode = payment_mode || 'UPI';
        const txnRef = mode === 'COD' ? `COD${newOrderId}` : (mode === 'UPI' ? `UPI${Date.now()}` : `TXN${Date.now()}`);
        const payStatus = mode === 'COD' ? 'Pending' : 'Completed';

        DB.run(`
            INSERT INTO payments (order_id, mode, amount, payment_status, transaction_id)
            VALUES (?, ?, ?, ?, ?)
        `, [newOrderId, mode, finalTotal, payStatus, txnRef]);

        const fullNewOrder = getFullOrderDetails(newOrderId);

        return res.status(201).json({
            success: true,
            order_id: newOrderId,
            status: 'Preparing',
            total_amount: finalTotal,
            order: fullNewOrder
        });
    } catch (err) {
        console.error('Place order error:', err);
        return res.status(500).json({ success: false, message: 'Failed to place order' });
    }
});

// PUT /api/orders/:id/status (update status and/or assign delivery staff)
router.put('/:id/status', (req, res) => {
    try {
        const orderId = Number(req.params.id);
        const { status, delivery_boy_id } = req.body;

        const existing = DB.get('SELECT * FROM orders WHERE order_id = ?', [orderId]);
        if (!existing) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        const newStatus = status || existing.status;
        const newDeliveryStaff = delivery_boy_id !== undefined ? (delivery_boy_id ? Number(delivery_boy_id) : null) : existing.delivery_boy_id;

        DB.run(`
            UPDATE orders
            SET status = ?, delivery_boy_id = ?
            WHERE order_id = ?
        `, [newStatus, newDeliveryStaff, orderId]);

        // If marked delivered and payment mode was COD, complete payment status
        if (newStatus === 'Delivered') {
            DB.run(`
                UPDATE payments
                SET payment_status = 'Completed'
                WHERE order_id = ? AND mode = 'COD'
            `, [orderId]);
        }

        const updatedOrder = getFullOrderDetails(orderId);
        return res.json({ success: true, order: updatedOrder });
    } catch (err) {
        console.error('Update order status error:', err);
        return res.status(500).json({ success: false, message: 'Failed to update order status' });
    }
});

module.exports = router;
