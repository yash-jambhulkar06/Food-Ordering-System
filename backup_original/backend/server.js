/**
 * SpiceRoute Online Food Ordering System - Application Server (Backend Tier)
 * College Microproject - Waterfall Model Implementation
 */

const express = require('express');
const cors = require('cors');
const path = require('path');

// Ensure database is initialized
const DB = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger for debugging and college demo
app.use((req, res, next) => {
    if (req.path.startsWith('/api/')) {
        console.log(`[API ${req.method}] ${req.path}`);
    }
    next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'UP',
        system: 'SpiceRoute Restaurant Backend',
        model: 'Waterfall Model College Microproject',
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api', require('./routes/menu')); // Provides /api/menu and /api/categories
app.use('/api/orders', require('./routes/orders'));
app.use('/api/feedback', require('./routes/feedback'));
app.use('/api/users', require('./routes/users'));
app.use('/api/reports', require('./routes/reports'));

// Serve frontend static files from root directory
const publicDir = path.join(__dirname, '..');
app.use(express.static(publicDir));

// Fallback for root route
app.get('/', (req, res) => {
    res.sendFile(path.join(publicDir, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log('========================================================');
    console.log('   SpiceRoute Online Food Ordering System Backend');
    console.log('   Waterfall Model Microproject - Node.js + SQLite');
    console.log('========================================================');
    console.log(`   Web App & Portal:   http://localhost:${PORT}`);
    console.log(`   REST API Root:      http://localhost:${PORT}/api`);
    console.log(`   Health Check:       http://localhost:${PORT}/api/health`);
    console.log(`   Database Path:      backend/data/spiceroute.sqlite`);
    console.log('========================================================');
});
