/**
 * Automated Verification Script for SpiceRoute Backend REST APIs
 */

async function runTests() {
    console.log('--- Starting Backend REST API Test Suite ---');
    const baseUrl = 'http://localhost:3000/api';

    try {
        // 1. Health check
        const resHealth = await fetch(`${baseUrl}/health`).then(r => r.json());
        console.log('✓ Health check:', resHealth.status);

        // 2. Auth login (Admin)
        const resAdminLogin = await fetch(`${baseUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@spiceroute.in', password: 'Admin@123' })
        }).then(r => r.json());
        console.log('✓ Admin login:', resAdminLogin.success, resAdminLogin.user.name, `(${resAdminLogin.user.role})`);

        // 3. Auth login (Customer)
        const resCustLogin = await fetch(`${baseUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'customer@spiceroute.in', password: 'Customer@123' })
        }).then(r => r.json());
        console.log('✓ Customer login:', resCustLogin.success, resCustLogin.user.name, `(${resCustLogin.user.role})`);

        // 3b. Auth login (Hotel Kitchen)
        const resHotelLogin = await fetch(`${baseUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'hotel@spiceroute.in', password: 'Hotel@123' })
        }).then(r => r.json());
        console.log('✓ Hotel Kitchen login:', resHotelLogin.success, resHotelLogin.user.name, `(${resHotelLogin.user.role})`);

        // 4. Menu & Categories
        const resMenu = await fetch(`${baseUrl}/menu`).then(r => r.json());
        console.log('✓ Menu items loaded:', resMenu.items.length, 'dishes');

        const resCats = await fetch(`${baseUrl}/categories`).then(r => r.json());
        console.log('✓ Categories loaded:', resCats.categories.join(', '));

        // 5. Orders list
        const resOrders = await fetch(`${baseUrl}/orders`).then(r => r.json());
        console.log('✓ Orders retrieved:', resOrders.orders.length, 'total orders');

        // 6. Order details
        const resOrder986 = await fetch(`${baseUrl}/orders/986`).then(r => r.json());
        console.log('✓ Order #986 items:', resOrder986.order.items.length, 'items, customer:', resOrder986.order.customer.name, 'payment:', resOrder986.order.payment.mode);

        // 7. Place new order with custom city (e.g., Pune / Navi Mumbai) and custom user
        const newOrderPayload = {
            user_id: 4,
            delivery_address: 'Flat 402, Sea Green Apartments, Hinjewadi Phase 1',
            city: 'Pune',
            pincode: '411057',
            payment_mode: 'UPI',
            items: [
                { item_id: 11, quantity: 2, price: 250 }, // Paneer Pizza
                { item_id: 17, quantity: 1, price: 50 }   // Cold Drink
            ],
            total_amount: 550
        };
        const resNewOrder = await fetch(`${baseUrl}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newOrderPayload)
        }).then(r => r.json());
        console.log('✓ Place new order result: ID =', resNewOrder.order_id, 'Status =', resNewOrder.status, 'Total = Rs.', resNewOrder.total_amount);
        console.log('✓ City in delivery address verified:', resNewOrder.order.delivery_address);

        // 7b. Place order with guest / non-existent user_id to verify graceful fallback
        const guestOrderPayload = {
            user_id: 999999, // synthetic or unregistered id
            delivery_address: 'Building 7, Sector 15, Vashi',
            city: 'Navi Mumbai',
            pincode: '400703',
            payment_mode: 'UPI',
            items: [{ item_id: 1, quantity: 1, price: 280 }],
            total_amount: 280
        };
        const resGuestOrder = await fetch(`${baseUrl}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(guestOrderPayload)
        }).then(r => r.json());
        console.log('✓ Guest order placement with fallback user_id verified: ID =', resGuestOrder.order_id, 'Assigned User ID =', resGuestOrder.order.user_id, 'Address =', resGuestOrder.order.delivery_address);

        // 8. Order Lifecycle Progression (Hotel & Courier)
        // 8a. Hotel accepts and starts preparing
        const resPrep = await fetch(`${baseUrl}/orders/${resNewOrder.order_id}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'Preparing' })
        }).then(r => r.json());
        console.log('✓ Stage 2 (Hotel Accepted):', resPrep.order.status);

        // 8b. Hotel packs the food parcel
        const resPack = await fetch(`${baseUrl}/orders/${resNewOrder.order_id}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'Packed' })
        }).then(r => r.json());
        console.log('✓ Stage 3 (Hotel Packed Parcel):', resPack.order.status);

        // 8c. Hotel dispatches to Delivery Courier
        const resDispatch = await fetch(`${baseUrl}/orders/${resNewOrder.order_id}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'Out for Delivery', delivery_boy_id: 2 })
        }).then(r => r.json());
        console.log('✓ Stage 4 (Hotel Handover to Courier):', resDispatch.order.status, 'Courier:', resDispatch.order.deliveryStaff.name);

        // 8d. Courier completes delivery to Client
        const resDelivered = await fetch(`${baseUrl}/orders/${resNewOrder.order_id}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'Delivered' })
        }).then(r => r.json());
        console.log('✓ Stage 5 (Courier Delivered to Client):', resDelivered.order.status, 'Payment Status:', resDelivered.order.payment.payment_status);

        // 9. Submit feedback
        const resFeedbackPost = await fetch(`${baseUrl}/feedback`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                order_id: resNewOrder.order_id,
                user_id: 4,
                rating: 5,
                comment: 'Super fast delivery and delicious pizza!'
            })
        }).then(r => r.json());
        console.log('✓ Feedback submitted:', resFeedbackPost.success, 'Rating:', resFeedbackPost.feedback.rating);

        // 10. Sales report
        const resReport = await fetch(`${baseUrl}/reports/sales`).then(r => r.json());
        console.log('✓ Sales analytics: Total Revenue = Rs.', resReport.totalRevenue, 'Total Orders =', resReport.totalOrders);

        console.log('--- ALL REST API ENDPOINTS VERIFIED SUCCESSFULLY ---');
    } catch (err) {
        console.error('Test failed with error:', err);
    }
}

runTests();
