/**
 * SpiceRoute Online Food Ordering System - Backend Data Layer
 * SQLite Database Connection, Schema Definition, and Seed Data Initializer
 */

const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'data', 'spiceroute.sqlite');

// Ensure data folder exists
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

let db;

try {
    const { DatabaseSync } = require('node:sqlite');
    db = new DatabaseSync(dbPath);
    // Enable WAL mode and foreign keys for performance and data integrity
    db.exec('PRAGMA journal_mode = WAL;');
    db.exec('PRAGMA foreign_keys = ON;');
} catch (err) {
    console.error('Failed to load node:sqlite:', err);
    throw err;
}

// Database helper functions for unified, clean execution across routes
const DB = {
    // Execute DDL or raw batch commands
    exec(sql) {
        return db.exec(sql);
    },

    // Query multiple rows (SELECT)
    query(sql, params = []) {
        const stmt = db.prepare(sql);
        return stmt.all(...params);
    },

    // Query a single row (SELECT ... LIMIT 1)
    get(sql, params = []) {
        const stmt = db.prepare(sql);
        return stmt.get(...params);
    },

    // Run an INSERT, UPDATE, or DELETE statement
    run(sql, params = []) {
        const stmt = db.prepare(sql);
        return stmt.run(...params);
    }
};

/**
 * Initialize Database Tables
 * Relational schema representing Users, Categories, Food Items, Orders, Order Items, Payments, Feedback
 */
