# PS OPTICAL — Comprehensive Database Schema Reference

This document outlines the MongoDB data architecture and entity relationship design for the **PS OPTICAL** e-commerce and retail platform.

---

## 1. Entity Architecture & Collections

### 1.1 `User`
Manages identity across three isolated portals: **Customer**, **Optical Worker**, and **System Administrator**.

| Field | Type | Description |
|---|---|---|
| `_id` | `ObjectId` | Primary key |
| `name` | `String` | Full legal / customer name |
| `email` | `String` (Unique, Indexed) | Authentication email |
| `phone` | `String` | Mobile contact number |
| `passwordHash` | `String` | Bcrypt hashed credentials (cost factor 12) |
| `role` | `Enum ('customer', 'worker', 'admin')` | Access control tier |
| `accountStatus` | `Enum ('active', 'inactive', 'suspended', 'pending_verification')` | State of account lifecycle |
| `emailVerified` | `Boolean` | Email address verification status |
| `emailVerificationToken` | `String` | SHA-256 hashed one-time token |
| `emailVerificationExpiry`| `Date` | 24-hour expiration timestamp |
| `resetToken` | `String` | SHA-256 hashed password reset token |
| `resetTokenExpiry` | `Date` | 1-hour expiration timestamp |
| `storeId` | `ObjectId -> Store` | Assigned store for workers |
| `avatar` | `String` | Profile picture URI |
| `dateOfBirth` | `Date` | Optional birthdate |
| `gender` | `Enum ('male', 'female', 'other', 'prefer_not_to_say')` | Demographics |
| `lastLogin` | `Date` | Last authenticated timestamp |
| `loginAttempts` | `Number` | Consecutive failed attempts (triggers lockout >= 5) |
| `lockUntil` | `Date` | Lockout expiration timestamp |
| `createdAt` / `updatedAt` | `Date` | Timestamps |

---

### 1.2 `Store`
Physical optical boutiques providing in-person eye examinations, frame styling, and Try-at-Home logistics dispatch.

| Field | Type | Description |
|---|---|---|
| `_id` | `ObjectId` | Primary key |
| `name` | `String` | Boutique name (e.g., PS OPTICAL Indiranagar Flagship) |
| `slug` | `String` (Unique) | URL slug for store page |
| `address.street` | `String` | Street address |
| `address.city` | `String` | City |
| `address.state` | `String` | State |
| `address.pincode` | `String` | Postal pincode |
| `address.country` | `String` | Default 'India' |
| `address.coordinates` | `{ lat: Number, lng: Number }` | Geographic coordinates for maps |
| `phone` | `String` | Store telephone line |
| `email` | `String` | Store branch email |
| `openingHours` | `Array<{ day, open, close, closed }>` | Operating schedule |
| `services` | `Array<String>` | Available store services (e.g., 'Zero-Error Eye Test') |
| `appointmentSlotDuration` | `Number` | Slot length in minutes (default 30) |
| `maxAppointmentsPerSlot` | `Number` | Optician capacity per slot |
| `isActive` | `Boolean` | Operational toggle |

---

### 1.3 `Product`
Comprehensive catalog of frames, sunglasses, computer glasses, and specialty optics.

