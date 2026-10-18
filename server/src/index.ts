import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { rateLimit } from 'express-rate-limit';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

import authRoutes from './modules/auth/auth.routes';
import productRoutes from './modules/products/product.routes';
import categoryRoutes from './modules/products/category.routes';
import cartRoutes from './modules/cart/cart.routes';
import orderRoutes from './modules/orders/order.routes';
import storeRoutes from './modules/stores/store.routes';
import appointmentRoutes from './modules/appointments/appointment.routes';
import adminRoutes from './modules/admin/admin.routes';
import workerRoutes from './modules/admin/worker.routes';
import paymentRoutes from './modules/payments/payment.routes';
import prescriptionRoutes from './modules/prescriptions/prescription.routes';
import wishlistRoutes from './modules/cart/wishlist.routes';
import reviewRoutes from './modules/products/review.routes';
import couponRoutes from './modules/orders/coupon.routes';
import returnRoutes from './modules/orders/return.routes';
import supportRoutes from './modules/orders/support.routes';
import tryAtHomeRoutes from './modules/appointments/tryathome.routes';

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 2000,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Auth routes rate limit (generous for development and local testing)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api/v1/auth', authLimiter);

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Static uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/images', express.static(path.join(__dirname, '../../client/public/images')));

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/wishlist', wishlistRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/stores', storeRoutes);
app.use('/api/v1/appointments', appointmentRoutes);
app.use('/api/v1/try-at-home', tryAtHomeRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/prescriptions', prescriptionRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/coupons', couponRoutes);
app.use('/api/v1/returns', returnRoutes);
app.use('/api/v1/support', supportRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/worker', workerRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'PS OPTICAL API is running', timestamp: new Date() });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[Error]', err);
  const status = err.statusCode || err.status || 500;
  const message = process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message;
  res.status(status).json({ success: false, message });
});

// Connect to MongoDB and start server
const startServer = async () => {
  let dbConnected = false;
  const atlasUri = process.env.MONGODB_URI;

  if (atlasUri && atlasUri.startsWith('mongodb')) {
    try {
      console.log(`📡 Connecting to MongoDB Atlas (${atlasUri.split('@')[1] || 'cluster'})...`);
      await mongoose.connect(atlasUri, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 30000,
        family: 4,
      });
      // Crucial: verify ping before assuming connection is ready
      await mongoose.connection.db?.admin().ping();
      console.log('✅ MongoDB Atlas connected and verified successfully!');
      dbConnected = true;
    } catch (err: any) {
      console.warn(`⚠️ MongoDB Atlas ping/connection failed: ${err.message}`);
      console.log('💡 Note: If using Atlas, ensure your IP address is whitelisted in Atlas Network Access (0.0.0.0/0).');
      try {
        await mongoose.disconnect();
      } catch {}
      dbConnected = false;
    }
  }

  if (!dbConnected) {
    console.log('⚡ Launching embedded high-speed in-memory MongoDB server for seamless zero-setup execution...');
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const memoryUri = mongod.getUri();
      console.log(`✅ In-memory MongoDB running at: ${memoryUri}`);
      await mongoose.connect(memoryUri);
      console.log('✅ Connected to in-memory MongoDB database.');
      dbConnected = true;
    } catch (memErr: any) {
      console.error('❌ Failed to start in-memory MongoDB:', memErr.message);
      process.exit(1);
    }
  }

  // Auto-seed if database is empty
  try {
    const { User } = await import('./models/User');
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('🌱 Database is empty. Auto-seeding initial luxury catalog, stores, and test accounts...');
      const { runSeed } = await import('./utils/seed');
      await runSeed(false);
      console.log('✅ Auto-seed completed successfully!');
    } else {
      console.log(`📦 Database ready with ${userCount} existing users.`);
    }
  } catch (seedErr: any) {
    console.error('❌ Auto-seed check error:', seedErr.message);
  }

  app.listen(PORT, () => {
    console.log(`🚀 PS OPTICAL API running on port ${PORT}`);
    console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
  });
};

startServer();

export default app;