function initSchema() {
    db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            user_id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            phone TEXT NOT NULL,
            address TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'customer',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS categories (
            category_id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL
        );

        CREATE TABLE IF NOT EXISTS food_items (
            item_id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            price REAL NOT NULL,
            description TEXT NOT NULL,
            image TEXT NOT NULL,
            availability INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS orders (
            order_id INTEGER PRIMARY KEY,
            user_id INTEGER NOT NULL,
            order_date DATETIME NOT NULL,
            total_amount REAL NOT NULL,
            status TEXT NOT NULL DEFAULT 'Placed',
            delivery_address TEXT NOT NULL,
            pincode TEXT NOT NULL,
            delivery_boy_id INTEGER,
            FOREIGN KEY (user_id) REFERENCES users(user_id),
            FOREIGN KEY (delivery_boy_id) REFERENCES users(user_id)
        );

        CREATE TABLE IF NOT EXISTS order_items (
            order_item_id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER NOT NULL,
            item_id INTEGER NOT NULL,
            quantity INTEGER NOT NULL,
            price REAL NOT NULL,
            FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
            FOREIGN KEY (item_id) REFERENCES food_items(item_id)
        );

        CREATE TABLE IF NOT EXISTS payments (
            payment_id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER NOT NULL,
            mode TEXT NOT NULL,
            amount REAL NOT NULL,
            payment_status TEXT NOT NULL DEFAULT 'Completed',
            transaction_id TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS feedback (
            feedback_id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            rating INTEGER NOT NULL,
            comment TEXT NOT NULL,
            date DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users(user_id)
        );
    `);
}

/**
 * Seed Sample Data if database is fresh
 */
function seedInitialData() {
    const userCount = DB.get('SELECT COUNT(*) as count FROM users');
    if (userCount && userCount.count > 0) {
        return; // Already seeded
    }

    console.log('Seeding initial SpiceRoute database records...');

    // 1. Initial Categories
    const initialCategories = [
        'Starters',
        'Main Course',
        'Pizza and Burgers',
        'Beverages',
        'Desserts'
    ];
    const catStmt = db.prepare('INSERT INTO categories (name) VALUES (?)');
    initialCategories.forEach(name => catStmt.run(name));

    // 2. Initial Users
    const initialUsers = [
        [1, 'Rajesh Malhotra', 'admin@spiceroute.in', 'Admin@123', '9820154321', 'SpiceRoute Central Kitchen, Bandra West, Mumbai', 'admin'],
        [2, 'Suresh Patil', 'delivery1@spiceroute.in', 'Delivery@123', '9876543211', 'Delivery Hub North, Andheri East, Mumbai', 'delivery'],
        [3, 'Amit Kumar', 'delivery2@spiceroute.in', 'Delivery@123', '9876543222', 'Delivery Hub South, Dadar, Mumbai', 'delivery'],
        [4, 'Pooja Verma', 'customer@spiceroute.in', 'Customer@123', '9819234567', 'Flat 402, Sea Green Apartments, Worli, Mumbai', 'customer'],
        [5, 'Rohit Sharma', 'rohit.sharma@gmail.com', 'Customer@123', '9820011223', '12, Silver Oaks, Linking Road, Santacruz West, Mumbai', 'customer'],
        [6, 'Ananya Sen', 'ananya.sen@gmail.com', 'Customer@123', '9833445566', '704, Skyline Towers, Powai, Mumbai', 'customer'],
        [7, 'Vikram Mehta', 'vikram.mehta@yahoo.com', 'Customer@123', '9845012345', 'B-21, Palm Meadows, Juhu, Mumbai', 'customer'],
        [8, 'Sneha Nair', 'sneha.nair@outlook.com', 'Customer@123', '9898765432', 'Flat 101, Shanti Niketan, Vile Parle East, Mumbai', 'customer'],
        [9, 'Kunal Kapoor', 'kunal.kapoor@gmail.com', 'Customer@123', '9870123456', 'Flat 12B, Ocean Crest, Marine Drive, Mumbai', 'customer'],
        [11, 'Chef Sanjeev (Hotel Kitchen)', 'hotel@spiceroute.in', 'Hotel@123', '9819001122', 'SpiceRoute Hotel Kitchen, Ground Floor, Mumbai', 'hotel']
    ];
    const userStmt = db.prepare(`
        INSERT INTO users (user_id, name, email, password, phone, address, role)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    initialUsers.forEach(u => userStmt.run(...u));

    // 3. Initial 25 Menu Items
    const initialFoodItems = [
        [1, 'Amritsari Paneer Tikka', 'Starters', 220, 'Cubes of cottage cheese marinated in spiced yogurt and chargrilled to perfection in the clay oven.', 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80', 1],
        [2, 'Crispy Golden Corn', 'Starters', 180, 'Sweet corn kernels tossed with freshly ground pepper, spring onions, and zesty lemon herbs.', 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&w=600&q=80', 1],
        [3, 'Hara Bhara Kabab', 'Starters', 190, 'Delicate patties of minced spinach, green peas, and potatoes infused with fresh mint and aromatic spices.', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80', 1],
        [4, 'Veg Manchurian Dry', 'Starters', 210, 'Crisp vegetable dumplings glazed in spicy ginger, garlic, and dark soy reduction.', 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=600&q=80', 1],
        [5, 'Herb Butter Garlic Bread', 'Starters', 160, 'Oven-toasted French baguette slices drenched in roasted garlic butter and topped with mozzarella.', 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?auto=format&fit=crop&w=600&q=80', 1],

        [6, 'Dal Makhani Bukhara', 'Main Course', 240, 'Whole black lentils slow-simmered overnight over charcoal embers, finished with churned butter and fresh cream.', 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80', 1],
        [7, 'Paneer Butter Masala', 'Main Course', 280, 'Succulent malai paneer simmered in a velvet-smooth cashew and vine-ripened tomato gravy.', 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80', 1],
        [8, 'Kadhai Soya Chaap', 'Main Course', 260, 'Tender soya fillets cooked with bell peppers, crushed coriander seeds, and Kashmiri dry chili.', 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&q=80', 1],
        [9, 'Hyderabadi Veg Dum Biryani', 'Main Course', 270, 'Long-grain basmati rice layered with garden vegetables and saffron, cooked on steam dum. Served with burani raita.', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80', 1],
        [10, 'Shahi Malai Kofta', 'Main Course', 290, 'Cottage cheese and dry-fruit stuffed croquettes floated in an aromatic saffron and white onion gravy.', 'https://images.unsplash.com/photo-1505253758473-96b3d5ebcd94?auto=format&fit=crop&w=600&q=80', 1],

        [11, 'Paneer Pizza', 'Pizza and Burgers', 250, 'Fresh cottage cheese cubes, diced bell peppers, onion, and herbs topped with 100% mozzarella cheese on hand-stretched dough.', 'assets/images/paneer-pizza.jpg', 1],
        [12, 'Farmhouse Veggie Pizza', 'Pizza and Burgers', 280, 'Crisp capsicum, sweet golden corn, ripe sliced tomatoes, and button mushrooms over herb tomato sauce.', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80', 1],
        [13, 'Classic Margherita Pizza', 'Pizza and Burgers', 210, 'Neapolitan sourdough crust with San Marzano tomato sauce, fresh basil, and whole milk mozzarella.', 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=600&q=80', 1],
        [14, 'Crispy Paneer Burger', 'Pizza and Burgers', 150, 'Golden spiced paneer patty with spicy schezwan sauce, fresh iceberg lettuce, and toasted sesame buns.', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80', 1],
        [15, 'Veggie Supreme Burger', 'Pizza and Burgers', 120, 'Golden potato and mixed veggie patty layered with crunchy red onions, sliced tomatoes, and house aioli.', 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80', 1],
        [16, 'Double Cheese Burst Burger', 'Pizza and Burgers', 180, 'Molten cheddar stuffed patty, spicy pickled jalapenos, caramelized onions, and smoky barbecue dip.', 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80', 1],

        [17, 'Cold Drink', 'Beverages', 50, 'Chilled fizzy soft drink served ice cold in a glass with lemon wedge.', 'assets/images/cold-drink.jpg', 1],
        [18, 'Fresh Mint Lime Soda', 'Beverages', 60, 'Freshly squeezed lime juice blended with garden mint leaves, club soda, and black salt.', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80', 1],
        [19, 'Alphonso Mango Shake', 'Beverages', 90, 'Thick and luscious Ratnagiri alphonso pulp blended with full-cream milk and saffron strands.', 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=600&q=80', 1],
        [20, 'Spiced Masala Chaas', 'Beverages', 40, 'Refreshing traditional churned buttermilk tempered with roasted cumin, green chilies, and coriander.', 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=600&q=80', 1],
        [21, 'Cold Coffee with Ice Cream', 'Beverages', 110, 'Chilled Arabica brew churned with milk and dark chocolate sauce, topped with vanilla bean ice cream.', 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80', 1],

        [22, 'Warm Chocolate Lava Cake', 'Desserts', 110, 'Decadent dark chocolate sponge cake with a warm center that cascades molten chocolate upon cutting.', 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80', 1],
        [23, 'Royal Gulab Jamun (2 Pcs)', 'Desserts', 70, 'Soft melt-in-the-mouth khoya spheres steeped in rose and green cardamom flavored syrup.', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80', 1],
        [24, 'Sizzling Brownie with Vanilla', 'Desserts', 140, 'Fudge walnut brownie served on a cast-iron skillet with rich hot fudge and chilled vanilla ice cream.', 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=600&q=80', 1],
        [25, 'Kesar Pista Matka Kulfi', 'Desserts', 80, 'Traditional slow-reduced dense milk ice cream infused with Kashmiri saffron and Iranian pistachios.', 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=600&q=80', 1]
    ];
    const foodStmt = db.prepare(`
        INSERT INTO food_items (item_id, name, category, price, description, image, availability)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    initialFoodItems.forEach(item => foodStmt.run(...item));

    // 4. Initial 15 Past Orders (IDs 986 to 1000)
    const initialOrders = [
        [986, 5, '2026-10-21 13:15:00', 520, 'Delivered', '12, Silver Oaks, Linking Road, Santacruz West, Mumbai', '400054', 2],
        [987, 6, '2026-10-22 14:00:00', 380, 'Delivered', '704, Skyline Towers, Powai, Mumbai', '400076', 3],
        [988, 7, '2026-10-22 19:30:00', 670, 'Delivered', 'B-21, Palm Meadows, Juhu, Mumbai', '400049', 2],
        [989, 8, '2026-10-23 12:45:00', 450, 'Delivered', 'Flat 101, Shanti Niketan, Vile Parle East, Mumbai', '400057', 3],
        [990, 9, '2026-10-23 20:10:00', 590, 'Delivered', 'Flat 12B, Ocean Crest, Marine Drive, Mumbai', '400020', 2],
        [991, 4, '2026-10-24 13:20:00', 550, 'Delivered', 'Flat 402, Sea Green Apartments, Worli, Mumbai', '400018', 3],
        [992, 5, '2026-10-24 19:05:00', 720, 'Delivered', '12, Silver Oaks, Linking Road, Santacruz West, Mumbai', '400054', 2],
        [993, 6, '2026-10-25 11:30:00', 320, 'Delivered', '704, Skyline Towers, Powai, Mumbai', '400076', 3],
        [994, 7, '2026-10-25 18:45:00', 480, 'Delivered', 'B-21, Palm Meadows, Juhu, Mumbai', '400049', 2],
        [995, 8, '2026-10-26 12:15:00', 630, 'Delivered', 'Flat 101, Shanti Niketan, Vile Parle East, Mumbai', '400057', 3],
        [996, 9, '2026-10-26 21:00:00', 810, 'Delivered', 'Flat 12B, Ocean Crest, Marine Drive, Mumbai', '400020', 2],
        [997, 5, '2026-10-27 11:15:00', 490, 'Delivered', '12, Silver Oaks, Linking Road, Santacruz West, Mumbai', '400054', 2],
        [998, 6, '2026-10-27 12:50:00', 600, 'Out for Delivery', '704, Skyline Towers, Powai, Mumbai', '400076', 3],
        [999, 7, '2026-10-27 13:40:00', 410, 'Preparing', 'B-21, Palm Meadows, Juhu, Mumbai', '400049', 2],
        [1000, 8, '2026-10-27 14:10:00', 350, 'Placed', 'Flat 101, Shanti Niketan, Vile Parle East, Mumbai', '400057', null]
    ];
    const orderStmt = db.prepare(`
        INSERT INTO orders (order_id, user_id, order_date, total_amount, status, delivery_address, pincode, delivery_boy_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    initialOrders.forEach(o => orderStmt.run(...o));

    // 5. Initial Order Items
    const initialOrderItems = [
        [1, 986, 7, 1, 280],
        [2, 986, 6, 1, 240],
        [3, 987, 11, 1, 250],
        [4, 987, 22, 1, 110],
        [5, 987, 17, 1, 50],
        [6, 988, 9, 2, 270],
        [7, 988, 24, 1, 140],
        [8, 991, 11, 2, 250],
        [9, 991, 17, 1, 50],
        [10, 998, 12, 2, 280],
        [11, 998, 20, 1, 40],
        [12, 999, 16, 2, 180],
        [13, 999, 17, 1, 50],
        [14, 1000, 1, 1, 220],
        [15, 1000, 24, 1, 140]
    ];
    const itemStmt = db.prepare(`
        INSERT INTO order_items (order_item_id, order_id, item_id, quantity, price)
        VALUES (?, ?, ?, ?, ?)
    `);
    initialOrderItems.forEach(oi => itemStmt.run(...oi));

    // 6. Initial Payments
    const initialPayments = [
        [1, 986, 'UPI', 520, 'Completed', 'UPI98234120891'],
        [2, 987, 'CARD', 380, 'Completed', 'TXN48920192831'],
        [3, 988, 'COD', 670, 'Completed', 'COD988'],
        [4, 989, 'UPI', 450, 'Completed', 'UPI89123049123'],
        [5, 990, 'CARD', 590, 'Completed', 'TXN77281923011'],
        [6, 991, 'UPI', 550, 'Completed', 'UPI19283019283'],
        [7, 992, 'COD', 720, 'Completed', 'COD992'],
        [8, 993, 'UPI', 320, 'Completed', 'UPI77182930192'],
        [9, 994, 'CARD', 480, 'Completed', 'TXN38291029384'],
        [10, 995, 'UPI', 630, 'Completed', 'UPI47291029384'],
        [11, 996, 'COD', 810, 'Completed', 'COD996'],
        [12, 997, 'UPI', 490, 'Completed', 'UPI99281029384'],
        [13, 998, 'UPI', 600, 'Completed', 'UPI88291029384'],
        [14, 999, 'CARD', 410, 'Completed', 'TXN66291029384'],
        [15, 1000, 'COD', 350, 'Pending', 'COD1000']
    ];
    const payStmt = db.prepare(`
        INSERT INTO payments (payment_id, order_id, mode, amount, payment_status, transaction_id)
        VALUES (?, ?, ?, ?, ?, ?)
    `);
    initialPayments.forEach(p => payStmt.run(...p));

    // 7. Initial Customer Feedback
    const initialFeedback = [
        [1, 986, 5, 5, 'The Dal Makhani was creamy and authentic. Warm delivery and prompt service!', '2026-10-21 14:10:00'],
        [2, 987, 6, 5, 'The Paneer Pizza crust was fresh and toppings were generous. Loved the lava cake too.', '2026-10-22 14:45:00'],
        [3, 988, 7, 4, 'Biryani fragrance was remarkable. Packaging kept it hot throughout transit.', '2026-10-22 20:20:00'],
        [4, 991, 4, 5, 'Exceptional taste! 2x Paneer Pizzas were golden crispy and cold drink was chilled.', '2026-10-24 14:05:00']
    ];
    const fbStmt = db.prepare(`
        INSERT INTO feedback (feedback_id, order_id, user_id, rating, comment, date)
        VALUES (?, ?, ?, ?, ?, ?)
    `);
    initialFeedback.forEach(f => fbStmt.run(...f));

    console.log('Database initialized and seeded successfully.');
}

// Initialize on module load
initSchema();
seedInitialData();

module.exports = DB;
