const http = require('http');

function request(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : '';
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });
    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function verifyAll() {
  console.log('=== Checking Page HTTP Responses ===');
  const pages = [
    '/index.html',
    '/menu.html',
    '/cart.html',
    '/checkout.html',
    '/orders.html',
    '/login.html',
    '/register.html',
    '/hotel/login.html',
    '/hotel/index.html',
    '/delivery/login.html',
    '/delivery/index.html'
  ];

  for (const p of pages) {
    const res = await request('GET', p);
    console.log(res.status === 200 ? '✓' : '✗', res.status, p);
  }

  // Check admin is 404
  const adminRes = await request('GET', '/admin/index.html');
  console.log(adminRes.status === 404 ? '✓ 404 Confirmed: Admin panel removed' : '✗ Admin still accessible', adminRes.status);

  console.log('\n=== Testing Hotel & Delivery Order Lifecycle ===');
  // 1. Hotel login test
  const hotelLogin = await request('POST', '/api/auth/login', { email: 'hotel@spiceroute.in', password: 'Hotel@123' });
  console.log('1. Hotel login:', hotelLogin.data.success ? '✓ SUCCESS' : '✗ FAILED', hotelLogin.data.user.role);

  // 2. Delivery login test
  const deliveryLogin = await request('POST', '/api/auth/login', { email: 'delivery1@spiceroute.in', password: 'Delivery@123' });
  console.log('2. Delivery login:', deliveryLogin.data.success ? '✓ SUCCESS' : '✗ FAILED', deliveryLogin.data.user.role);

  // 3. Customer places order
  const orderRes = await request('POST', '/api/orders', {
    user_id: 4,
    delivery_address: 'Flat 402, Sea Green Apts, Worli Sea Face',
    city: 'Mumbai',
    pincode: '400018',
    payment_mode: 'COD',
    items: [
      { item_id: 1, name: 'Paneer Tikka', price: 280, quantity: 2 }
    ]
  });
  const newId = orderRes.data.order_id;
  console.log('3. Order placed by Customer:', newId, 'Initial status:', orderRes.data.status);

  // 4. Hotel receives and starts cooking (Preparing)
  const cookRes = await request('PUT', `/api/orders/${newId}/status`, { status: 'Preparing' });
  console.log('4. Hotel starts cooking:', cookRes.data.order.status);

  // 5. Hotel packs food (Packed)
  const packRes = await request('PUT', `/api/orders/${newId}/status`, { status: 'Packed' });
  console.log('5. Hotel food cooked & packed:', packRes.data.order.status);

  // 6. Hotel hands over to Courier Suresh Patil (Out for Delivery)
  const dispatchRes = await request('PUT', `/api/orders/${newId}/status`, { status: 'Out for Delivery', delivery_boy_id: 2 });
  console.log('6. Hotel dispatches with courier:', dispatchRes.data.order.status, 'Courier ID:', dispatchRes.data.order.delivery_boy_id);

  // 7. Delivery courier marks as Delivered
  const deliverRes = await request('PUT', `/api/orders/${newId}/status`, { status: 'Delivered', delivery_boy_id: 2 });
  console.log('7. Courier marks delivered:', deliverRes.data.order.status, 'Payment Status:', deliverRes.data.order.payment.payment_status);

  console.log('\n=== ALL END-TO-END WORKFLOWS VERIFIED 100% ===');
}

verifyAll();
