# PS OPTICAL — RESTful API Documentation

Base URL: `/api/v1`

All protected endpoints require either an `Authorization: Bearer <JWT>` header or an `httpOnly` secure session cookie named `token`.

---

## 1. Authentication (`/auth`)

### 1.1 Customer Registration
- **Route:** `POST /api/v1/auth/customer/register`
- **Body:** `{ name, email, phone, password }`
- **Response:** `201 Created` with verification email dispatched.

### 1.2 Customer Login
- **Route:** `POST /api/v1/auth/customer/login`
- **Body:** `{ email, password }`
- **Response:** `200 OK` `{ user: { id, name, email, role }, token }` + sets HTTP cookie.

### 1.3 Optical Worker Login
- **Route:** `POST /api/v1/auth/worker/login`
- **Body:** `{ email, password }`
- **Response:** `200 OK` `{ user: { id, name, email, role, storeId }, token }`.

### 1.4 Administrator Login
- **Route:** `POST /api/v1/auth/admin/login`
- **Body:** `{ email, password }`
- **Response:** `200 OK` `{ user: { id, name, email, role }, token }`.

### 1.5 Password Recovery & Reset
- **Customer:** `POST /api/v1/auth/customer/forgot-password` (`{ email }`)
- **Worker:** `POST /api/v1/auth/worker/forgot-password` (`{ email }`)
- **Admin:** `POST /api/v1/auth/admin/forgot-password` (`{ email }`)
- **Execute Reset:** `POST /api/v1/auth/reset-password/:token` (`{ password }`)
- **Email Verification:** `GET /api/v1/auth/customer/verify-email/:token`

### 1.6 Session Management
- **Logout:** `POST /api/v1/auth/logout` (Clears auth cookie and records audit log)
- **Get Current Session:** `GET /api/v1/auth/me`

---

## 2. Product Catalog (`/products` & `/categories`)

### 2.1 Query Products
- **Route:** `GET /api/v1/products`
- **Parameters:**
  - `page` (number, default: 1)
  - `limit` (number, default: 12)
  - `category` (ObjectId string)
  - `gender` ('men' | 'women' | 'unisex' | 'kids')
  - `frameShape` ('round' | 'square' | 'aviator' | 'cat-eye', etc.)
  - `frameMaterial` ('Italian Acetate' | 'Japanese Titanium', etc.)
  - `minPrice` / `maxPrice` (number)
  - `sort` ('price_asc' | 'price_desc' | 'newest' | 'rating' | 'popular')
  - `q` (full-text search query)

### 2.2 Get Single Product
- **Route:** `GET /api/v1/products/:slug`

### 2.3 Curated Highlights
- **Featured:** `GET /api/v1/products/featured`
- **Bestsellers:** `GET /api/v1/products/bestsellers`
- **New Arrivals:** `GET /api/v1/products/new-arrivals`

### 2.4 Categories
- **All Categories:** `GET /api/v1/categories`
- **Single Category:** `GET /api/v1/categories/:slug`

---

## 3. Shopping Cart & Wishlist

### 3.1 Cart Operations
- **Fetch Cart:** `GET /api/v1/cart`
- **Add Item:** `POST /api/v1/cart/items`
  - Body: `{ productId, color, size, quantity, lensType, lensOptions, prescriptionId }`
- **Update Item Quantity:** `PATCH /api/v1/cart/items/:itemId` (`{ quantity }`)
- **Delete Item:** `DELETE /api/v1/cart/items/:itemId`
- **Clear Entire Cart:** `DELETE /api/v1/cart`
- **Apply Coupon:** `POST /api/v1/cart/coupon` (`{ code, subtotal }`)

### 3.2 Wishlist
- **Fetch Wishlist:** `GET /api/v1/wishlist` *(Auth: Customer)*
- **Add Product:** `POST /api/v1/wishlist/:productId` *(Auth: Customer)*
- **Remove Product:** `DELETE /api/v1/wishlist/:productId` *(Auth: Customer)*

---

