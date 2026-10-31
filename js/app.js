/**
 * SpiceRoute Online Food Ordering System
 * Front-end Application UI Helper & Navigation Controller
 */

const App = (() => {
    const isSubfolder = window.location.pathname.includes('/hotel/') || window.location.pathname.includes('/delivery/');
    const basePath = isSubfolder ? '../' : './';

    /**
     * Enforce Route Protection for Hotel and Delivery Portals
     */
    function enforceRouteGuards() {
        const path = window.location.pathname;
        const currentUser = Store.getCurrentUser();

        // Hotel Dashboard Guard (except hotel login page)
        if (path.includes('/hotel/') && !path.includes('/hotel/login.html')) {
            if (!currentUser || (currentUser.role !== 'hotel' && currentUser.role !== 'admin')) {
                window.location.replace('login.html');
                return;
            }
        }

        // Delivery Dashboard Guard (except delivery login page)
        if (path.includes('/delivery/') && !path.includes('/delivery/login.html')) {
            if (!currentUser || currentUser.role !== 'delivery') {
                window.location.replace('login.html');
                return;
            }
        }
    }

    /**
     * Synchronize Navbar UI with Current User & Shopping Cart
     */
    function syncNavbar() {
        const currentUser = Store.getCurrentUser();
        const userSlot = document.getElementById('navUserSlot');
        const cartBadge = document.getElementById('navCartBadge');

        // Update Cart Badge Count
        if (cartBadge) {
            const summary = Store.getCartSummary();
            cartBadge.textContent = summary.totalItems;
            cartBadge.style.display = summary.totalItems > 0 ? 'inline-block' : 'none';
        }

        // Update Authentication Slot
        if (userSlot) {
            if (currentUser) {
                const firstName = (currentUser.name || 'User').split(' ')[0];
                let staffBadge = '';
                if (currentUser.role === 'hotel' || currentUser.role === 'admin') {
                    staffBadge = `<a href="${basePath}hotel/index.html" class="nav-link" style="color:#d97706; font-weight:700;">🏨 Hotel Kitchen</a>`;
                } else if (currentUser.role === 'delivery') {
                    staffBadge = `<a href="${basePath}delivery/index.html" class="nav-link" style="color:var(--success); font-weight:700;">🚴 Delivery Hub</a>`;
                }

                userSlot.innerHTML = `
                    ${staffBadge}
                    <span class="nav-link" style="font-weight:600; color:var(--text-main);">Hi, ${firstName}</span>
                    <button onclick="App.handleLogout()" class="btn btn-outline btn-sm">Logout</button>
                `;
            } else {
                userSlot.innerHTML = `
                    <a href="${basePath}login.html" class="btn btn-primary btn-sm">Sign In</a>
                    <a href="${basePath}register.html" class="btn btn-outline btn-sm">Register</a>
                `;
            }
        }

        // Mobile Nav Hamburger Toggle
        const mobileToggle = document.getElementById('mobileToggle');
        const navMenu = document.getElementById('navMenu');
        if (mobileToggle && navMenu) {
            mobileToggle.onclick = () => {
                navMenu.classList.toggle('active');
                mobileToggle.innerHTML = navMenu.classList.contains('active') ? '&#10005;' : '&#9776;';
            };
        }
    }

    /**
     * Toast Notifications
     */
    function showToast(message, type = 'success') {
        let shelf = document.getElementById('toastShelf');
        if (!shelf) {
            shelf = document.createElement('div');
            shelf.id = 'toastShelf';
            shelf.className = 'toast-shelf';
            document.body.appendChild(shelf);
        }

        const bubble = document.createElement('div');
        bubble.className = `toast-bubble ${type}`;
        const icon = type === 'success' ? '✓' : (type === 'error' ? '✕' : 'ℹ');
        bubble.innerHTML = `<span><strong>${icon}</strong> ${message}</span>`;
        shelf.appendChild(bubble);

        setTimeout(() => {
            bubble.style.opacity = '0';
            bubble.style.transform = 'translateY(10px)';
            bubble.style.transition = 'all 0.3s ease';
            setTimeout(() => bubble.remove(), 300);
        }, 3000);
    }

    /**
     * Logout Handler
     */
    function handleLogout() {
        const path = window.location.pathname;
        Store.logout();
        if (path.includes('/hotel/')) {
            window.location.replace('login.html');
        } else if (path.includes('/delivery/')) {
            window.location.replace('login.html');
        } else {
            window.location.replace(`${basePath}login.html`);
        }
    }

    /**
     * Fallback for broken image URLs
     */
    function handleImageError(imgElement) {
        imgElement.onerror = null;
        imgElement.src = `${basePath}assets/images/paneer-pizza.jpg`;
    }

    // Auto-initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        enforceRouteGuards();
        syncNavbar();
    });

    window.addEventListener('cartUpdated', syncNavbar);
    window.addEventListener('authChanged', syncNavbar);

    return {
        basePath,
        showToast,
        syncNavbar,
        handleLogout,
        handleImageError,

        handleAddToCart(itemId, name, price, image = '', category = '') {
            Store.addToCart({
                item_id: Number(itemId),
                name: name,
                price: Number(price),
                image: image || 'assets/images/paneer-pizza.jpg',
                category: category || 'Dish'
            }, 1);
            showToast(`Added ${name} (Rs. ${price}) to cart!`, 'success');
        },

        formatCurrency(amount) {
            return 'Rs. ' + Number(amount || 0).toLocaleString('en-IN');
        },

        openModal(modalId) {
            const modal = document.getElementById(modalId);
            if (modal) modal.classList.add('show');
        },

        closeModal(modalId) {
            const modal = document.getElementById(modalId);
            if (modal) modal.classList.remove('show');
        }
    };
})();
