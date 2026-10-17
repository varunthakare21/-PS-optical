import { Router } from 'express';
import { getProducts, getProduct, searchProducts, getFeatured, getBestsellers, getNewArrivals } from './product.controller';
import { optionalAuth } from '../../middleware/auth.middleware';

const router = Router();

router.get('/', optionalAuth, getProducts);
router.get('/featured', getFeatured);
router.get('/bestsellers', getBestsellers);
router.get('/new-arrivals', getNewArrivals);
router.get('/search', searchProducts);
router.get('/:slug', optionalAuth, getProduct);

export default router;
