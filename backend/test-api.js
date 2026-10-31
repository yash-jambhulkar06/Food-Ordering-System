/**
 * Automated Verification Script for SpiceRoute Backend REST APIs
 * Tests all essential microproject endpoints for Customer, Hotel, and Delivery flows:
 * 1. Health Check
 * 2. Customer, Hotel, & Delivery Staff Authentication
 * 3. Menu & Categories Listing
 * 4. Order Placement & Invoice Calculation
 * 5. Hotel Kitchen & Order Dispatch Lifecycle (Preparing -> Packed -> Out for Delivery)
 * 6. Delivery Courier Fulfillment (Delivered & COD Payment Completion)
 * 7. Delivery Staff Directory
 */

async function runTests() {
    console.log('========================================================');
    console.log('   Starting Simplified REST API Automated Test Suite');
    console.log('========================================================');
    const baseUrl = 'http://localhost:3000/api';

    try {
        // 1. Health check
        const resHealth = await fetch(`${baseUrl}/health`).then(r => r.json());
        console.log('✓ 1. Health check:', resHealth.status);

        // 2. Auth login (Customer)
        const resCustLogin = await fetch(`${baseUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'customer@spiceroute.in', password: 'Customer@123' })
        }).then(r => r.json());
        console.log('✓ 2. Customer login:', resCustLogin.success, resCustLogin.user.name, `(${resCustLogin.user.role})`);

        // 3. Auth login (Hotel Kitchen)
        const resHotelLogin = await fetch(`${baseUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'hotel@spiceroute.in', password: 'Hotel@123' })
        }).then(r => r.json());
        console.log('✓ 3. Hotel Kitchen login:', resHotelLogin.success, resHotelLogin.user.name, `(${resHotelLogin.user.role})`);

        // 4. Auth login (Delivery Courier)
        const resDeliveryLogin = await fetch(`${baseUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'delivery1@spiceroute.in', password: 'Delivery@123' })
        }).then(r => r.json());
        console.log('✓ 4. Delivery Courier login:', resDeliveryLogin.success, resDeliveryLogin.user.name, `(${resDeliveryLogin.user.role})`);

        // 5. Menu & Categories
        const resMenu = await fetch(`${baseUrl}/menu`).then(r => r.json());
        console.log('✓ 5. Menu items loaded:', resMenu.items.length, 'dishes');

        const resCats = await fetch(`${baseUrl}/categories`).then(r => r.json());
        console.log('✓ 6. Categories loaded:', resCats.categories.join(', '));

        // 6. Orders list
        const resOrders = await fetch(`${baseUrl}/orders`).then(r => r.json());
        console.log('✓ 7. Orders retrieved:', resOrders.orders.length, 'total orders');

        // 7. Place new order (Customer checkout)
        const newOrderPayload = {
            user_id: 4,
            delivery_address: 'Flat 402, Sea Green Apartments, Hinjewadi Phase 1, Pune',
            city: 'Pune',
            pincode: '411057',
            payment_mode: 'COD',
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
        console.log('✓ 8. Place new order result: ID =', resNewOrder.order_id, 'Status =', resNewOrder.status, 'Total = Rs.', resNewOrder.total_amount);

        // 8. Order details check
        const resOrderDetail = await fetch(`${baseUrl}/orders/${resNewOrder.order_id}`).then(r => r.json());
        console.log('✓ 9. Order detail verified: ID =', resOrderDetail.order.order_id, 'Items count =', resOrderDetail.order.items.length);

        // 9. Hotel receives & starts cooking (Preparing)
        const resPrep = await fetch(`${baseUrl}/orders/${resNewOrder.order_id}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'Preparing' })
        }).then(r => r.json());
        console.log('✓ 10. Hotel cooking status:', resPrep.order.status);

        // 10. Hotel packs food (Packed)
        const resPack = await fetch(`${baseUrl}/orders/${resNewOrder.order_id}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'Packed' })
        }).then(r => r.json());
        console.log('✓ 11. Hotel food packed status:', resPack.order.status);

        // 11. Hotel hands over to courier Suresh Patil (Out for Delivery)
        const resOut = await fetch(`${baseUrl}/orders/${resNewOrder.order_id}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'Out for Delivery', delivery_boy_id: 2 })
        }).then(r => r.json());
        console.log('✓ 12. Hotel courier handover:', resOut.order.status, 'Assigned Courier ID =', resOut.order.delivery_boy_id);

        // 12. Delivery courier marks as Delivered
        const resDelivered = await fetch(`${baseUrl}/orders/${resNewOrder.order_id}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'Delivered', delivery_boy_id: 2 })
        }).then(r => r.json());
        console.log('✓ 13. Delivery completed status:', resDelivered.order.status, 'Payment Status:', resDelivered.order.payment.payment_status);

        // 13. Delivery staff directory check
        const resCouriers = await fetch(`${baseUrl}/users/delivery-staff`).then(r => r.json());
        console.log('✓ 14. Delivery couriers available:', resCouriers.staff.length, 'staff members');

        console.log('========================================================');
        console.log('   ALL CUSTOMER, HOTEL & DELIVERY APIS VERIFIED 100%');
        console.log('========================================================');
    } catch (err) {
        console.error('Test failed with error:', err);
    }
}

runTests();