| Field | Type | Description |
|---|---|---|
| `_id` | `ObjectId` | Primary key |
| `name` | `String` (Text Indexed) | Frame model title |
| `slug` | `String` (Unique) | SEO route slug |
| `sku` | `String` (Unique, Upper) | Model SKU code |
| `description` | `String` | Full craft and technical description |
| `shortDescription` | `String` | Brief summary |
| `category` | `ObjectId -> Category` | Taxonomy node |
| `brand` | `ObjectId -> Brand` | Brand reference |
| `images` | `Array<String>` | High-resolution image URLs |
| `frameShape` | `String` | 'round', 'square', 'rectangle', 'aviator', etc. |
| `frameMaterial` | `String` | 'Italian Acetate', 'Japanese Titanium', etc. |
| `frameColor` | `Array<String>` | Available colorways |
| `frameSize` | `Enum ('narrow', 'medium', 'wide', 'extra-wide')` | Sizing bracket |
| `gender` | `Enum ('men', 'women', 'unisex', 'kids')` | Target demographic |
| `lensWidth` | `Number` | Lens dimension in mm |
| `bridgeWidth` | `Number` | Bridge distance in mm |
| `templeLength` | `Number` | Temple arm length in mm |
| `basePrice` | `Number` | Standard retail price |
| `salePrice` | `Number` | Promotional price |
| `isActive` | `Boolean` | Catalog visibility |
| `isFeatured` | `Boolean` | Hero carousel feature flag |
| `isBestseller` | `Boolean` | Bestseller section flag |
| `isNewArrival` | `Boolean` | New release flag |
| `prescriptionCompatible` | `Boolean` | Flag for optical lens wizard |
| `supportedLensTypes` | `Array<String>` | Single vision, bifocal, progressive, etc. |
| `virtualTryOnAsset` | `String` | AR 3D model or transparent PNG asset |
| `averageRating` | `Number` | Running weighted review average (0 - 5) |
| `reviewCount` | `Number` | Total verified reviews count |

---

### 1.4 `Inventory`
Store-level stock counts enabling distributed real-time omnichannel availability.

| Field | Type | Description |
|---|---|---|
| `_id` | `ObjectId` | Primary key |
| `product` | `ObjectId -> Product` | Associated frame |
| `store` | `ObjectId -> Store` | Retail location holding stock |
| `color` | `String` | Color variant |
| `size` | `String` | Size variant |
| `sku` | `String` | Variant SKU |
| `quantityAvailable` | `Number` | Real-time shelf & fulfillment stock |
| `quantityReserved` | `Number` | In-flight checkout / Home Trial reservations |
| `quantityTotal` | `Number` | Total assigned units |
| `lowStockThreshold` | `Number` | Reorder alert trigger (default 5) |

*Compound Unique Index:* `{ product: 1, store: 1, color: 1, size: 1 }`

---

### 1.5 `Order`
Transactional order records including custom optical prescriptions and line item details.

| Field | Type | Description |
|---|---|---|
| `_id` | `ObjectId` | Primary key |
| `orderNumber` | `String` (Unique) | Human-readable order identifier (e.g. `PSO-M35X-9B2`) |
| `customer` | `ObjectId -> User` | Purchasing client |
| `items` | `Array<OrderItem>` | Line items (Product, lens specs, color, size, price) |
| `shippingAddress` | `Object` | Recipient address & contact phone |
| `subtotal` | `Number` | Sum of line items |
| `shippingFee` | `Number` | Courier fee |
| `tax` | `Number` | Applicable GST / sales tax (18%) |
| `discount` | `Number` | Applied voucher discount |
| `couponCode` | `String` | Redeemed coupon |
| `total` | `Number` | Net payable balance |
| `paymentMethod` | `String` | 'card', 'upi', 'netbanking', 'cod' |
| `paymentStatus` | `Enum ('pending', 'paid', 'failed', 'refunded', 'partial_refund')` | Gateway status |
| `paymentId` | `String` | Gateway transaction reference |
| `status` | `Enum ('pending_payment', 'confirmed', 'processing', 'ready_for_dispatch', 'shipped', 'delivered', 'cancelled', 'return_requested', 'returned', 'refunded')` | Fulfillment pipeline |
| `trackingNumber` | `String` | Courier tracking AWB |

---

### 1.6 `Prescription`
Digital optical vision data stored for instant reuse during lens customization.

