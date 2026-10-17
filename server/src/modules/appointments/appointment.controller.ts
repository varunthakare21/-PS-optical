import { Request, Response } from 'express';
import { Appointment } from '../../models/Appointment';
import { Store } from '../../models/Store';
import { AuthRequest } from '../../middleware/auth.middleware';

export const bookAppointment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { storeId, date, timeSlot, type, customerName, customerPhone, notes } = req.body;
    const store = await Store.findById(storeId);
    if (!store) { res.status(404).json({ success: false, message: 'Store not found.' }); return; }
    // Check slot availability
    const apptDate = new Date(date);
    const startOfDay = new Date(apptDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(apptDate.setHours(23, 59, 59, 999));
    const existing = await Appointment.countDocuments({
      store: storeId,
      date: { $gte: startOfDay, $lte: endOfDay },
      timeSlot,
      status: { $nin: ['cancelled'] },
    });
    if (existing >= store.maxAppointmentsPerSlot) {
      res.status(409).json({ success: false, message: 'This slot is no longer available.' }); return;
    }
    const appointment = await Appointment.create({
      customer: req.user._id,
      store: storeId,
      date: new Date(date),
      timeSlot,
      type: type || 'eye_test',
      customerName,
      customerPhone,
      customerEmail: req.user.email,
      notes,
    });
    res.status(201).json({ success: true, data: appointment });
  } catch (error) {
    console.error('[bookAppointment]', error);
    res.status(500).json({ success: false, message: 'Failed to book appointment.' });
  }
};

export const getMyAppointments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const appointments = await Appointment.find({ customer: req.user._id })
      .populate('store', 'name address phone')
      .sort({ date: -1 })
      .lean();
    res.json({ success: true, data: appointments });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch appointments.' });
  }
};

export const cancelAppointment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const appt = await Appointment.findOne({ _id: req.params.id, customer: req.user._id });
    if (!appt) { res.status(404).json({ success: false, message: 'Appointment not found.' }); return; }
    if (appt.status === 'completed') {
      res.status(400).json({ success: false, message: 'Cannot cancel a completed appointment.' }); return;
    }
    appt.status = 'cancelled';
    appt.cancellationReason = req.body.reason || 'Cancelled by customer';
    await appt.save();
    res.json({ success: true, message: 'Appointment cancelled.' });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to cancel appointment.' });
  }
};
