import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { TryAtHome } from '../../models/TryAtHome';

const router = Router();

router.post('/', authenticate, authorize('customer'), async (req: any, res) => {
  try {
    const { productIds, deliveryAddress, preferredDate, timeSlot, customerName, customerPhone, notes } = req.body;
    const booking = await TryAtHome.create({
      customer: req.user._id,
      products: productIds,
      deliveryAddress,
      preferredDate: new Date(preferredDate),
      timeSlot,
      customerName,
      customerPhone,
      notes,
    });
    res.status(201).json({ success: true, data: booking });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to book try-at-home.' });
  }
});

router.get('/my-bookings', authenticate, authorize('customer'), async (req: any, res) => {
  try {
    const bookings = await TryAtHome.find({ customer: req.user._id })
      .populate('products', 'name images basePrice')
      .sort({ createdAt: -1 })
      .lean();
    res.json({ success: true, data: bookings });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch bookings.' });
  }
});

export default router;
