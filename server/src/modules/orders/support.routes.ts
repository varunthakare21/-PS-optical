import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { SupportTicket } from '../../models/SupportTicket';

const router = Router();

router.post('/', authenticate, authorize('customer'), async (req: any, res) => {
  try {
    const { subject, category, message, relatedOrder } = req.body;
    const ticket = await SupportTicket.create({
      customer: req.user._id,
      subject,
      category: category || 'general',
      messages: [{ sender: req.user._id, senderRole: 'customer', content: message }],
      relatedOrder,
    });
    res.status(201).json({ success: true, data: ticket });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to create support ticket.' });
  }
});

router.get('/my-tickets', authenticate, authorize('customer'), async (req: any, res) => {
  try {
    const tickets = await SupportTicket.find({ customer: req.user._id }).sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: tickets });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch tickets.' });
  }
});

export default router;
