import { Router } from 'express';
import { getProductReviews, createReview } from './review.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';

const router = Router();
router.get('/product/:productId', getProductReviews);
router.post('/', authenticate, authorize('customer'), createReview);

export default router;
