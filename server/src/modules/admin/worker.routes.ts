import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { User } from '../../models/User';
import { Appointment } from '../../models/Appointment';
import { TryAtHome } from '../../models/TryAtHome';
import { Order } from '../../models/Order';
import { Inventory } from '../../models/Inventory';
import bcrypt from 'bcryptjs';

const router = Router();
router.use(authenticate);

// Admin only: create optical worker account
router.post('/create', authorize('admin'), async (req: any, res) => {
  try {
    const { name, email, password, storeId, phone } = req.body;
    if (!name || !email || !password || !storeId) {
      return res.status(400).json({ success: false, message: 'Name, email, password, and assigned store are required.' });
    }
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }
    const passwordHash = await bcrypt.hash(password, 12);
    const worker = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      passwordHash,
      role: 'worker',
      accountStatus: 'active',
      emailVerified: true,
      storeId,
    });
    res.status(201).json({
      success: true,
      data: { id: worker._id, name: worker.name, email: worker.email, storeId: worker.storeId },
    });
  } catch (e: any) {
    res.status(400).json({ success: false, message: e.message });
  }
});

// Admin only: list all workers
router.get('/all', authorize('admin'), async (_req, res) => {
  try {
    const workers = await User.find({ role: 'worker' })
      .select('-passwordHash -resetToken')
      .populate('storeId', 'name address')
      .lean();
    res.json({ success: true, data: workers });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch workers.' });
  }
});

// Worker dashboard summary
router.get('/dashboard', authorize('worker'), async (req: any, res) => {
  try {
    const storeId = req.user.storeId;
    const [appointments, tryAtHome, lowStock] = await Promise.all([
      Appointment.find({ store: storeId, status: { $in: ['scheduled', 'confirmed'] } })
        .populate('customer', 'name phone email')
        .sort({ date: 1 })
        .limit(10)
        .lean(),
      TryAtHome.find({ assignedStore: storeId, status: { $in: ['requested', 'confirmed'] } })
        .populate('products', 'name images')
        .limit(10)
        .lean(),
      Inventory.find({ store: storeId, quantityAvailable: { $lte: 5 } })
        .populate('product', 'name sku')
        .limit(10)
        .lean(),
    ]);
    res.json({ success: true, data: { appointments, tryAtHome, lowStock, storeId } });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch worker dashboard data.' });
  }
});

// Worker: view inventory for assigned store
router.get('/inventory', authorize('worker'), async (req: any, res) => {
  try {
    const storeId = req.user.storeId;
    const inventory = await Inventory.find({ store: storeId })
      .populate('product', 'name sku images basePrice')
      .lean();
    res.json({ success: true, data: inventory });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch store inventory.' });
  }
});

// Worker: update inventory quantities
router.patch('/inventory/:id', authorize('worker'), async (req: any, res) => {
  try {
    const inv = await Inventory.findOne({ _id: req.params.id, store: req.user.storeId });
    if (!inv) return res.status(404).json({ success: false, message: 'Inventory item not found for your assigned store.' });
    const { quantityAvailable, quantityTotal } = req.body;
    if (quantityAvailable !== undefined) inv.quantityAvailable = quantityAvailable;
    if (quantityTotal !== undefined) inv.quantityTotal = quantityTotal;
    await inv.save();
    res.json({ success: true, data: inv });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to update inventory.' });
  }
});

export default router;
