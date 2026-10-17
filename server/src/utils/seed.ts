import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

import { User } from '../models/User';
import { Store } from '../models/Store';
import { Category } from '../models/Category';
import { Brand } from '../models/Brand';
import { Product } from '../models/Product';
import { Inventory } from '../models/Inventory';
import { Coupon } from '../models/Coupon';
import { SupportTicket } from '../models/SupportTicket';
import { TryAtHome } from '../models/TryAtHome';

export const runSeed = async (disconnectWhenDone = false) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ps-optical';
      console.log(`Connecting to MongoDB at: ${uri}`);
      await mongoose.connect(uri);
    }
    console.log('Connected! Clearing previous demo data...');

    await Promise.all([
      User.deleteMany({}),
      Store.deleteMany({}),
      Category.deleteMany({}),
      Brand.deleteMany({}),
      Product.deleteMany({}),
      Inventory.deleteMany({}),
      Coupon.deleteMany({}),
      SupportTicket.deleteMany({}),
      TryAtHome.deleteMany({}),
    ]);

    // 1. STORES
    console.log('Seeding stores...');
    const stores = await Store.create([
      {
        name: 'PS OPTICAL Boutique — Bhandara',
        slug: 'ps-optical-bhandara',
        address: {
          street: 'Near Post Office',
          city: 'Bhandara',
          state: 'Maharashtra',
          pincode: '441904',
          country: 'India',
          coordinates: { lat: 21.1685, lng: 79.6543 },
        },
        phone: '+91 7184 252200',
        email: 'bhandara@psoptical.in',
        openingHours: [
          { day: 'Monday - Saturday', open: '10:00 AM', close: '09:00 PM', closed: false },
          { day: 'Sunday', open: '11:00 AM', close: '08:00 PM', closed: false },
        ],
        services: [
          'Comprehensive Eye Examination',
          'Designer Frame Styling',
          'Precision Lens Cutting & Dispensing',
          'Contact Lens Fitting & Trial',
          'Frame Adjustment & Ultrasonic Cleaning',
          'Statewide Maharashtra Delivery Hub',
        ],
        images: ['https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&q=80'],
        appointmentSlotDuration: 30,
        maxAppointmentsPerSlot: 3,
      },
    ]);

    // 2. USERS (Customer, Worker, Admin)
    console.log('Seeding users...');
    const salt = 10;
    const adminPass1 = await bcrypt.hash('Admin@123', salt);
    const adminPass2 = await bcrypt.hash('Admin@12345', salt);
    const workerPass1 = await bcrypt.hash('Worker@123', salt);
    const workerPass2 = await bcrypt.hash('Worker@12345', salt);
    const custPass1 = await bcrypt.hash('Customer@123', salt);
    const custPass2 = await bcrypt.hash('Customer@12345', salt);

    const users = await Promise.all([
      User.create({
        name: 'PS Administrator',
        email: 'admin@psoptical.com',
        passwordHash: adminPass1,
        role: 'admin',
        accountStatus: 'active',
        emailVerified: true,
      }),
      User.create({
        name: 'PS Administrator (IN)',
        email: 'admin@psoptical.in',
        passwordHash: adminPass1,
        role: 'admin',
        accountStatus: 'active',
        emailVerified: true,
      }),
      User.create({
        name: 'Rajesh Sharma (Optician)',
        email: 'worker@psoptical.com',
        phone: '+91 98200 11223',
        passwordHash: workerPass1,
        role: 'worker',
        accountStatus: 'active',
        emailVerified: true,
        storeId: stores[0]._id,
      }),
      User.create({
        name: 'Rajesh Sharma (Optician IN)',
        email: 'worker@psoptical.in',
        phone: '+91 98200 11223',
        passwordHash: workerPass2,
        role: 'worker',
        accountStatus: 'active',
        emailVerified: true,
        storeId: stores[0]._id,
      }),
      User.create({
        name: 'Aarav Patel',
        email: 'customer@psoptical.com',
        phone: '+91 98765 43210',
        passwordHash: custPass1,
        role: 'customer',
        accountStatus: 'active',
        emailVerified: true,
      }),
      User.create({
        name: 'Aarav Patel (IN)',
        email: 'customer@psoptical.in',
        phone: '+91 98765 43210',
        passwordHash: custPass2,
        role: 'customer',
        accountStatus: 'active',
        emailVerified: true,
      }),
    ]);

    // 3. CATEGORIES
    console.log('Seeding categories...');
    const categories = await Category.create([
      { name: 'Eyeglasses', slug: 'eyeglasses', description: 'Premium prescription frames engineered for daily clarity', sortOrder: 1 },
      { name: 'Sunglasses', slug: 'sunglasses', description: 'UV400 & Polarized designer sunglasses for stylish protection', sortOrder: 2 },
      { name: 'Computer Glasses', slug: 'computer-glasses', description: 'Blue-light blocking lenses designed for digital screens', sortOrder: 3 },
      { name: 'Contact Lenses', slug: 'contact-lenses', description: 'Daily, monthly, and toric soft contact lenses', sortOrder: 4 },
      { name: "Kids' Eyewear", slug: 'kids-eyewear', description: 'Durable, shatterproof, lightweight frames for children', sortOrder: 5 },
      { name: 'Accessories', slug: 'accessories', description: 'Premium cases, microfibre cloths, chains, and cleaner sprays', sortOrder: 6 },
    ]);

    // 4. BRANDS
    console.log('Seeding brands...');
    const brands = await Brand.create([
      { name: 'PS Signature', slug: 'ps-signature', description: 'In-house luxury handcrafted titanium and acetate frames', isPremium: true, sortOrder: 1 },
      { name: 'Vincent Chase', slug: 'vincent-chase', description: 'Modern, high-energy everyday optical wear', isPremium: false, sortOrder: 2 },
      { name: 'John Jacobs', slug: 'john-jacobs', description: 'Artisanal eyewear made with Italian Mazzucchelli acetate', isPremium: true, sortOrder: 3 },
      { name: 'Ray-Ban', slug: 'ray-ban', description: 'Iconic eyewear heritage since 1937', isPremium: true, sortOrder: 4 },
      { name: 'Vogue Eyewear', slug: 'vogue-eyewear', description: 'Fashion-forward chic eyewear and tinted lenses', isPremium: false, sortOrder: 5 },
    ]);

    // 5. PRODUCTS
    console.log('Seeding products...');
    const productsData = [
      {
        name: 'PS Milano Artisanal Acetate',
        slug: 'ps-milano-artisanal-acetate',
        sku: 'PSO-MIL-001',
        description: 'Sculpted from Italian bio-acetate with custom 5-barrel hinges and hand-polished bevelled edges. Designed for lightweight balance and timeless distinction.',
        shortDescription: 'Classic round frame in warm tortoiseshell acetate',
        category: categories[0]._id,
        brand: brands[0]._id,
        images: [
          'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&q=80',
          'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80',
        ],
        frameShape: 'round',
        frameMaterial: 'Acetate',
        frameColor: ['Tortoiseshell', 'Espresso Black', 'Champagne Honey'],
        frameSize: 'medium',
        gender: 'unisex',
        lensWidth: 49,
        bridgeWidth: 20,
        templeLength: 145,
        basePrice: 4999,
        salePrice: 3999,
        tags: ['bestseller', 'round', 'acetate', 'premium'],
        isFeatured: true,
        isBestseller: true,
        isNewArrival: false,
        supportedLensTypes: ['Single Vision', 'Bifocal', 'Progressive', 'Blue Light', 'Anti-Glare'],
        prescriptionCompatible: true,
        averageRating: 4.9,
        reviewCount: 42,
        warranty: '1 Year Brand Warranty',
      },
      {
        name: 'PS Aurelius Beta-Titanium Rimless',
        slug: 'ps-aurelius-beta-titanium-rimless',
        sku: 'PSO-AUR-002',
        description: 'Weighing only 8.4 grams, this featherlight Japanese beta-titanium rimless frame offers unobtrusive vision and all-day ergonomic comfort.',
        shortDescription: 'Ultra-lightweight rimless rectangle titanium frame',
        category: categories[0]._id,
        brand: brands[0]._id,
        images: [
          'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=800&q=80',
          'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&q=80',
        ],
        frameShape: 'rectangle',
        frameMaterial: 'Titanium',
        frameColor: ['Satin Gold', 'Gunmetal Charcoal', 'Rose Gold'],
        frameSize: 'wide',
        gender: 'unisex',
        lensWidth: 53,
        bridgeWidth: 18,
        templeLength: 142,
        basePrice: 6999,
        salePrice: 5499,
        tags: ['titanium', 'rimless', 'ultralight', 'executive'],
        isFeatured: true,
        isBestseller: true,
        isNewArrival: true,
        supportedLensTypes: ['Single Vision', 'Progressive', 'High-Index Thin Lenses'],
        prescriptionCompatible: true,
        averageRating: 4.8,
        reviewCount: 29,
        warranty: '2 Year Frame Warranty',
      },
      {
        name: 'Verona Bold Cat-Eye',
        slug: 'verona-bold-cat-eye',
        sku: 'PSO-VER-003',
        description: 'An elevated, feminine cat-eye silhouette featuring subtly lifted temples and a flattering bevel that frames the brow line.',
        shortDescription: 'Modern upswept cat-eye in terracotta and crystal',
        category: categories[0]._id,
        brand: brands[2]._id,
        images: [
          'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=800&q=80',
        ],
        frameShape: 'cat-eye',
        frameMaterial: 'Acetate',
        frameColor: ['Terracotta Coral', 'Onyx Black', 'Olive Mist'],
        frameSize: 'medium',
        gender: 'women',
        lensWidth: 51,
        bridgeWidth: 17,
        templeLength: 140,
        basePrice: 3499,
        salePrice: 2799,
        tags: ['cat-eye', 'women', 'fashion', 'trendy'],
        isFeatured: true,
        isBestseller: false,
        isNewArrival: true,
        supportedLensTypes: ['Single Vision', 'Progressive', 'Blue Light'],
        prescriptionCompatible: true,
        averageRating: 4.7,
        reviewCount: 18,
        warranty: '1 Year Brand Warranty',
      },
      {
        name: 'Aviator Horizon Polarized',
        slug: 'aviator-horizon-polarized',
        sku: 'PSO-AVI-004',
        description: 'The definitive teardrop double-bridge aviator crafted in surgical stainless steel with scratch-resistant Tri-Acetate polarized sun lenses.',
        shortDescription: 'Classic double-bridge polarized aviator sunglasses',
        category: categories[1]._id,
        brand: brands[3]._id,
        images: [
          'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80',
        ],
        frameShape: 'aviator',
        frameMaterial: 'Stainless Steel',
        frameColor: ['Gold / G-15 Green', 'Silver / Smoke Grey', 'Espresso / Bronze'],
        frameSize: 'wide',
        gender: 'unisex',
        lensWidth: 58,
        bridgeWidth: 14,
        templeLength: 140,
        basePrice: 5999,
        salePrice: 4799,
        tags: ['sunglasses', 'polarized', 'aviator', 'uv400'],
        isFeatured: true,
        isBestseller: true,
        isNewArrival: false,
        supportedLensTypes: ['Polarized Sun Lenses', 'Prescription Sunglasses'],
        prescriptionCompatible: true,
        averageRating: 4.9,
        reviewCount: 65,
        warranty: '1 Year Manufacturer Warranty',
      },
      {
        name: 'Kyoto Minimalist Square Blue-Cut',
        slug: 'kyoto-minimalist-square-blue-cut',
        sku: 'PSO-KYO-005',
        description: 'Optimized for digital screen workers, blocking 98% of harmful 415-455nm blue light with zero color distortion and zero glare.',
        shortDescription: 'Anti-fatigue blue light screen glasses',
        category: categories[2]._id,
        brand: brands[1]._id,
        images: [
          'https://images.unsplash.com/photo-1448932223592-d1fc686e76ea?w=800&q=80',
        ],
        frameShape: 'square',
        frameMaterial: 'TR90 Memory Plastic',
        frameColor: ['Matte Black', 'Translucent Grey', 'Deep Navy'],
        frameSize: 'medium',
        gender: 'unisex',
        lensWidth: 52,
        bridgeWidth: 18,
        templeLength: 142,
        basePrice: 2499,
        salePrice: 1999,
        tags: ['computer', 'blue-light', 'square', 'work'],
        isFeatured: false,
        isBestseller: true,
        isNewArrival: false,
        supportedLensTypes: ['Zero Power Blue-Cut', 'Single Vision Blue-Cut'],
        prescriptionCompatible: true,
        averageRating: 4.8,
        reviewCount: 53,
        warranty: '1 Year Warranty',
      },
      {
        name: 'Monaco Wayfarer Sun',
        slug: 'monaco-wayfarer-sun',
        sku: 'PSO-MON-006',
        description: 'Timeless retro angular silhouette rendered in glossy Italian acetate with 100% UV400 category-3 dark tint lenses.',
        shortDescription: 'Iconic thick-gauge acetate wayfarer',
        category: categories[1]._id,
        brand: brands[0]._id,
        images: [
          'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80',
        ],
        frameShape: 'wayfarer',
        frameMaterial: 'Acetate',
        frameColor: ['Gloss Black', 'Vintage Havana', 'Matte Tortoise'],
        frameSize: 'wide',
        gender: 'men',
        lensWidth: 54,
        bridgeWidth: 19,
        templeLength: 145,
        basePrice: 4499,
        salePrice: 3499,
        tags: ['wayfarer', 'sunglasses', 'men', 'iconic'],
        isFeatured: false,
        isBestseller: false,
        isNewArrival: true,
        supportedLensTypes: ['UV400 Tinted', 'Polarized', 'Prescription Sun'],
        prescriptionCompatible: true,
        averageRating: 4.6,
        reviewCount: 14,
        warranty: '1 Year Brand Warranty',
      },
    ];

    const products = await Product.create(productsData);

    // 6. INVENTORY
    console.log('Seeding inventory across stores...');
    const inventoryRecords: any[] = [];
    for (const prod of products) {
      for (const store of stores) {
        for (const col of prod.frameColor) {
          inventoryRecords.push({
            product: prod._id,
            store: store._id,
            color: col,
            size: prod.frameSize,
            quantityAvailable: 15,
            quantityReserved: 1,
            quantityTotal: 16,
            lowStockThreshold: 4,
            sku: `${prod.sku}-${col.substring(0, 3).toUpperCase()}`,
          });
        }
      }
    }
    await Inventory.create(inventoryRecords);

    // 7. COUPONS
    console.log('Seeding coupons...');
    await Coupon.create([
      {
        code: 'WELCOME15',
        description: '15% off your first purchase at PS OPTICAL',
        type: 'percentage',
        value: 15,
        minOrderAmount: 1999,
        maxDiscount: 1000,
        usageLimit: 5000,
        usedCount: 120,
        perUserLimit: 1,
        isActive: true,
        validFrom: new Date('2024-01-01'),
        validUntil: new Date('2028-12-31'),
      },
      {
        code: 'PSO500',
        description: 'Flat ₹500 discount on orders above ₹2,999',
        type: 'fixed',
        value: 500,
        minOrderAmount: 2999,
        usageLimit: 2000,
        usedCount: 88,
        perUserLimit: 1,
        isActive: true,
        validFrom: new Date('2024-01-01'),
        validUntil: new Date('2028-12-31'),
      },
    ]);

    // 7. CUSTOMER COMPLAINTS & GRIEVANCES
    console.log('Seeding customer complaints...');
    const customerUser = users[4];
    const customerUserIn = users[5];
    const adminUser = users[0];

    await SupportTicket.create([
      {
        ticketNumber: 'TKT-10492',
        customer: customerUser._id,
        subject: 'Prescription verification for high astigmatism cylinder',
        category: 'prescription',
        priority: 'urgent',
        status: 'open',
        messages: [
          {
            sender: customerUser._id,
            senderRole: 'customer',
            content: 'Hello PS Optical team, I ordered prescription lenses with -3.50 Sph and -1.75 Cyl. Could your optometrist at the Bhandara boutique verify if thin 1.67 index lenses are ideal for the Aurelius Round frame?',
            createdAt: new Date(Date.now() - 4 * 3600000),
          },
        ],
      },
      {
        ticketNumber: 'TKT-10493',
        customer: customerUserIn._id,
        subject: 'Boutique visit nose-pad adjustment request',
        category: 'product',
        priority: 'medium',
        status: 'in_progress',
        messages: [
          {
            sender: customerUserIn._id,
            senderRole: 'customer',
            content: 'I will be coming to the Bhandara store Near Post Office next Wednesday for minor nose bridge adjustment.',
            createdAt: new Date(Date.now() - 24 * 3600000),
          },
          {
            sender: adminUser._id,
            senderRole: 'admin',
            content: 'We would be pleased to assist you Mr. Patel. Our master optician will have your frame calibrated and ultrasonically cleaned at our Bhandara boutique.',
            createdAt: new Date(Date.now() - 18 * 3600000),
          },
        ],
      },
      {
        ticketNumber: 'TKT-10494',
        customer: customerUser._id,
        subject: 'Maharashtra statewide delivery received in Pune',
        category: 'order',
        priority: 'low',
        status: 'resolved',
        resolvedAt: new Date(),
        messages: [
          {
            sender: customerUser._id,
            senderRole: 'customer',
            content: 'Confirming seamless delivery to Kothrud Pune. Handcrafted acetate finish and lens clarity are exceptional!',
            createdAt: new Date(Date.now() - 48 * 3600000),
          },
          {
            sender: adminUser._id,
            senderRole: 'admin',
            content: 'Thank you for choosing PS OPTICAL. Your 1-year frame warranty is active across all Maharashtra services.',
            createdAt: new Date(Date.now() - 36 * 3600000),
          },
        ],
      },
    ]);

    // 8. TRY-AT-HOME FRAME BOOKINGS
    console.log('Seeding try-at-home frame bookings...');
    await TryAtHome.create([
      {
        customer: customerUser._id,
        products: [products[0]._id, products[1]._id],
        deliveryAddress: {
          street: 'Civil Lines Road Near Post Office',
          city: 'Bhandara',
          state: 'Maharashtra',
          pincode: '441904',
        },
        preferredDate: new Date(Date.now() + 2 * 86400000),
        timeSlot: '11:00 AM - 01:00 PM',
        status: 'confirmed',
        customerName: 'Aarav Patel',
        customerPhone: '+91 98765 43210',
        notes: 'Trying classic round acetate and titanium frames.',
      },
      {
        customer: customerUserIn._id,
        products: [products[1]._id, products[2]._id],
        deliveryAddress: {
          street: 'Ramdaspeth Boulevard',
          city: 'Nagpur',
          state: 'Maharashtra',
          pincode: '440010',
        },
        preferredDate: new Date(Date.now() + 3 * 86400000),
        timeSlot: '03:00 PM - 05:00 PM',
        status: 'dispatched',
        customerName: 'Rohit Kulkarni',
        customerPhone: '+91 98223 34455',
        notes: 'Doorstep trial in Nagpur via statewide Maharashtra delivery.',
      },
    ]);

    console.log(`
==================================================
  PS OPTICAL DATABASE SEEDED SUCCESSFULLY!
==================================================
  Stores:     ${stores.length}
  Categories: ${categories.length}
  Brands:     ${brands.length}
  Products:   ${products.length}
  Inventory:  ${inventoryRecords.length} items across stores
  Coupons:    WELCOME15, PSO500

  ACCOUNTS CREATED:
  - Admin:    admin@psoptical.com    / Admin@123
              admin@psoptical.in     / Admin@12345
  - Worker:   worker@psoptical.com   / Worker@123
              worker@psoptical.in    / Worker@12345
  - Customer: customer@psoptical.com / Customer@123
              customer@psoptical.in  / Customer@12345
==================================================
    `);

    if (disconnectWhenDone) {
      await mongoose.disconnect();
      process.exit(0);
    }
  } catch (err: any) {
    console.error('Seeding error:', err);
    if (disconnectWhenDone) {
      process.exit(1);
    }
    throw err;
  }
};

if (require.main === module) {
  runSeed(true);
}

