# 🍛 SpiceRoute – Online Food Delivery Micro Project
### Clean & Simplified Full-Stack Implementation for College Submission

A streamlined, beginner-friendly Online Food Ordering web application built with **HTML5, CSS3, JavaScript** on the frontend, powered by a **Node.js + Express REST API** backend and a persistent **SQLite (`node:sqlite`)** database.

Designed specifically for diploma/undergraduate Computer Engineering evaluation: simple to explain, easy to run, zero external build tools, and fully functional.

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
Or directly:
```bash
node backend/server.js
```

### 3. Open in Browser
Visit: **[http://localhost:3000](http://localhost:3000)**

---

## 🔑 Dedicated User Portals & Test Accounts

The system features dedicated sign-in pages and custom dashboards tailored for each user role:

| Role | Dedicated Sign-In Page | Dedicated Dashboard | Demo Email | Demo Password | Responsibilities |
|---|---|---|---|---|---|
| **Customer** | [`/login.html`](http://localhost:3000/login.html) | [`/menu.html`](http://localhost:3000/menu.html) | `customer@spiceroute.in` | `Customer@123` | Browse dishes, add to cart, checkout with dynamic UPI QR/COD, track live 5-stage order progress. |
| **Hotel Kitchen Staff** | [`/hotel/login.html`](http://localhost:3000/hotel/login.html) | [`/hotel/index.html`](http://localhost:3000/hotel/index.html) | `hotel@spiceroute.in` | `Hotel@123` | View incoming tickets (`Placed`), start cooking (`Preparing`), pack parcels (`Packed`), and dispatch to couriers (`Out for Delivery`). |
| **Delivery Courier** | [`/delivery/login.html`](http://localhost:3000/delivery/login.html) | [`/delivery/index.html`](http://localhost:3000/delivery/index.html) | `delivery1@spiceroute.in` | `Delivery@123` | View assigned route shipments, inspect customer address/phone, collect COD cash, mark as `Delivered`. |

*(Each sign-in page includes convenient one-click Quick Demo Fill buttons for rapid viva demonstration)*

---

## 📄 Application Pages & Architecture

### 👤 1. Customer Section
1. **Home Page (`index.html`)** – Hero banner, category highlights, featured dishes with one-click Add to Cart, customer testimonials, and quick links.
2. **Menu Page (`menu.html`)** – Food catalog with category filter pills (Starters, Main Course, Pizza & Burgers, Beverages, Desserts), dynamic search, and Add to Cart actions.
3. **Cart Page (`cart.html`)** – Selected dishes list, quantity increment/decrement controls, item removal, subtotal, delivery fee calculation (free above ₹300), 5% GST tax, and checkout button.
4. **Checkout Page (`checkout.html`)** – Delivery address form with editable City (Mumbai / custom) and Pincode, dynamic UPI QR code generator, Card, and COD payment options.
5. **My Orders Page (`orders.html`)** – Order history with itemized dish lists, delivery addresses, and a live visual **5-stage progress stepper**:
   `Placed` ➔ `Preparing` ➔ `Packed` ➔ `Out for Delivery` ➔ `Delivered`
6. **Customer Authentication (`login.html`, `register.html`)** – Simple login & registration forms for customers.

### 🏨 2. Hotel Kitchen Panel
1. **Hotel Sign In (`hotel/login.html`)** – Distinctive amber/gold themed kitchen portal sign-in page with demo credentials button.
2. **Hotel Dashboard (`hotel/index.html`)** – Kitchen Order Pipeline:
   - **Incoming Orders (`Placed`):** View new incoming tickets and click *"Accept & Start Cooking"*.
   - **Cooking Orders (`Preparing`):** Food being prepared; click *"Food Cooked & Packed"*.
   - **Ready for Dispatch (`Packed`):** Food packed in parcel; select delivery courier from dropdown and click *"Handover to Courier"*.
   - **Dispatched Orders:** Track orders currently out with delivery drivers.

### 🚴 3. Delivery Courier Panel
1. **Delivery Sign In (`delivery/login.html`)** – Dedicated emerald-themed courier sign-in page with 1-click demo buttons.
2. **Delivery Dashboard (`delivery/index.html`)** – Route delivery hub:
   - Filter tabs: **Active Shipments** and **Completed Deliveries**.
   - Customer details, destination address, and phone number (with direct call links).
   - Cash-to-collect badge for COD orders.
   - One-click **"Mark as Delivered"** action (marks order delivered and auto-completes COD payment).

---

## 🏗️ 3-Tier Architecture Diagram

```
[Presentation Tier - Role-Specific Frontends]
   Customer:   index.html, menu.html, cart.html, checkout.html, orders.html, login.html
   Hotel:      hotel/login.html, hotel/index.html (Kitchen & Order Dispatch)
   Delivery:   delivery/login.html, delivery/index.html (Courier Delivery Hub)
   Shared JS:  js/store.js (Async REST API client & Cart) | js/app.js (UI & Route Guards)
                           │
                           ▼ HTTP REST JSON (fetch)
[Application Tier - Node.js Express Backend]
   backend/server.js (Static file server & REST router)
   backend/routes/auth.js (Login, registration, role checks)
   backend/routes/menu.js (Food catalog & categories)
   backend/routes/orders.js (Order placement, status updates, invoice calculation)
   backend/routes/users.js (User directory & delivery staff routes)
                           │
                           ▼ SQL Queries (node:sqlite)
[Data Tier - Relational SQLite Database]
   backend/db.js (Schema init & seed data)
   backend/data/spiceroute.sqlite (Relational database file)
```

---

## 📡 REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Backend status & health check |
| `POST` | `/api/auth/login` | Role-based user authentication |
| `POST` | `/api/auth/register` | New customer account registration |
| `GET` | `/api/menu` | List food menu items (optional `?category=`) |
| `GET` | `/api/categories` | List food categories |
| `GET` | `/api/orders` | List orders (optional `?user_id=`, `?status=`, `?delivery_boy_id=`) |
| `GET` | `/api/orders/:id` | Get full order invoice & item details |
| `POST` | `/api/orders` | Place new customer order |
| `PUT` | `/api/orders/:id/status` | Update order progress status & assign delivery staff |
| `GET` | `/api/users/delivery-staff`| List available delivery couriers |

---

## 🧪 Testing the Project

Run the automated test suites:
```bash
# Verify all REST API endpoints:
node backend/test-api.js

# Verify all page routes & full order lifecycle:
node backend/test-panels.js
```
All tests execute synchronously with clear green checkmarks (`✓`).
