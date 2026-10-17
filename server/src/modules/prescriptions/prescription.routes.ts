import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { Prescription } from '../../models/Prescription';

const router = Router();

router.get('/', authenticate, authorize('customer'), async (req: any, res) => {
  try {
    const prescriptions = await Prescription.find({ customer: req.user._id }).sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: prescriptions });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch prescriptions.' });
  }
});

router.post('/', authenticate, authorize('customer'), async (req: any, res) => {
  try {
    const { rightEye, leftEye, pupillaryDistance, doctorName, prescriptionDate, notes } = req.body;
    const prescription = await Prescription.create({
      customer: req.user._id,
      rightEye,
      leftEye,
      pupillaryDistance,
      doctorName,
      prescriptionDate: prescriptionDate ? new Date(prescriptionDate) : undefined,
      notes,
    });
    res.status(201).json({ success: true, data: prescription });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to save prescription.' });
  }
});

router.get('/:id', authenticate, authorize('customer'), async (req: any, res) => {
  try {
    const prescription = await Prescription.findOne({ _id: req.params.id, customer: req.user._id }).lean();
    if (!prescription) {
      res.status(404).json({ success: false, message: 'Prescription not found.' });
      return;
    }
    res.json({ success: true, data: prescription });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch prescription.' });
  }
});

router.delete('/:id', authenticate, authorize('customer'), async (req: any, res) => {
  try {
    const prescription = await Prescription.findOneAndDelete({ _id: req.params.id, customer: req.user._id });
    if (!prescription) {
      res.status(404).json({ success: false, message: 'Prescription not found.' });
      return;
    }
    res.json({ success: true, message: 'Prescription deleted.' });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to delete prescription.' });
  }
});

export default router;
