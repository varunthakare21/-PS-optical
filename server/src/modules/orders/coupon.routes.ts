import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { Coupon } from '../../models/Coupon';

const router = Router();

router.get('/validate/:code', async (req, res) => {
  try {
    const coupon = await Coupon.findOne({ code: req.params.code.toUpperCase(), isActive: true });
    if (!coupon || new Date() < coupon.validFrom || new Date() > coupon.validUntil) {
      res.status(404).json({ success: false, message: 'Invalid or expired coupon.' });
      return;
    }
    res.json({ success: true, data: { code: coupon.code, type: coupon.type, value: coupon.value, minOrderAmount: coupon.minOrderAmount, description: coupon.description } });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to validate coupon.' });
  }
});

export default router;
