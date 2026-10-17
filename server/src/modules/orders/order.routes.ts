import { Router } from 'express';
import { createOrder, getMyOrders, getOrder, cancelOrder } from './order.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';

const router = Router();
router.post('/', authenticate, authorize('customer'), createOrder);
router.get('/my-orders', authenticate, authorize('customer'), getMyOrders);
router.get('/:id', authenticate, getOrder);
router.patch('/:id/cancel', authenticate, authorize('customer'), cancelOrder);

export default router;
