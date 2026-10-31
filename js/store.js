/**
 * SpiceRoute Online Food Ordering System
 * Client-Side Data Store & API Service Layer
 * 
 * Simple, beginner-friendly implementation designed for easy college demonstration:
 * - Uses REST API fetch() to communicate with the SQLite backend.
 * - Stores Shopping Cart and Current User in localStorage.
 * - Dispatches 'cartUpdated' custom events for live UI badges.
 */

const Store = (() => {
    const API_BASE = '/api';

    const STORAGE_KEYS = {
        USER: 'spiceroute_user',
        CART: 'spiceroute_cart',
        MENU_CACHE: 'spiceroute_menu_cache',
        CATEGORIES_CACHE: 'spiceroute_categories_cache'
    };

    // Helper: Make API calls with JSON
    async function apiCall(endpoint, method = 'GET', body = null) {
        try {
            const options = {
                method,
                headers: { 'Content-Type': 'application/json' }
            };
            if (body && (method === 'POST' || method === 'PUT')) {
                options.body = JSON.stringify(body);
            }
            const res = await fetch(`${API_BASE}${endpoint}`, options);
            const data = await res.json();
            return data;
        } catch (err) {
            console.error(`API Error [${method} ${endpoint}]:`, err);
            return { success: false, message: 'Server communication error. Please check server.' };
        }
    }

    // Helper: LocalStorage helpers
    function getLocal(key, defaultValue) {
        try {
            const val = localStorage.getItem(key);
            return val ? JSON.parse(val) : defaultValue;
        } catch (e) {
            return defaultValue;
        }
    }

    function setLocal(key, val) {
        try {
            localStorage.setItem(key, JSON.stringify(val));
        } catch (e) {
            console.error('LocalStorage write error:', e);
        }
    }

    return {
        // ================= AUTHENTICATION =================
        getCurrentUser() {
            return getLocal(STORAGE_KEYS.USER, null);
        },

        setCurrentUser(user) {
            setLocal(STORAGE_KEYS.USER, user);
            window.dispatchEvent(new CustomEvent('authChanged', { detail: user }));
        },

        async login(email, password) {
            const res = await apiCall('/auth/login', 'POST', { email, password });
            if (res.success && res.user) {
                this.setCurrentUser(res.user);
            }
            return res;
        },

        async register(userData) {
            const res = await apiCall('/auth/register', 'POST', userData);
            if (res.success && res.user) {
                this.setCurrentUser(res.user);
            }
            return res;
        },

        logout() {
            localStorage.removeItem(STORAGE_KEYS.USER);
            window.dispatchEvent(new CustomEvent('authChanged', { detail: null }));
        },

        // ================= MENU & CATEGORIES =================
        async fetchMenu(category = null) {
            let endpoint = '/menu';
            if (category && category !== 'All') {
                endpoint += `?category=${encodeURIComponent(category)}`;
            }
            const res = await apiCall(endpoint, 'GET');
            if (res.success && res.items) {
                setLocal(STORAGE_KEYS.MENU_CACHE, res.items);
                return res.items;
            }
            return getLocal(STORAGE_KEYS.MENU_CACHE, []);
        },

        // Synchronous fallback from local cache if menu was already loaded
        getMenu(category = null) {
            const cached = getLocal(STORAGE_KEYS.MENU_CACHE, []);
            if (category && category !== 'All') {
                return cached.filter(it => it.category === category);
            }
            return cached;
        },

        async getMenuItem(id) {
            const res = await apiCall(`/menu/${id}`, 'GET');
            return res.success ? res.item : null;
        },

        async fetchCategories() {
            const res = await apiCall('/categories', 'GET');
            if (res.success && res.categories) {
                setLocal(STORAGE_KEYS.CATEGORIES_CACHE, res.categories);
                return res.categories;
            }
            return getLocal(STORAGE_KEYS.CATEGORIES_CACHE, ['Starters', 'Main Course', 'Pizza and Burgers', 'Beverages', 'Desserts']);
        },

        getCategories() {
            return getLocal(STORAGE_KEYS.CATEGORIES_CACHE, ['Starters', 'Main Course', 'Pizza and Burgers', 'Beverages', 'Desserts']);
        },

        async saveMenuItem(itemData) {
            if (itemData.item_id) {
                return await apiCall(`/menu/${itemData.item_id}`, 'PUT', itemData);
            } else {
                return await apiCall('/menu', 'POST', itemData);
            }
        },

        async deleteMenuItem(id) {
            return await apiCall(`/menu/${id}`, 'DELETE');
        },

        // ================= SHOPPING CART =================
        getCart() {
            return getLocal(STORAGE_KEYS.CART, []);
        },

        addToCart(dish, quantity = 1) {
            const cart = this.getCart();
            const itemId = Number(dish.item_id);
            const index = cart.findIndex(c => c.item_id === itemId);

            if (index > -1) {
                cart[index].quantity += Number(quantity);
            } else {
                cart.push({
                    item_id: itemId,
                    name: dish.name,
                    price: Number(dish.price),
                    image: dish.image || 'assets/images/paneer-pizza.jpg',
                    category: dish.category || 'Dish',
                    quantity: Number(quantity)
                });
            }

            setLocal(STORAGE_KEYS.CART, cart);
            window.dispatchEvent(new CustomEvent('cartUpdated'));
            return cart;
        },

        updateCartQuantity(itemId, quantity) {
            let cart = this.getCart();
            const id = Number(itemId);
            const qty = Number(quantity);

            if (qty <= 0) {
                cart = cart.filter(c => c.item_id !== id);
            } else {
                const item = cart.find(c => c.item_id === id);
                if (item) {
                    item.quantity = qty;
                }
            }

            setLocal(STORAGE_KEYS.CART, cart);
            window.dispatchEvent(new CustomEvent('cartUpdated'));
            return cart;
        },

        removeFromCart(itemId) {
            const cart = this.getCart().filter(c => c.item_id !== Number(itemId));
            setLocal(STORAGE_KEYS.CART, cart);
            window.dispatchEvent(new CustomEvent('cartUpdated'));
            return cart;
        },

        clearCart() {
            setLocal(STORAGE_KEYS.CART, []);
            window.dispatchEvent(new CustomEvent('cartUpdated'));
        },

        getCartSummary() {
            const cart = this.getCart();
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            // Free delivery if subtotal > Rs. 300, else Rs. 40
            const deliveryFee = (subtotal === 0 || subtotal >= 300) ? 0 : 40;
            // 5% Restaurant GST
            const tax = Math.round(subtotal * 0.05);
            const grandTotal = subtotal + deliveryFee + tax;

            return {
                totalItems,
                subtotal,
                deliveryFee,
                tax,
                grandTotal
            };
        },

        // ================= ORDERS MANAGEMENT =================
        async placeOrder(orderDetails) {
            const cart = this.getCart();
            if (cart.length === 0) {
                return { success: false, message: 'Cart is empty' };
            }

            const currentUser = this.getCurrentUser();
            const summary = this.getCartSummary();

            const payload = {
                user_id: currentUser ? currentUser.user_id : 4,
                email: currentUser ? currentUser.email : '',
                delivery_address: orderDetails.delivery_address,
                city: orderDetails.city || 'Mumbai',
                pincode: orderDetails.pincode || '400001',
                payment_mode: orderDetails.payment_mode || 'UPI',
                items: cart,
                total_amount: summary.grandTotal
            };

            const res = await apiCall('/orders', 'POST', payload);
            if (res.success) {
                this.clearCart();
            }
            return res;
        },

        async getOrders(filter = {}) {
            let query = [];
            if (filter.user_id) query.push(`user_id=${filter.user_id}`);
            if (filter.status && filter.status !== 'All') query.push(`status=${encodeURIComponent(filter.status)}`);
            if (filter.order_id) query.push(`order_id=${filter.order_id}`);
            if (filter.delivery_boy_id) query.push(`delivery_boy_id=${filter.delivery_boy_id}`);

            const qs = query.length > 0 ? `?${query.join('&')}` : '';
            const res = await apiCall(`/orders${qs}`, 'GET');
            return res.success ? res.orders : [];
        },

        async getOrderById(orderId) {
            const res = await apiCall(`/orders/${orderId}`, 'GET');
            return res.success ? res.order : null;
        },

        async updateOrderStatus(orderId, status, delivery_boy_id) {
            const payload = { status };
            if (delivery_boy_id !== undefined) {
                payload.delivery_boy_id = delivery_boy_id ? Number(delivery_boy_id) : null;
            }
            return await apiCall(`/orders/${orderId}/status`, 'PUT', payload);
        },

        async getDeliveryBoys() {
            const res = await apiCall('/users/delivery-staff', 'GET');
            return res.success ? res.staff : [];
        },

        // Synchronous initial cache helper
        async syncFromBackend() {
            await this.fetchMenu();
            await this.fetchCategories();
            window.dispatchEvent(new CustomEvent('storeSynced'));
        },

        // Basic admin dashboard statistics
        async getAdminStats() {
            const orders = await this.getOrders();
            const menu = await this.fetchMenu();

            const totalOrders = orders.length;
            const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);
            const pendingOrders = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length;
            const completedOrders = orders.filter(o => o.status === 'Delivered').length;
            const totalItems = menu.length;

            return {
                totalOrders,
                totalRevenue,
                pendingOrders,
                completedOrders,
                totalItems,
                recentOrders: orders.slice(0, 8)
            };
        }
    };
})();

// Auto-sync catalog when loaded
if (typeof window !== 'undefined') {
    Store.syncFromBackend();
}
