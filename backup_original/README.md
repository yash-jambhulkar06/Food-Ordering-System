# 🍛 SpiceRoute – Online Food Ordering System
### College Microproject (Waterfall Model Implementation)

A full-stack, responsive Online Food Ordering web application built with **HTML5, CSS3, JavaScript** on the frontend, powered by a **Node.js + Express REST API** backend and a persistent **SQLite (`node:sqlite`)** relational database.

---

## 🚀 Quick Start (How to Run)

### 1. Prerequisites
- **Node.js** (v18 or higher; v22+ recommended for built-in SQLite support)
- Any modern web browser (Chrome, Edge, Firefox)

### 2. Start the Server
Open terminal in the project directory and run:
```bash
npm start
```
Or:
```bash
node backend/server.js
```

### 3. Open in Browser
Visit: **[http://localhost:3000](http://localhost:3000)**

---

## 🔑 Default Test Accounts

| Role | Email | Password | Access / Portal |
|---|---|---|---|
| **Hotel / Kitchen Chef** | `hotel@spiceroute.in` | `Hotel@123` | [Hotel Kitchen KDS](http://localhost:3000/hotel/index.html) |
| **Administrator** | `admin@spiceroute.in` | `Admin@123` | [Admin Dashboard](http://localhost:3000/admin/index.html) |
| **Delivery Boy 1** | `delivery1@spiceroute.in` | `Delivery@123` | [Delivery Hub](http://localhost:3000/delivery/index.html) |
| **Delivery Boy 2** | `delivery2@spiceroute.in` | `Delivery@123` | [Delivery Hub](http://localhost:3000/delivery/index.html) |
| **Customer** | `customer@spiceroute.in` | `Customer@123` | [Customer View](http://localhost:3000/menu.html) |

*(You can also click **Register** to create a new customer account anytime)*

### 🔄 End-to-End Hotel & Delivery Lifecycle:
1. **Customer Places Order:** Status starts at `Placed`.
2. **Hotel Receives & Accepts:** Hotel Kitchen gets audio chime alert, clicks *"Accept & Start Cooking"* (Status: `Preparing`).
3. **Hotel Packs Order:** Once food is ready, Hotel clicks *"Food Ready – Pack in Parcel"* (Status: `Packed`).
4. **Hotel Hands Over to Courier:** Hotel clicks *"Handover to Delivery Courier"* and assigns a delivery boy (Status: `Out for Delivery`).
5. **Courier Delivers to Customer:** Delivery boy marks *"Delivered to Client"*, completing the order and payment.
6. **Live Customer Tracking:** Customer watches each of the 5 stages update live in [My Orders](http://localhost:3000/orders.html) or order confirmation.


---

## 🏗️ Project Architecture (3-Tier)

```
[Presentation Tier - Frontend]
   HTML5, CSS3, Vanilla JS (index.html, menu.html, cart.html, checkout.html, admin/*)
                         │
                         ▼ HTTP / REST JSON
[Application Tier - Node.js Express Backend]
   backend/server.js (Router, Middleware, Static Server, API Endpoints)
   backend/routes/ (auth.js, menu.js, orders.js, feedback.js, users.js, reports.js)
                         │
                         ▼ SQL Queries
[Data Tier - SQLite Database]
   backend/db.js (Schema init & Auto-seeding)
   backend/data/spiceroute.sqlite (Relational database file)
```

---

## 📡 REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Backend status & system health check |
| `POST` | `/api/auth/login` | User login (verifies credentials & returns role) |
| `POST` | `/api/auth/register` | Customer account registration |
| `GET` | `/api/auth/profile/:id` | Get customer profile details |
| `PUT` | `/api/auth/profile/:id` | Update profile (name, phone, address) |
| `GET` | `/api/menu` | List all menu dishes (with category filter) |
| `GET` | `/api/menu/:id` | Get single dish by ID |
| `POST` | `/api/menu` | Add new dish to menu (Admin) |
| `PUT` | `/api/menu/:id` | Update dish details & availability (Admin) |
| `DELETE` | `/api/menu/:id` | Delete dish from menu (Admin) |
| `GET` | `/api/categories` | List all menu categories |
| `POST` | `/api/categories` | Create new category (Admin) |
| `DELETE` | `/api/categories/:name` | Remove category (Admin) |
| `GET` | `/api/orders` | List orders (filterable by user, status, delivery) |
| `GET` | `/api/orders/:id` | Full order invoice details with joined tables |
| `POST` | `/api/orders` | Place new order (calculates bill, creates payment) |
| `PUT` | `/api/orders/:id/status`| Update status / assign delivery personnel |
| `GET` | `/api/feedback` | List customer ratings & reviews |
| `POST` | `/api/feedback` | Submit feedback for an order |
| `GET` | `/api/users` | List registered users / delivery staff |
| `GET` | `/api/reports/sales` | Sales analytics with date range filter & revenue |

---

## 🧪 Automated Testing
Run the comprehensive backend verification script:
```bash
node backend/test-api.js
```
Expected output:
```
--- Starting Backend REST API Test Suite ---
✓ Health check: UP
✓ Admin login: true Rajesh Malhotra (admin)
✓ Customer login: true Pooja Verma (customer)
✓ Menu items loaded: 25 dishes
✓ Categories loaded: Starters, Main Course, Pizza and Burgers, Beverages, Desserts
✓ Orders retrieved: 16 total orders
✓ Place new order result: ID = 1001 Status = Preparing Total = Rs. 550
✓ Updated order status: Out for Delivery Assigned Courier: Suresh Patil
✓ Feedback submitted: true Rating: 5
✓ Sales analytics: Total Revenue = Rs. 8520 Total Orders = 16
--- ALL REST API ENDPOINTS VERIFIED SUCCESSFULLY ---
```

---

## 📑 Waterfall Model Report
For the complete college submission documentation (SRS, ER Diagrams, Database Schema, and Viva Questions), see:
**[WATERFALL_MICROPROJECT_REPORT.md](WATERFALL_MICROPROJECT_REPORT.md)**.
