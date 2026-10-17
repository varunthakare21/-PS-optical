import { Router } from 'express';
import { getWishlist, addToWishlist, removeFromWishlist } from './wishlist.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';

const router = Router();
router.get('/', authenticate, authorize('customer'), getWishlist);
router.post('/:productId', authenticate, authorize('customer'), addToWishlist);
router.delete('/:productId', authenticate, authorize('customer'), removeFromWishlist);

export default router;
