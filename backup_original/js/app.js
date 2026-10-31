/**
 * SpiceRoute Online Food Ordering System
 * Front-end Application UI Controller & Navigation Guard
 */

const App = (() => {
    // Determine path depth relative to root
    const isSubfolder = window.location.pathname.includes('/admin/') || window.location.pathname.includes('/delivery/');
    const basePath = isSubfolder ? '../' : './';

    /**
     * Role-based Route Protection
     */
    function enforceRouteGuards() {
        const path = window.location.pathname;
        const currentUser = Store.getCurrentUser();

        // Admin route guard
        if (path.includes('/admin/')) {
            if (!currentUser || currentUser.role !== 'admin') {
                window.location.replace('../login.html');
                return;
            }
        }

        // Delivery route guard
        if (path.includes('/delivery/')) {
            if (!currentUser || currentUser.role !== 'delivery') {
                window.location.replace('../login.html');
                return;
            }
        }

        // Prevent logged-in users from seeing login/register
        if (path.endsWith('login.html') || path.endsWith('register.html')) {
            if (currentUser) {
                if (currentUser.role === 'admin') {
                    window.location.replace('admin/index.html');
                } else if (currentUser.role === 'delivery') {
                    window.location.replace('delivery/index.html');
                } else {
                    window.location.replace('index.html');
                }
            }
        }
    }

    /**
     * Synchronize Navbar UI with Current User & Cart
     */
    function syncNavbar() {
        const currentUser = Store.getCurrentUser();
        const userSlot = document.getElementById('navUserSlot');
        const cartBadge = document.getElementById('navCartBadge');

        // Update Cart Count
        if (cartBadge) {
            const count = Store.getCartCount();
            cartBadge.textContent = count;
        }

        // Update Authentication Slot
        if (userSlot) {
            if (currentUser) {
                const firstName = currentUser.name.split(' ')[0];
                let portalLink = '';
                if (currentUser.role === 'admin') {
                    portalLink = `
                        <a href="${basePath}admin/index.html" class="nav-link" style="color:var(--primary); font-weight:700;">Admin Panel</a>
                        <a href="${basePath}hotel/index.html" class="nav-link" style="color:#d97706; font-weight:700;">🍳 Hotel Kitchen</a>
                    `;
                } else if (currentUser.role === 'hotel') {
                    portalLink = `<a href="${basePath}hotel/index.html" class="nav-link" style="color:#d97706; font-weight:700;">🍳 Hotel Kitchen</a>`;
                } else if (currentUser.role === 'delivery') {
                    portalLink = `<a href="${basePath}delivery/index.html" class="nav-link" style="color:var(--success); font-weight:700;">Delivery Hub</a>`;
                } else {
                    portalLink = `<a href="${basePath}orders.html" class="nav-link">My Orders</a>`;
                }

                userSlot.innerHTML = `
                    ${portalLink}
                    <a href="${basePath}profile.html" class="nav-link" style="font-weight:600;">Hi, ${firstName}</a>
                    <button onclick="App.handleLogout()" class="btn btn-outline btn-sm">Logout</button>
                `;
            } else {
                userSlot.innerHTML = `
                    <a href="${basePath}login.html" class="btn btn-primary btn-sm">Sign In</a>
                    <a href="${basePath}register.html" class="btn btn-outline btn-sm">Register</a>
                `;
            }
        }

        // Mobile Nav Toggle
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
     * Visual Toast Notifications
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
            bubble.style.transform = 'translateY(12px)';
            bubble.style.transition = 'all 0.3s ease';
            setTimeout(() => bubble.remove(), 300);
        }, 3400);
    }

    /**
     * Image Loading Fallback
     */
    function handleImageError(imgElement) {
        imgElement.onerror = null;
        imgElement.src = `${basePath}assets/images/paneer-pizza.jpg`;
    }

    /**
     * Cart Item Interaction
     */
    function handleAddToCart(itemId, dishName, price) {
        const result = Store.addToCart(itemId, 1);
        if (result.success) {
            syncNavbar();
            showToast(`Added ${dishName} (Rs. ${price}) to cart!`, 'success');
        } else {
            showToast(result.message || 'Item could not be added.', 'error');
        }
    }

    function handleLogout() {
        Store.logout();
        window.location.replace(`${basePath}login.html`);
    }

    // Initialize application on DOM ready
    document.addEventListener('DOMContentLoaded', () => {
        enforceRouteGuards();
        syncNavbar();
    });

    return {
        basePath,
        showToast,
        syncNavbar,
        handleImageError,
        handleAddToCart,
        handleLogout,

        formatCurrency(amount) {
            return 'Rs. ' + Number(amount).toLocaleString('en-IN');
        },

        // Modal Helpers
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
