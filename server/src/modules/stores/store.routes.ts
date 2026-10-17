import { Router } from 'express';
import { getStores, getStore, getStoreAvailability } from './store.controller';

const router = Router();
router.get('/', getStores);
router.get('/:id', getStore);
router.get('/:id/availability', getStoreAvailability);

export default router;
