import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { Return } from '../../models/Return';
import { Order } from '../../models/Order';

const router = Router();

router.post('/', authenticate, authorize('customer'), async (req: any, res) => {
  try {
    const { orderId, reason, description } = req.body;
    const order = await Order.findOne({ _id: orderId, customer: req.user._id });
    if (!order || order.status !== 'delivered') {
      res.status(400).json({ success: false, message: 'Return not applicable for this order.' });
      return;
    }
    const existing = await Return.findOne({ order: orderId });
    if (existing) {
      res.status(409).json({ success: false, message: 'Return already requested.' });
      return;
    }
    const returnReq = await Return.create({ order: orderId, customer: req.user._id, reason, description });
    order.status = 'return_requested';
    await order.save();
    res.status(201).json({ success: true, data: returnReq });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to submit return request.' });
  }
});

router.get('/my-returns', authenticate, authorize('customer'), async (req: any, res) => {
  try {
    const returns = await Return.find({ customer: req.user._id }).populate('order', 'orderNumber total').lean();
    res.json({ success: true, data: returns });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch returns.' });
  }
});

export default router;
