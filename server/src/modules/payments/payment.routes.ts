import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { Order } from '../../models/Order';

const router = Router();

// Create test mode payment
router.post('/create', authenticate, async (req: any, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findOne({ _id: orderId, customer: req.user._id });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    if (order.paymentStatus === 'paid') {
      return res.status(400).json({ success: false, message: 'Order has already been paid.' });
    }
    const paymentId = `PSO_TEST_PAY_${Date.now()}`;
    res.json({
      success: true,
      data: {
        paymentId,
        amount: order.total,
        currency: 'INR',
        orderId: order._id,
        testMode: true,
        message: 'Sandbox / Test Mode Active. You can complete this payment using simulated confirmation.',
      },
    });
  } catch {
    res.status(500).json({ success: false, message: 'Payment initialization failed.' });
  }
});

// Confirm payment (webhook simulation or direct confirmation)
router.post('/confirm', authenticate, async (req: any, res) => {
  try {
    const { orderId, paymentId } = req.body;
    const order = await Order.findOne({ _id: orderId, customer: req.user._id });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    order.paymentStatus = 'paid';
    order.paymentId = paymentId || `PSO_VERIFIED_${Date.now()}`;
    order.status = 'confirmed';
    await order.save();
    res.json({ success: true, message: 'Payment confirmed successfully.', data: order });
  } catch {
    res.status(500).json({ success: false, message: 'Payment confirmation failed.' });
  }
});

export default router;
