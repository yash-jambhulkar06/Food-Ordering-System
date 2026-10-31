/**
 * SpiceRoute Online Food Ordering System
 * Core Client-Side Storage & Business Service Layer
 */

const Store = (() => {
    const STORAGE_KEYS = {
        INITIALIZED: 'spiceroute_initialized',
        USERS: 'spiceroute_users',
        FOOD_ITEMS: 'spiceroute_food_items',
        CATEGORIES: 'spiceroute_categories',
        ORDERS: 'spiceroute_orders',
        ORDER_ITEMS: 'spiceroute_order_items',
        PAYMENTS: 'spiceroute_payments',
        FEEDBACK: 'spiceroute_feedback',
        CURRENT_USER: 'spiceroute_current_user',
        CART: 'spiceroute_cart'
    };

    /**
     * Silent Initial Data Provisioning
     * Runs once on first launch to populate catalog, staff, customer records, and orders
     */
    function initializeStorage() {
        if (localStorage.getItem(STORAGE_KEYS.INITIALIZED)) {
            return;
        }

        // 1. Initial Categories
        const initialCategories = [
            'Starters',
            'Main Course',
            'Pizza and Burgers',
            'Beverages',
            'Desserts'
        ];

        // 2. Initial Users
        const initialUsers = [
            {
                user_id: 1,
                name: 'Rajesh Malhotra',
                email: 'admin@spiceroute.in',
                password: 'Admin@123',
                phone: '9820154321',
                address: 'SpiceRoute Central Kitchen, Bandra West, Mumbai',
                role: 'admin'
            },
            {
                user_id: 2,
                name: 'Suresh Patil',
                email: 'delivery1@spiceroute.in',
                password: 'Delivery@123',
                phone: '9876543211',
                address: 'Delivery Hub North, Andheri East, Mumbai',
                role: 'delivery'
            },
            {
                user_id: 3,
                name: 'Amit Kumar',
                email: 'delivery2@spiceroute.in',
                password: 'Delivery@123',
                phone: '9876543222',
                address: 'Delivery Hub South, Dadar, Mumbai',
                role: 'delivery'
            },
            {
                user_id: 4,
                name: 'Pooja Verma',
                email: 'customer@spiceroute.in',
                password: 'Customer@123',
                phone: '9819234567',
                address: 'Flat 402, Sea Green Apartments, Worli, Mumbai',
                role: 'customer'
            },
            {
                user_id: 5,
                name: 'Rohit Sharma',
                email: 'rohit.sharma@gmail.com',
                password: 'Customer@123',
                phone: '9820011223',
                address: '12, Silver Oaks, Linking Road, Santacruz West, Mumbai',
                role: 'customer'
            },
            {
                user_id: 6,
                name: 'Ananya Sen',
                email: 'ananya.sen@gmail.com',
                password: 'Customer@123',
                phone: '9833445566',
                address: '704, Skyline Towers, Powai, Mumbai',
                role: 'customer'
            },
            {
                user_id: 7,
                name: 'Vikram Mehta',
                email: 'vikram.mehta@yahoo.com',
                password: 'Customer@123',
                phone: '9845012345',
                address: 'B-21, Palm Meadows, Juhu, Mumbai',
                role: 'customer'
            },
            {
                user_id: 8,
                name: 'Sneha Nair',
                email: 'sneha.nair@outlook.com',
                password: 'Customer@123',
                phone: '9898765432',
                address: 'Flat 101, Shanti Niketan, Vile Parle East, Mumbai',
                role: 'customer'
            },
            {
                user_id: 9,
                name: 'Kunal Kapoor',
                email: 'kunal.kapoor@gmail.com',
                password: 'Customer@123',
                phone: '9870123456',
                address: 'Flat 12B, Ocean Crest, Marine Drive, Mumbai',
                role: 'customer'
            }
        ];

        // 3. Initial 25 Menu Items (with Paneer Pizza Rs. 250 and Cold Drink Rs. 50)
        const initialFoodItems = [
            // Starters (5)
            {
                item_id: 1,
                name: 'Amritsari Paneer Tikka',
                category: 'Starters',
                price: 220,
                description: 'Cubes of cottage cheese marinated in spiced yogurt and chargrilled to perfection in the clay oven.',
                image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80',
                availability: 1
            },
            {
                item_id: 2,
                name: 'Crispy Golden Corn',
                category: 'Starters',
                price: 180,
                description: 'Sweet corn kernels tossed with freshly ground pepper, spring onions, and zesty lemon herbs.',
                image: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&w=600&q=80',
                availability: 1
            },
            {
                item_id: 3,
                name: 'Hara Bhara Kabab',
                category: 'Starters',
                price: 190,
                description: 'Delicate patties of minced spinach, green peas, and potatoes infused with fresh mint and aromatic spices.',
                image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
                availability: 1
            },
            {
                item_id: 4,
                name: 'Veg Manchurian Dry',
                category: 'Starters',
                price: 210,
                description: 'Crisp vegetable dumplings glazed in spicy ginger, garlic, and dark soy reduction.',
                image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=600&q=80',
                availability: 1
            },
            {
                item_id: 5,
                name: 'Herb Butter Garlic Bread',
                category: 'Starters',
                price: 160,
                description: 'Oven-toasted French baguette slices drenched in roasted garlic butter and topped with mozzarella.',
                image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?auto=format&fit=crop&w=600&q=80',
                availability: 1
            },

            // Main Course (5)
            {
                item_id: 6,
                name: 'Dal Makhani Bukhara',
                category: 'Main Course',
                price: 240,
                description: 'Whole black lentils slow-simmered overnight over charcoal embers, finished with churned butter and fresh cream.',
                image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
                availability: 1
            },
            {
                item_id: 7,
                name: 'Paneer Butter Masala',
                category: 'Main Course',
                price: 280,
                description: 'Succulent malai paneer simmered in a velvet-smooth cashew and vine-ripened tomato gravy.',
                image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80',
                availability: 1
            },
            {
                item_id: 8,
                name: 'Kadhai Soya Chaap',
                category: 'Main Course',
                price: 260,
                description: 'Tender soya fillets cooked with bell peppers, crushed coriander seeds, and Kashmiri dry chili.',
                image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&q=80',
                availability: 1
            },
            {
                item_id: 9,
                name: 'Hyderabadi Veg Dum Biryani',
                category: 'Main Course',
                price: 270,
                description: 'Long-grain basmati rice layered with garden vegetables and saffron, cooked on steam dum. Served with burani raita.',
                image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
                availability: 1
            },
            {
                item_id: 10,
                name: 'Shahi Malai Kofta',
                category: 'Main Course',
                price: 290,
                description: 'Cottage cheese and dry-fruit stuffed croquettes floated in an aromatic saffron and white onion gravy.',
                image: 'https://images.unsplash.com/photo-1505253758473-96b3d5ebcd94?auto=format&fit=crop&w=600&q=80',
                availability: 1
            },

            // Pizza and Burgers (6)
            {
                item_id: 11,
                name: 'Paneer Pizza',
                category: 'Pizza and Burgers',
                price: 250,
                description: 'Fresh cottage cheese cubes, diced bell peppers, onion, and herbs topped with 100% mozzarella cheese on hand-stretched dough.',
                image: 'assets/images/paneer-pizza.jpg',
                availability: 1
            },
            {
                item_id: 12,
                name: 'Farmhouse Veggie Pizza',
                category: 'Pizza and Burgers',
                price: 280,
                description: 'Crisp capsicum, sweet golden corn, ripe sliced tomatoes, and button mushrooms over herb tomato sauce.',
                image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
                availability: 1
            },
            {
                item_id: 13,
                name: 'Classic Margherita Pizza',
                category: 'Pizza and Burgers',
                price: 210,
                description: 'Neapolitan sourdough crust with San Marzano tomato sauce, fresh basil, and whole milk mozzarella.',
                image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=600&q=80',
                availability: 1
            },
            {
                item_id: 14,
                name: 'Crispy Paneer Burger',
                category: 'Pizza and Burgers',
                price: 150,
                description: 'Golden spiced paneer patty with spicy schezwan sauce, fresh iceberg lettuce, and toasted sesame buns.',
                image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
                availability: 1
            },
            {
                item_id: 15,
                name: 'Veggie Supreme Burger',
                category: 'Pizza and Burgers',
                price: 120,
                description: 'Golden potato and mixed veggie patty layered with crunchy red onions, sliced tomatoes, and house aioli.',
                image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80',
                availability: 1
            },
            {
                item_id: 16,
                name: 'Double Cheese Burst Burger',
                category: 'Pizza and Burgers',
                price: 180,
                description: 'Molten cheddar stuffed patty, spicy pickled jalapenos, caramelized onions, and smoky barbecue dip.',
                image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80',
                availability: 1
            },

            // Beverages (5)
            {
                item_id: 17,
                name: 'Cold Drink',
                category: 'Beverages',
                price: 50,
                description: 'Chilled fizzy soft drink served ice cold in a glass with lemon wedge.',
                image: 'assets/images/cold-drink.jpg',
                availability: 1
            },
            {
                item_id: 18,
                name: 'Fresh Mint Lime Soda',
                category: 'Beverages',
                price: 60,
                description: 'Freshly squeezed lime juice blended with garden mint leaves, club soda, and black salt.',
                image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
                availability: 1
            },
            {
                item_id: 19,
                name: 'Alphonso Mango Shake',
                category: 'Beverages',
                price: 90,
                description: 'Thick and luscious Ratnagiri alphonso pulp blended with full-cream milk and saffron strands.',
                image: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=600&q=80',
                availability: 1
            },
            {
                item_id: 20,
                name: 'Spiced Masala Chaas',
                category: 'Beverages',
                price: 40,
                description: 'Refreshing traditional churned buttermilk tempered with roasted cumin, green chilies, and coriander.',
                image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=600&q=80',
                availability: 1
            },
            {
                item_id: 21,
                name: 'Cold Coffee with Ice Cream',
                category: 'Beverages',
                price: 110,
                description: 'Chilled Arabica brew churned with milk and dark chocolate sauce, topped with vanilla bean ice cream.',
                image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80',
                availability: 1
            },

            // Desserts (4)
            {
                item_id: 22,
                name: 'Warm Chocolate Lava Cake',
                category: 'Desserts',
                price: 110,
                description: 'Decadent dark chocolate sponge cake with a warm center that cascades molten chocolate upon cutting.',
                image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80',
                availability: 1
            },
            {
                item_id: 23,
                name: 'Royal Gulab Jamun (2 Pcs)',
                category: 'Desserts',
                price: 70,
                description: 'Soft melt-in-the-mouth khoya spheres steeped in rose and green cardamom flavored syrup.',
                image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
                availability: 1
            },
            {
                item_id: 24,
                name: 'Sizzling Brownie with Vanilla',
                category: 'Desserts',
                price: 140,
                description: 'Fudge walnut brownie served on a cast-iron skillet with rich hot fudge and chilled vanilla ice cream.',
                image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=600&q=80',
                availability: 1
            },
            {
                item_id: 25,
                name: 'Kesar Pista Matka Kulfi',
                category: 'Desserts',
                price: 80,
                description: 'Traditional slow-reduced dense milk ice cream infused with Kashmiri saffron and Iranian pistachios.',
                image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=600&q=80',
                availability: 1
            }
        ];

        // 4. Past 15 Orders (IDs 986 to 1000)
        // This ensures the next order placed by customer is order ID 1001!
        const initialOrders = [
            {
                order_id: 986,
                user_id: 5,
                order_date: '2026-10-21 13:15:00',
                total_amount: 520,
                status: 'Delivered',
                delivery_address: '12, Silver Oaks, Linking Road, Santacruz West, Mumbai',
                pincode: '400054',
                delivery_boy_id: 2
            },
            {
                order_id: 987,
                user_id: 6,
                order_date: '2026-10-22 14:00:00',
                total_amount: 380,
                status: 'Delivered',
                delivery_address: '704, Skyline Towers, Powai, Mumbai',
                pincode: '400076',
                delivery_boy_id: 3
            },
            {
                order_id: 988,
                user_id: 7,
                order_date: '2026-10-22 19:30:00',
                total_amount: 670,
                status: 'Delivered',
                delivery_address: 'B-21, Palm Meadows, Juhu, Mumbai',
                pincode: '400049',
                delivery_boy_id: 2
            },
            {
                order_id: 989,
                user_id: 8,
                order_date: '2026-10-23 12:45:00',
                total_amount: 450,
                status: 'Delivered',
                delivery_address: 'Flat 101, Shanti Niketan, Vile Parle East, Mumbai',
                pincode: '400057',
                delivery_boy_id: 3
            },
            {
                order_id: 990,
                user_id: 9,
                order_date: '2026-10-23 20:10:00',
                total_amount: 590,
                status: 'Delivered',
                delivery_address: 'Flat 12B, Ocean Crest, Marine Drive, Mumbai',
                pincode: '400020',
                delivery_boy_id: 2
            },
            {
                order_id: 991,
                user_id: 4,
                order_date: '2026-10-24 13:20:00',
                total_amount: 550,
                status: 'Delivered',
                delivery_address: 'Flat 402, Sea Green Apartments, Worli, Mumbai',
                pincode: '400018',
                delivery_boy_id: 3
            },
            {
                order_id: 992,
                user_id: 5,
                order_date: '2026-10-24 19:05:00',
                total_amount: 720,
                status: 'Delivered',
                delivery_address: '12, Silver Oaks, Linking Road, Santacruz West, Mumbai',
                pincode: '400054',
                delivery_boy_id: 2
            },
            {
                order_id: 993,
                user_id: 6,
                order_date: '2026-10-25 11:30:00',
                total_amount: 320,
                status: 'Delivered',
                delivery_address: '704, Skyline Towers, Powai, Mumbai',
                pincode: '400076',
                delivery_boy_id: 3
            },
            {
                order_id: 994,
                user_id: 7,
                order_date: '2026-10-25 18:45:00',
                total_amount: 480,
                status: 'Delivered',
                delivery_address: 'B-21, Palm Meadows, Juhu, Mumbai',
                pincode: '400049',
                delivery_boy_id: 2
            },
            {
                order_id: 995,
                user_id: 8,
                order_date: '2026-10-26 12:15:00',
                total_amount: 630,
                status: 'Delivered',
                delivery_address: 'Flat 101, Shanti Niketan, Vile Parle East, Mumbai',
                pincode: '400057',
                delivery_boy_id: 3
            },
            {
                order_id: 996,
                user_id: 9,
                order_date: '2026-10-26 21:00:00',
                total_amount: 810,
                status: 'Delivered',
                delivery_address: 'Flat 12B, Ocean Crest, Marine Drive, Mumbai',
                pincode: '400020',
                delivery_boy_id: 2
            },
            {
                order_id: 997,
                user_id: 5,
                order_date: '2026-10-27 11:15:00',
                total_amount: 490,
                status: 'Delivered',
                delivery_address: '12, Silver Oaks, Linking Road, Santacruz West, Mumbai',
                pincode: '400054',
                delivery_boy_id: 2
            },
            {
                order_id: 998,
                user_id: 6,
                order_date: '2026-10-27 12:50:00',
                total_amount: 600,
                status: 'Out for Delivery',
                delivery_address: '704, Skyline Towers, Powai, Mumbai',
                pincode: '400076',
                delivery_boy_id: 3
            },
            {
                order_id: 999,
                user_id: 7,
                order_date: '2026-10-27 13:40:00',
                total_amount: 410,
                status: 'Preparing',
                delivery_address: 'B-21, Palm Meadows, Juhu, Mumbai',
                pincode: '400049',
                delivery_boy_id: 2
            },
            {
                order_id: 1000,
                user_id: 8,
                order_date: '2026-10-27 14:10:00',
                total_amount: 350,
                status: 'Placed',
                delivery_address: 'Flat 101, Shanti Niketan, Vile Parle East, Mumbai',
                pincode: '400057',
                delivery_boy_id: null
            }
        ];

        // 5. Order Items for Past Orders
        const initialOrderItems = [
            { order_item_id: 1, order_id: 986, item_id: 7, quantity: 1, price: 280 },
            { order_item_id: 2, order_id: 986, item_id: 6, quantity: 1, price: 240 },
            { order_item_id: 3, order_id: 987, item_id: 11, quantity: 1, price: 250 },
            { order_item_id: 4, order_id: 987, item_id: 22, quantity: 1, price: 110 },
            { order_item_id: 5, order_id: 987, item_id: 17, quantity: 1, price: 50 },
            { order_item_id: 6, order_id: 988, item_id: 9, quantity: 2, price: 270 },
            { order_item_id: 7, order_id: 988, item_id: 24, quantity: 1, price: 140 },
            { order_item_id: 8, order_id: 991, item_id: 11, quantity: 2, price: 250 },
            { order_item_id: 9, order_id: 991, item_id: 17, quantity: 1, price: 50 },
            { order_item_id: 10, order_id: 998, item_id: 12, quantity: 2, price: 280 },
            { order_item_id: 11, order_id: 998, item_id: 20, quantity: 1, price: 40 },
            { order_item_id: 12, order_id: 999, item_id: 16, quantity: 2, price: 180 },
            { order_item_id: 13, order_id: 999, item_id: 17, quantity: 1, price: 50 },
            { order_item_id: 14, order_id: 1000, item_id: 1, quantity: 1, price: 220 },
            { order_item_id: 15, order_id: 1000, item_id: 24, quantity: 1, price: 140 }
        ];

        // 6. Payments for Past Orders
        const initialPayments = [
            { payment_id: 1, order_id: 986, mode: 'UPI', amount: 520, payment_status: 'Completed', transaction_id: 'UPI98234120891' },
            { payment_id: 2, order_id: 987, mode: 'CARD', amount: 380, payment_status: 'Completed', transaction_id: 'TXN48920192831' },
            { payment_id: 3, order_id: 988, mode: 'COD', amount: 670, payment_status: 'Completed', transaction_id: 'COD988' },
            { payment_id: 4, order_id: 989, mode: 'UPI', amount: 450, payment_status: 'Completed', transaction_id: 'UPI89123049123' },
            { payment_id: 5, order_id: 990, mode: 'CARD', amount: 590, payment_status: 'Completed', transaction_id: 'TXN77281923011' },
            { payment_id: 6, order_id: 991, mode: 'UPI', amount: 550, payment_status: 'Completed', transaction_id: 'UPI19283019283' },
            { payment_id: 7, order_id: 992, mode: 'COD', amount: 720, payment_status: 'Completed', transaction_id: 'COD992' },
            { payment_id: 8, order_id: 993, mode: 'UPI', amount: 320, payment_status: 'Completed', transaction_id: 'UPI77182930192' },
            { payment_id: 9, order_id: 994, mode: 'CARD', amount: 480, payment_status: 'Completed', transaction_id: 'TXN38291029384' },
            { payment_id: 10, order_id: 995, mode: 'UPI', amount: 630, payment_status: 'Completed', transaction_id: 'UPI47291029384' },
            { payment_id: 11, order_id: 996, mode: 'COD', amount: 810, payment_status: 'Completed', transaction_id: 'COD996' },
            { payment_id: 12, order_id: 997, mode: 'UPI', amount: 490, payment_status: 'Completed', transaction_id: 'UPI99281029384' },
            { payment_id: 13, order_id: 998, mode: 'UPI', amount: 600, payment_status: 'Completed', transaction_id: 'UPI88291029384' },
            { payment_id: 14, order_id: 999, mode: 'CARD', amount: 410, payment_status: 'Completed', transaction_id: 'TXN66291029384' },
            { payment_id: 15, order_id: 1000, mode: 'COD', amount: 350, payment_status: 'Pending', transaction_id: 'COD1000' }
        ];

        // 7. Initial Customer Feedback
        const initialFeedback = [
            {
                feedback_id: 1,
                order_id: 986,
                user_id: 5,
                rating: 5,
                comment: 'The Dal Makhani was creamy and authentic. Warm delivery and prompt service!',
                date: '2026-10-21 14:10:00'
            },
            {
                feedback_id: 2,
                order_id: 987,
                user_id: 6,
                rating: 5,
                comment: 'The Paneer Pizza crust was fresh and toppings were generous. Loved the lava cake too.',
                date: '2026-10-22 14:45:00'
            },
            {
                feedback_id: 3,
                order_id: 988,
                user_id: 7,
                rating: 4,
                comment: 'Biryani fragrance was remarkable. Packaging kept it hot throughout transit.',
                date: '2026-10-22 20:20:00'
            },
            {
                feedback_id: 4,
                order_id: 991,
                user_id: 4,
                rating: 5,
                comment: 'Exceptional taste! 2x Paneer Pizzas were golden crispy and cold drink was chilled.',
                date: '2026-10-24 14:05:00'
            }
        ];

        // Save to browser storage
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initialUsers));
        localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(initialCategories));
        localStorage.setItem(STORAGE_KEYS.FOOD_ITEMS, JSON.stringify(initialFoodItems));
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(initialOrders));
        localStorage.setItem(STORAGE_KEYS.ORDER_ITEMS, JSON.stringify(initialOrderItems));
        localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(initialPayments));
        localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(initialFeedback));
        localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify([]));
        localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    }

    // Auto-invoke storage setup
    initializeStorage();

    // Data Access Helpers
    const API_BASE = (window.location.protocol === 'file:') ? 'http://localhost:3000/api' : '/api';

    function getStoredData(key) {
        try {
            return JSON.parse(localStorage.getItem(key)) || [];
        } catch (e) {
            return [];
        }
    }

    function setStoredData(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    // Backend REST API Bridge Helper
    async function apiCall(endpoint, method = 'GET', data = null) {
        try {
            const options = {
                method,
                headers: { 'Content-Type': 'application/json' }
            };
            if (data && (method === 'POST' || method === 'PUT')) {
                options.body = JSON.stringify(data);
            }
            const res = await fetch(`${API_BASE}${endpoint}`, options);
            if (!res.ok) return null;
            return await res.json();
        } catch (e) {
            return null;
        }
    }

    // Sync client localStorage with SQLite database
    async function syncFromBackend() {
        try {
            const health = await fetch(`${API_BASE}/health`).then(r => r.json()).catch(() => null);
            if (!health || health.status !== 'UP') return;

            // Fetch menu from SQLite
            const menuData = await fetch(`${API_BASE}/menu`).then(r => r.json()).catch(() => null);
            if (menuData && menuData.items) {
                setStoredData(STORAGE_KEYS.FOOD_ITEMS, menuData.items);
            }

            // Fetch categories from SQLite
            const catData = await fetch(`${API_BASE}/categories`).then(r => r.json()).catch(() => null);
            if (catData && catData.categories) {
                setStoredData(STORAGE_KEYS.CATEGORIES, catData.categories);
            }

            // Fetch orders from SQLite
            const ordersData = await fetch(`${API_BASE}/orders`).then(r => r.json()).catch(() => null);
            if (ordersData && ordersData.orders) {
                setStoredData(STORAGE_KEYS.ORDERS, ordersData.orders);

                // Extract all joined items and payments into local storage caches
                const allItems = [];
                const allPayments = [];
                ordersData.orders.forEach(o => {
                    if (o.items && Array.isArray(o.items)) {
                        o.items.forEach(it => {
                            allItems.push({
                                order_item_id: it.order_item_id || Math.random(),
                                order_id: o.order_id,
                                item_id: it.item_id,
                                quantity: it.quantity,
                                price: it.price
                            });
                        });
                    }
                    if (o.payment) {
                        allPayments.push({
                            payment_id: o.payment.payment_id || Math.random(),
                            order_id: o.order_id,
                            mode: o.payment.mode,
                            amount: o.payment.amount,
                            payment_status: o.payment.payment_status,
                            transaction_id: o.payment.transaction_id
                        });
                    }
                });
                if (allItems.length > 0) setStoredData(STORAGE_KEYS.ORDER_ITEMS, allItems);
                if (allPayments.length > 0) setStoredData(STORAGE_KEYS.PAYMENTS, allPayments);
            }

            // Fetch feedback from SQLite
            const fbData = await fetch(`${API_BASE}/feedback`).then(r => r.json()).catch(() => null);
            if (fbData && fbData.feedback) {
                setStoredData(STORAGE_KEYS.FEEDBACK, fbData.feedback);
            }

            // Fetch users from SQLite
            const usersData = await fetch(`${API_BASE}/users`).then(r => r.json()).catch(() => null);
            if (usersData && usersData.users) {
                const localUsers = getStoredData(STORAGE_KEYS.USERS);
                const merged = usersData.users.map(u => {
                    const match = localUsers.find(lu => lu.user_id === u.user_id || lu.email.toLowerCase() === u.email.toLowerCase());
                    return { ...u, password: match ? match.password : 'Customer@123' };
                });
                setStoredData(STORAGE_KEYS.USERS, merged);

                // Reconcile current logged in user session ID with real SQLite ID
                try {
                    const curUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || 'null');
                    if (curUser && curUser.email) {
                        const matched = usersData.users.find(u => u.email.toLowerCase() === curUser.email.toLowerCase());
                        if (matched && curUser.user_id !== matched.user_id) {
                            curUser.user_id = matched.user_id;
                            curUser.name = matched.name;
                            curUser.role = matched.role;
                            localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(curUser));
                        }
                    }
                } catch(e) {}
            }

            // Dispatch global synchronization notification
            window.dispatchEvent(new CustomEvent('storeSynced', { detail: { syncedAt: new Date().toISOString() } }));
        } catch (err) {
            // Graceful fallback to local cache
            console.warn('Backend sync warning:', err);
        }
    }

    // Run backend sync immediately on load
    syncFromBackend();

    return {
        // Expose backend synchronization method
        syncFromBackend,

        // ================= AUTHENTICATION =================
        login(email, password) {
            const users = getStoredData(STORAGE_KEYS.USERS);
            const cleanEmail = email.trim().toLowerCase();
            const cleanPass = password.trim();

            const matchedUser = users.find(u => u.email.toLowerCase() === cleanEmail && u.password === cleanPass);
            if (matchedUser) {
                const sessionUser = { ...matchedUser };
                delete sessionUser.password;
                localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(sessionUser));

                // Dispatch to backend API and update with real SQLite ID
                apiCall('/auth/login', 'POST', { email: cleanEmail, password: cleanPass }).then(res => {
                    if (res && res.user && res.user.user_id) {
                        sessionUser.user_id = res.user.user_id;
                        sessionUser.name = res.user.name;
                        sessionUser.role = res.user.role;
                        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(sessionUser));
                        window.dispatchEvent(new CustomEvent('storeSynced'));
                    }
                });

                return { success: true, user: sessionUser };
            }
            return { success: false, message: 'Invalid credentials' };
        },

        register(userData) {
            const users = getStoredData(STORAGE_KEYS.USERS);
            const cleanEmail = userData.email.trim().toLowerCase();

            if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
                return { success: false, message: 'An account with this email address already exists.' };
            }

            const newUser = {
                user_id: Date.now(),
                name: userData.name.trim(),
                email: cleanEmail,
                password: userData.password,
                phone: userData.phone.trim(),
                address: userData.address.trim(),
                role: 'customer'
            };

            users.push(newUser);
            setStoredData(STORAGE_KEYS.USERS, users);

            const sessionUser = { ...newUser };
            delete sessionUser.password;
            localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(sessionUser));

            // Persist to backend SQLite and adopt real generated user_id
            apiCall('/auth/register', 'POST', {
                name: userData.name,
                email: cleanEmail,
                password: userData.password,
                phone: userData.phone,
                address: userData.address
            }).then(res => {
                if (res && res.user && res.user.user_id) {
                    const realId = res.user.user_id;
                    newUser.user_id = realId;
                    sessionUser.user_id = realId;
                    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(sessionUser));
                    const curUsers = getStoredData(STORAGE_KEYS.USERS);
                    const idx = curUsers.findIndex(u => u.email.toLowerCase() === cleanEmail);
                    if (idx !== -1) {
                        curUsers[idx].user_id = realId;
                        setStoredData(STORAGE_KEYS.USERS, curUsers);
                    }
                    window.dispatchEvent(new CustomEvent('storeSynced'));
                }
            });

            return { success: true, user: sessionUser };
        },

        getCurrentUser() {
            try {
                return JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER));
            } catch (e) {
                return null;
            }
        },

        updateUserProfile(updatedData) {
            const currentUser = this.getCurrentUser();
            if (!currentUser) return { success: false, message: 'No active session found.' };

            const users = getStoredData(STORAGE_KEYS.USERS);
            const index = users.findIndex(u => u.user_id === currentUser.user_id);
            if (index !== -1) {
                users[index].name = updatedData.name.trim();
                users[index].phone = updatedData.phone.trim();
                users[index].address = updatedData.address.trim();

                setStoredData(STORAGE_KEYS.USERS, users);

                const sessionUser = { ...users[index] };
                delete sessionUser.password;
                localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(sessionUser));

                // Persist to backend SQLite
                apiCall(`/auth/profile/${currentUser.user_id}`, 'PUT', updatedData);

                return { success: true, user: sessionUser };
            }
            return { success: false, message: 'Account update failed.' };
        },

        logout() {
            localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
        },

        // ================= MENU & CATEGORIES =================
        getMenu() {
            return getStoredData(STORAGE_KEYS.FOOD_ITEMS);
        },

        getMenuItemById(id) {
            const items = this.getMenu();
            return items.find(item => item.item_id === Number(id));
        },

        saveMenuItem(itemData) {
            const items = this.getMenu();
            if (itemData.item_id) {
                // Update
                const index = items.findIndex(i => i.item_id === Number(itemData.item_id));
                if (index !== -1) {
                    items[index] = {
                        ...items[index],
                        name: itemData.name.trim(),
                        category: itemData.category,
                        price: parseFloat(itemData.price),
                        description: itemData.description.trim(),
                        image: itemData.image.trim() || 'assets/images/paneer-pizza.jpg',
                        availability: Number(itemData.availability)
                    };
                    setStoredData(STORAGE_KEYS.FOOD_ITEMS, items);

                    // Persist to SQLite
                    apiCall(`/menu/${itemData.item_id}`, 'PUT', items[index]);

                    return { success: true, item: items[index] };
                }
            } else {
                // Add new
                const nextId = items.length > 0 ? Math.max(...items.map(i => i.item_id)) + 1 : 1;
                const newItem = {
                    item_id: nextId,
                    name: itemData.name.trim(),
                    category: itemData.category,
                    price: parseFloat(itemData.price),
                    description: itemData.description.trim(),
                    image: itemData.image.trim() || 'assets/images/paneer-pizza.jpg',
                    availability: Number(itemData.availability)
                };
                items.push(newItem);
                setStoredData(STORAGE_KEYS.FOOD_ITEMS, items);

                // Persist to SQLite
                apiCall('/menu', 'POST', newItem);

                return { success: true, item: newItem };
            }
            return { success: false, message: 'Could not save dish details.' };
        },

        deleteMenuItem(id) {
            let items = this.getMenu();
            items = items.filter(i => i.item_id !== Number(id));
            setStoredData(STORAGE_KEYS.FOOD_ITEMS, items);

            // Persist to SQLite
            apiCall(`/menu/${id}`, 'DELETE');

            return { success: true };
        },

        getCategories() {
            return getStoredData(STORAGE_KEYS.CATEGORIES);
        },

        saveCategory(catName) {
            const categories = this.getCategories();
            const cleanName = catName.trim();
            if (!cleanName) return { success: false, message: 'Category title cannot be blank.' };
            if (categories.some(c => c.toLowerCase() === cleanName.toLowerCase())) {
                return { success: false, message: 'Category already exists.' };
            }
            categories.push(cleanName);
            setStoredData(STORAGE_KEYS.CATEGORIES, categories);

            // Persist to SQLite
            apiCall('/categories', 'POST', { name: cleanName });

            return { success: true };
        },

        deleteCategory(catName) {
            let categories = this.getCategories();
            categories = categories.filter(c => c !== catName);
            setStoredData(STORAGE_KEYS.CATEGORIES, categories);

            // Persist to SQLite
            apiCall(`/categories/${encodeURIComponent(catName)}`, 'DELETE');

            return { success: true };
        },

        // ================= CART OPERATIONS =================
        getCart() {
            return getStoredData(STORAGE_KEYS.CART);
        },

        addToCart(itemId, quantity = 1) {
            const cart = this.getCart();
            const item = this.getMenuItemById(itemId);
            if (!item) return { success: false, message: 'Item not found in menu.' };
            if (!item.availability) return { success: false, message: 'This item is currently sold out.' };

            const existingIndex = cart.findIndex(c => c.item_id === Number(itemId));
            if (existingIndex !== -1) {
                cart[existingIndex].quantity += quantity;
            } else {
                cart.push({
                    item_id: item.item_id,
                    name: item.name,
                    price: item.price,
                    image: item.image,
                    category: item.category,
                    quantity: quantity
                });
            }

            setStoredData(STORAGE_KEYS.CART, cart);
            return { success: true, cartCount: this.getCartCount(), cartSummary: this.getCartSummary() };
        },

        updateCartQuantity(itemId, quantity) {
            let cart = this.getCart();
            const numQty = parseInt(quantity, 10);
            const index = cart.findIndex(c => c.item_id === Number(itemId));

            if (index !== -1) {
                if (numQty <= 0) {
                    cart.splice(index, 1);
                } else {
                    cart[index].quantity = numQty;
                }
                setStoredData(STORAGE_KEYS.CART, cart);
            }
            return { success: true, cartCount: this.getCartCount(), cartSummary: this.getCartSummary() };
        },

        removeFromCart(itemId) {
            let cart = this.getCart();
            cart = cart.filter(c => c.item_id !== Number(itemId));
            setStoredData(STORAGE_KEYS.CART, cart);
            return { success: true, cartCount: this.getCartCount(), cartSummary: this.getCartSummary() };
        },

        clearCart() {
            setStoredData(STORAGE_KEYS.CART, []);
            return { success: true, cartCount: 0 };
        },

        getCartCount() {
            const cart = this.getCart();
            return cart.reduce((acc, item) => acc + item.quantity, 0);
        },

        getCartSummary() {
            const cart = this.getCart();
            const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
            // Delivery fee: Free for orders of Rs. 499 or more
            const deliveryFee = (subtotal >= 499 || subtotal === 0) ? 0 : 40;
            // 5% GST inclusive in prices
            const tax = Math.round(subtotal * 0.05);
            const grandTotal = subtotal + deliveryFee;

            return {
                subtotal: Math.round(subtotal),
                deliveryFee,
                tax,
                grandTotal: Math.round(grandTotal),
                itemCount: cart.length
            };
        },

        // ================= ORDERS =================
        getOrders(filter = {}) {
            let orders = getStoredData(STORAGE_KEYS.ORDERS);

            let myOrderIds = [];
            try {
                myOrderIds = JSON.parse(localStorage.getItem('spiceroute_my_order_ids') || '[]');
            } catch (e) {}

            if (filter.order_id) {
                return orders.filter(o => o.order_id === Number(filter.order_id));
            }

            if (filter.user_id) {
                const targetId = Number(filter.user_id);
                // Return orders matching user_id OR placed on this device
                orders = orders.filter(o => o.user_id === targetId || myOrderIds.includes(o.order_id));
            }

            if (filter.status && filter.status !== 'All') {
                orders = orders.filter(o => o.status === filter.status);
            }
            if (filter.delivery_boy_id) {
                orders = orders.filter(o => o.delivery_boy_id === Number(filter.delivery_boy_id));
            }

            // Sort newest first
            return orders.sort((a, b) => new Date(b.order_date) - new Date(a.order_date));
        },

        getOrderById(orderId) {
            const orders = getStoredData(STORAGE_KEYS.ORDERS);
            const order = orders.find(o => o.order_id === Number(orderId));
            if (!order) return null;

            // If order already has items populated from SQLite:
            if (order.items && Array.isArray(order.items) && order.items.length > 0) {
                return order;
            }

            const orderItems = getStoredData(STORAGE_KEYS.ORDER_ITEMS).filter(oi => oi.order_id === Number(orderId));
            const menu = this.getMenu();
            const fullItems = orderItems.map(oi => {
                const dish = menu.find(m => m.item_id === oi.item_id) || {};
                return {
                    ...oi,
                    name: oi.name || dish.name || 'Gourmet Dish',
                    image: oi.image || dish.image || 'assets/images/paneer-pizza.jpg'
                };
            });

            const payments = getStoredData(STORAGE_KEYS.PAYMENTS);
            const payment = order.payment || payments.find(p => p.order_id === Number(orderId)) || null;

            const users = getStoredData(STORAGE_KEYS.USERS);
            const customer = order.customer || users.find(u => u.user_id === order.user_id) || {};
            const deliveryStaff = order.deliveryStaff || (order.delivery_boy_id ? users.find(u => u.user_id === order.delivery_boy_id) : null);

            const feedbackList = getStoredData(STORAGE_KEYS.FEEDBACK);
            const feedback = order.feedback || feedbackList.find(f => f.order_id === Number(orderId)) || null;

            return {
                ...order,
                items: fullItems,
                payment,
                customer,
                deliveryStaff,
                feedback
            };
        },

        placeOrder(orderDetails) {
            const cart = this.getCart();
            if (cart.length === 0) {
                return { success: false, message: 'Cart is empty' };
            }

            const currentUser = this.getCurrentUser();
            const userId = currentUser ? currentUser.user_id : 4; // Pooja Verma default if not logged in

            const orders = getStoredData(STORAGE_KEYS.ORDERS);
            const orderItems = getStoredData(STORAGE_KEYS.ORDER_ITEMS);
            const payments = getStoredData(STORAGE_KEYS.PAYMENTS);

            // Compute next order ID (1001 if existing max is 1000)
            const maxOrderId = orders.length > 0 ? Math.max(...orders.map(o => o.order_id)) : 1000;
            const newOrderId = maxOrderId < 1000 ? 1001 : maxOrderId + 1;

            const summary = this.getCartSummary();
            const now = new Date();
            const formattedDate = now.getFullYear() + '-' +
                String(now.getMonth() + 1).padStart(2, '0') + '-' +
                String(now.getDate()).padStart(2, '0') + ' ' +
                String(now.getHours()).padStart(2, '0') + ':' +
                String(now.getMinutes()).padStart(2, '0') + ':' +
                String(now.getSeconds()).padStart(2, '0');

            const newOrder = {
                order_id: newOrderId,
                user_id: userId,
                order_date: formattedDate,
                total_amount: summary.grandTotal,
                status: 'Placed', // Initial incoming ticket for Hotel Kitchen to accept
                delivery_address: orderDetails.delivery_address.trim(),
                pincode: orderDetails.pincode.trim(),
                delivery_boy_id: null // Unassigned until packed & dispatched
            };

            orders.unshift(newOrder);
            setStoredData(STORAGE_KEYS.ORDERS, orders);

            // Record items
            let maxOrderItemId = orderItems.length > 0 ? Math.max(...orderItems.map(oi => oi.order_item_id)) : 0;
            cart.forEach(c => {
                maxOrderItemId += 1;
                orderItems.push({
                    order_item_id: maxOrderItemId,
                    order_id: newOrderId,
                    item_id: c.item_id,
                    quantity: c.quantity,
                    price: c.price
                });
            });
            setStoredData(STORAGE_KEYS.ORDER_ITEMS, orderItems);

            // Record payment
            const maxPaymentId = payments.length > 0 ? Math.max(...payments.map(p => p.payment_id)) : 0;
            const mode = orderDetails.payment_mode || 'UPI';
            const txnRef = mode === 'COD' ? `COD${newOrderId}` : (mode === 'UPI' ? `UPI${Date.now()}` : `TXN${Date.now()}`);

            payments.push({
                payment_id: maxPaymentId + 1,
                order_id: newOrderId,
                mode: mode,
                amount: summary.grandTotal,
                payment_status: mode === 'COD' ? 'Pending' : 'Completed',
                transaction_id: txnRef
            });
            setStoredData(STORAGE_KEYS.PAYMENTS, payments);

            // Clear active cart
            this.clearCart();

            // Track recent order in local list so it is ALWAYS visible to current client
            try {
                const myOrderIds = JSON.parse(localStorage.getItem('spiceroute_my_order_ids') || '[]');
                if (!myOrderIds.includes(newOrderId)) {
                    myOrderIds.unshift(newOrderId);
                    localStorage.setItem('spiceroute_my_order_ids', JSON.stringify(myOrderIds));
                }
            } catch (e) {}

            // Persist order asynchronously into backend SQLite database
            apiCall('/orders', 'POST', {
                user_id: userId,
                email: currentUser ? currentUser.email : '',
                delivery_address: orderDetails.delivery_address,
                city: orderDetails.city || '',
                pincode: orderDetails.pincode,
                payment_mode: mode,
                items: cart,
                total_amount: summary.grandTotal
            });

            return {
                success: true,
                order_id: newOrderId,
                status: 'Placed',
                total_amount: summary.grandTotal
            };
        },

        updateOrderStatus(orderId, newStatus, deliveryBoyId = null) {
            const orders = getStoredData(STORAGE_KEYS.ORDERS);
            const index = orders.findIndex(o => o.order_id === Number(orderId));
            if (index !== -1) {
                if (newStatus) {
                    orders[index].status = newStatus;
                }
                if (deliveryBoyId !== null) {
                    orders[index].delivery_boy_id = Number(deliveryBoyId);
                }
                setStoredData(STORAGE_KEYS.ORDERS, orders);

                // If marked delivered and payment was COD, complete payment status
                if (newStatus === 'Delivered') {
                    const payments = getStoredData(STORAGE_KEYS.PAYMENTS);
                    const pIndex = payments.findIndex(p => p.order_id === Number(orderId));
                    if (pIndex !== -1 && payments[pIndex].mode === 'COD') {
                        payments[pIndex].payment_status = 'Completed';
                        setStoredData(STORAGE_KEYS.PAYMENTS, payments);
                    }
                }

                // Persist to backend SQLite
                apiCall(`/orders/${orderId}/status`, 'PUT', {
                    status: newStatus || undefined,
                    delivery_boy_id: deliveryBoyId !== null ? deliveryBoyId : undefined
                });

                return { success: true, order: orders[index] };
            }
            return { success: false, message: 'Order not found.' };
        },

        assignDeliveryPerson(orderId, deliveryBoyId) {
            return this.updateOrderStatus(orderId, null, deliveryBoyId);
        },

        // ================= FEEDBACK =================
        getFeedback() {
            const feedbackList = getStoredData(STORAGE_KEYS.FEEDBACK);
            const users = getStoredData(STORAGE_KEYS.USERS);
            return feedbackList.map(f => {
                const user = users.find(u => u.user_id === f.user_id) || {};
                return {
                    ...f,
                    user_name: user.name || 'Verified Customer'
                };
            }).sort((a, b) => new Date(b.date) - new Date(a.date));
        },

        addFeedback(orderId, rating, comment) {
            const feedbackList = getStoredData(STORAGE_KEYS.FEEDBACK);
            const currentUser = this.getCurrentUser();
            const userId = currentUser ? currentUser.user_id : 4;

            const maxId = feedbackList.length > 0 ? Math.max(...feedbackList.map(f => f.feedback_id)) : 0;
            const now = new Date();
            const formattedDate = now.getFullYear() + '-' +
                String(now.getMonth() + 1).padStart(2, '0') + '-' +
                String(now.getDate()).padStart(2, '0') + ' ' +
                String(now.getHours()).padStart(2, '0') + ':' +
                String(now.getMinutes()).padStart(2, '0') + ':' +
                String(now.getSeconds()).padStart(2, '0');

            const newFeedback = {
                feedback_id: maxId + 1,
                order_id: Number(orderId),
                user_id: userId,
                rating: Number(rating),
                comment: comment.trim(),
                date: formattedDate
            };

            feedbackList.push(newFeedback);
            setStoredData(STORAGE_KEYS.FEEDBACK, feedbackList);

            // Persist to backend SQLite
            apiCall('/feedback', 'POST', {
                order_id: Number(orderId),
                user_id: userId,
                rating: Number(rating),
                comment: comment.trim()
            });

            return { success: true, feedback: newFeedback };
        },

        // ================= USERS & REPORTS =================
        getUsers(role = null) {
            const users = getStoredData(STORAGE_KEYS.USERS);
            if (role) {
                return users.filter(u => u.role === role);
            }
            return users;
        },

        getDeliveryStaff() {
            return this.getUsers('delivery');
        },

        getSalesReport(startDate = null, endDate = null) {
            let orders = getStoredData(STORAGE_KEYS.ORDERS);
            if (startDate) {
                orders = orders.filter(o => o.order_date >= startDate);
            }
            if (endDate) {
                orders = orders.filter(o => o.order_date <= endDate + ' 23:59:59');
            }

            const totalRevenue = orders.reduce((sum, o) => sum + o.total_amount, 0);
            const totalOrders = orders.length;
            const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;
            const pendingOrders = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length;

            return {
                orders,
                totalRevenue,
                totalOrders,
                deliveredOrders,
                pendingOrders
            };
        }
    };
})();
