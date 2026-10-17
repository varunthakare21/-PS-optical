import { Router } from 'express';
import {
  customerRegister,
  customerLogin,
  workerLogin,
  adminLogin,
  adminRegister,
  logout,
  getMe,
  forgotPasswordCustomer,
  forgotPasswordWorker,
  forgotPasswordAdmin,
  resetPassword,
  verifyEmail,
} from './auth.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

// Customer auth
router.post('/customer/register', customerRegister);
router.post('/customer/login', customerLogin);
router.post('/customer/forgot-password', forgotPasswordCustomer);
router.get('/customer/verify-email/:token', verifyEmail);

// Worker auth
router.post('/worker/login', workerLogin);
router.post('/worker/forgot-password', forgotPasswordWorker);

// Admin auth
router.post('/admin/login', adminLogin);
router.post('/admin/register', adminRegister);
router.post('/admin/forgot-password', forgotPasswordAdmin);

// Shared
router.post('/reset-password/:token', resetPassword);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getMe);

export default router;