## 4. Orders & Checkout

### 4.1 Create Order
- **Route:** `POST /api/v1/orders` *(Auth: Customer)*
- **Body:** `{ items, shippingAddress, paymentMethod, couponCode, subtotal, shippingFee, tax, discount, total }`
- *Note:* The backend recalculates all item sums, tax rates, and coupon validity server-side before persisting.

### 4.2 Customer Orders
- **List My Orders:** `GET /api/v1/orders/my-orders?page=1` *(Auth: Customer)*
- **Order Details:** `GET /api/v1/orders/:id` *(Auth: Customer/Admin)*
- **Cancel Order:** `PATCH /api/v1/orders/:id/cancel` (`{ reason }`) *(Auth: Customer)*

---

## 5. Physical Stores & Appointments

### 5.1 Stores Directory
- **All Stores:** `GET /api/v1/stores?city=Bangalore`
- **Store Details:** `GET /api/v1/stores/:id`
- **Check Slot Availability:** `GET /api/v1/stores/:id/availability?date=2026-10-20`

### 5.2 Eye Test Appointments
- **Book Slot:** `POST /api/v1/appointments` *(Auth: Customer)*
  - Body: `{ storeId, date, timeSlot, type, customerName, customerPhone, notes }`
- **List My Appointments:** `GET /api/v1/appointments/my-appointments` *(Auth: Customer)*
- **Cancel Appointment:** `PATCH /api/v1/appointments/:id/cancel` *(Auth: Customer)*

### 5.3 Try at Home
- **Book Home Trial:** `POST /api/v1/try-at-home` *(Auth: Customer)*
  - Body: `{ productIds, deliveryAddress, preferredDate, timeSlot, customerName, customerPhone }`
- **My Trials:** `GET /api/v1/try-at-home/my-bookings` *(Auth: Customer)*

---

## 6. Optical Worker Portal (`/worker`)

*All worker routes require `role: 'worker'`.*

- **Dashboard Metrics:** `GET /api/v1/worker/dashboard` (Returns scheduled store tests, pending home trials, and low stock list)
- **Store Stock:** `GET /api/v1/worker/inventory`
- **Update Variant Quantity:** `PATCH /api/v1/worker/inventory/:id` (`{ quantityAvailable, quantityTotal }`)

---

## 7. Administrative Portal (`/admin`)

*All admin routes require `role: 'admin'`.*

- **Analytics:** `GET /api/v1/admin/analytics`
- **Customer Directory:** `GET /api/v1/admin/customers?page=1`
- **Product CRUD:**
  - List: `GET /api/v1/admin/products`
  - Create: `POST /api/v1/admin/products`
  - Update: `PATCH /api/v1/admin/products/:id`
  - Deactivate: `DELETE /api/v1/admin/products/:id`
- **Categories:** `GET /api/v1/admin/categories`, `POST /api/v1/admin/categories`, `PATCH /api/v1/admin/categories/:id`
- **Orders:** `GET /api/v1/admin/orders`, `PATCH /api/v1/admin/orders/:id/status`
- **Stores:** `GET /api/v1/admin/stores`, `POST /api/v1/admin/stores`, `PATCH /api/v1/admin/stores/:id`
- **Staff Provisioning:** `POST /api/v1/worker/create`, `GET /api/v1/worker/all`
- **Network Inventory:** `GET /api/v1/admin/inventory`, `PATCH /api/v1/admin/inventory/:id`
- **Appointments Oversight:** `GET /api/v1/admin/appointments`, `PATCH /api/v1/admin/appointments/:id/status`
- **Returns Management:** `GET /api/v1/admin/returns`, `PATCH /api/v1/admin/returns/:id/status`
- **Review Moderation:** `GET /api/v1/admin/reviews`, `PATCH /api/v1/admin/reviews/:id/approve`
- **Coupons:** `GET /api/v1/admin/coupons`, `POST /api/v1/admin/coupons`
- **Security Audit Logs:** `GET /api/v1/admin/audit-logs?page=1`