| Field | Type | Description |
|---|---|---|
| `_id` | `ObjectId` | Primary key |
| `customer` | `ObjectId -> User` | Prescription owner |
| `doctorName` | `String` | Optometrist or ophthalmologist |
| `prescriptionDate` | `Date` | Examination date |
| `expiryDate` | `Date` | Validity date |
| `rightEye` | `IEyeData` | Sphere, Cylinder, Axis, Addition, Prism |
| `leftEye` | `IEyeData` | Sphere, Cylinder, Axis, Addition, Prism |
| `pupillaryDistance`| `Number` | Total PD (mm) |
| `pdRight` / `pdLeft`| `Number` | Monocular PDs |
| `documentUrl` | `String` | Secure upload attachment |
| `isVerified` | `Boolean` | Certified optician verification flag |

---

### 1.7 `Appointment`
Clinical in-store eye test and frame fitting consultations.

| Field | Type | Description |
|---|---|---|
| `_id` | `ObjectId` | Primary key |
| `customer` | `ObjectId -> User` | Patient / user |
| `store` | `ObjectId -> Store` | Consultation venue |
| `date` | `Date` | Appointment date |
| `timeSlot` | `String` | '10:00', '10:30', '11:00', etc. |
| `type` | `Enum ('eye_test', 'try_at_home', 'consultation', 'repair')` | Consultation mode |
| `status` | `Enum ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show')` | Booking progress |
| `customerName` | `String` | Patient name |
| `customerPhone` | `String` | Contact number |
| `assignedWorker` | `ObjectId -> User` | Attending optometrist |

---

### 1.8 `TryAtHome`
Complimentary home trial bookings (up to 5 designer frames delivered with an optician).

| Field | Type | Description |
|---|---|---|
| `_id` | `ObjectId` | Primary key |
| `customer` | `ObjectId -> User` | Client |
| `products` | `Array<ObjectId -> Product>` | Selected frames (max 5) |
| `deliveryAddress` | `Object` | Street, City, State, Pincode |
| `preferredDate` | `Date` | Requested trial date |
| `timeSlot` | `String` | Morning / Afternoon / Evening |
| `status` | `Enum ('requested', 'confirmed', 'dispatched', 'delivered', 'returned', 'cancelled')` | Trial cycle |

---

### 1.9 `Return`
14-Day zero-questions guarantee and return request lifecycle.

| Field | Type | Description |
|---|---|---|
| `_id` | `ObjectId` | Primary key |
| `order` | `ObjectId -> Order` | Originating purchase |
| `customer` | `ObjectId -> User` | Requesting client |
| `reason` | `String` | Fit, lens prescription mismatch, cosmetic |
| `description` | `String` | Customer notes |
| `status` | `Enum ('requested', 'approved', 'rejected', 'picked_up', 'received', 'refund_initiated', 'refunded')` | State |
| `refundAmount` | `Number` | Reimbursed amount |
| `adminNotes` | `String` | Internal notes |

---

### 1.10 `SupportTicket`
Customer concierge conversation threads.

| Field | Type | Description |
|---|---|---|
| `_id` | `ObjectId` | Primary key |
| `customer` | `ObjectId -> User` | Initiator |
| `subject` | `String` | Inquired topic |
| `category` | `Enum ('order', 'product', 'prescription', 'payment', 'return', 'general')` | Classification |
| `priority` | `Enum ('low', 'medium', 'high', 'urgent')` | Priority level |
| `status` | `Enum ('open', 'in_progress', 'waiting_customer', 'resolved', 'closed')` | Ticket state |
| `messages` | `Array<{ sender, senderRole, content, createdAt }>` | Message thread |

---

### 1.11 `AuditLog`
Immutable administrative activity trails.

| Field | Type | Description |
|---|---|---|
| `_id` | `ObjectId` | Primary key |
| `user` | `ObjectId -> User` | Actor |
| `userRole` | `String` | Role at time of action |
| `action` | `String` | 'CUSTOMER_LOGIN', 'ADMIN_LOGIN', 'ORDER_CANCEL', etc. |
| `resource` | `String` | Target collection |
| `resourceId` | `String` | Target identifier |
| `details` | `Mixed` | Metadata snapshot |
| `ip` | `String` | Client IP |
| `userAgent` | `String` | Client browser user-agent |
| `createdAt` | `Date` | Timestamp |
