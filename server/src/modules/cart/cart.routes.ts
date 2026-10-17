import { Router } from 'express';
import { getCart, addToCart, updateCartItem, removeCartItem, clearCart, applyCoupon } from './cart.controller';
import { authenticate, optionalAuth } from '../../middleware/auth.middleware';

const router = Router();
router.get('/', optionalAuth, getCart);
router.post('/items', optionalAuth, addToCart);
router.patch('/items/:itemId', optionalAuth, updateCartItem);
router.delete('/items/:itemId', optionalAuth, removeCartItem);
router.delete('/', authenticate, clearCart);
router.post('/coupon', optionalAuth, applyCoupon);

export default router;
