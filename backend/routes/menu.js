/**
 * Menu & Category Management Routes
 */

const express = require('express');
const router = express.Router();
const DB = require('../db');

// ================= MENU ITEMS =================

// GET /api/menu (all dishes or filtered by ?category=)
router.get('/menu', (req, res) => {
    try {
        const { category } = req.query;
        let items;
        if (category && category !== 'All') {
            items = DB.query('SELECT * FROM food_items WHERE category = ? ORDER BY item_id ASC', [category]);
        } else {
            items = DB.query('SELECT * FROM food_items ORDER BY item_id ASC');
        }
        return res.json({ success: true, items });
    } catch (err) {
        console.error('Fetch menu error:', err);
        return res.status(500).json({ success: false, message: 'Failed to retrieve menu items' });
    }
});

// GET /api/menu/:id
router.get('/menu/:id', (req, res) => {
    try {
        const item = DB.get('SELECT * FROM food_items WHERE item_id = ?', [req.params.id]);
        if (!item) {
            return res.status(404).json({ success: false, message: 'Dish not found' });
        }
        return res.json({ success: true, item });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});

// POST /api/menu (create new dish)
router.post('/menu', (req, res) => {
    try {
        const { name, category, price, description, image, availability } = req.body;
        if (!name || !price || !category) {
            return res.status(400).json({ success: false, message: 'Name, category, and price are required' });
        }

        const img = (image || '').trim() || 'assets/images/paneer-pizza.jpg';
        const avail = availability !== undefined ? Number(availability) : 1;

        const result = DB.run(`
            INSERT INTO food_items (name, category, price, description, image, availability)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [name.trim(), category.trim(), parseFloat(price), (description || '').trim(), img, avail]);

        const newItem = DB.get('SELECT * FROM food_items WHERE item_id = ?', [result.lastInsertRowid]);
        return res.status(201).json({ success: true, item: newItem });
    } catch (err) {
        console.error('Create dish error:', err);
        return res.status(500).json({ success: false, message: 'Failed to create menu item' });
    }
});

// PUT /api/menu/:id (update existing dish)
router.put('/menu/:id', (req, res) => {
    try {
        const { name, category, price, description, image, availability } = req.body;
        const itemId = req.params.id;

        const existing = DB.get('SELECT * FROM food_items WHERE item_id = ?', [itemId]);
        if (!existing) {
            return res.status(404).json({ success: false, message: 'Dish not found' });
        }

        const img = (image || '').trim() || existing.image;
        const avail = availability !== undefined ? Number(availability) : existing.availability;

        DB.run(`
            UPDATE food_items
            SET name = ?, category = ?, price = ?, description = ?, image = ?, availability = ?
            WHERE item_id = ?
        `, [
            name ? name.trim() : existing.name,
            category ? category.trim() : existing.category,
            price !== undefined ? parseFloat(price) : existing.price,
            description !== undefined ? description.trim() : existing.description,
            img,
            avail,
            itemId
        ]);

        const updated = DB.get('SELECT * FROM food_items WHERE item_id = ?', [itemId]);
        return res.json({ success: true, item: updated });
    } catch (err) {
        console.error('Update dish error:', err);
        return res.status(500).json({ success: false, message: 'Failed to update dish' });
    }
});

// DELETE /api/menu/:id
router.delete('/menu/:id', (req, res) => {
    try {
        const itemId = req.params.id;
        DB.run('DELETE FROM food_items WHERE item_id = ?', [itemId]);
        return res.json({ success: true, message: 'Item deleted successfully' });
    } catch (err) {
        console.error('Delete dish error:', err);
        return res.status(500).json({ success: false, message: 'Failed to delete dish' });
    }
});

// ================= CATEGORIES =================

// GET /api/categories
router.get('/categories', (req, res) => {
    try {
        const rows = DB.query('SELECT name FROM categories ORDER BY category_id ASC');
        const categories = rows.map(r => r.name);
        return res.json({ success: true, categories });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});

// POST /api/categories
router.post('/categories', (req, res) => {
    try {
        const { name } = req.body;
        const cleanName = (name || '').trim();
        if (!cleanName) {
            return res.status(400).json({ success: false, message: 'Category title cannot be blank.' });
        }

        const existing = DB.get('SELECT category_id FROM categories WHERE LOWER(name) = ?', [cleanName.toLowerCase()]);
        if (existing) {
            return res.status(409).json({ success: false, message: 'Category already exists.' });
        }

        DB.run('INSERT INTO categories (name) VALUES (?)', [cleanName]);
        return res.status(201).json({ success: true, name: cleanName });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});

// DELETE /api/categories/:name
router.delete('/categories/:name', (req, res) => {
    try {
        const catName = decodeURIComponent(req.params.name);
        DB.run('DELETE FROM categories WHERE name = ?', [catName]);
        return res.json({ success: true, message: 'Category removed' });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
