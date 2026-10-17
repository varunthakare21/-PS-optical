import { Request, Response } from 'express';
import { Store } from '../../models/Store';
import { Appointment } from '../../models/Appointment';

export const getStores = async (req: Request, res: Response): Promise<void> => {
  try {
    const filter: any = { isActive: true };
    if (req.query.city) filter['address.city'] = new RegExp(req.query.city as string, 'i');
    if (req.query.pincode) filter['address.pincode'] = req.query.pincode;
    const stores = await Store.find(filter).lean();
    res.json({ success: true, data: stores });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch stores.' });
  }
};

export const getStore = async (req: Request, res: Response): Promise<void> => {
  try {
    const store = await Store.findById(req.params.id).lean();
    if (!store) { res.status(404).json({ success: false, message: 'Store not found.' }); return; }
    res.json({ success: true, data: store });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch store.' });
  }
};

export const getStoreAvailability = async (req: Request, res: Response): Promise<void> => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) { res.status(404).json({ success: false, message: 'Store not found.' }); return; }
    const date = req.query.date ? new Date(req.query.date as string) : new Date();
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));
    const bookedAppointments = await Appointment.find({
      store: store._id,
      date: { $gte: startOfDay, $lte: endOfDay },
      status: { $nin: ['cancelled'] },
    }).select('timeSlot');
    const bookedSlots = bookedAppointments.map((a) => a.timeSlot);
    const timeSlots = [];
    for (let h = 9; h < 18; h++) {
      for (let m = 0; m < 60; m += store.appointmentSlotDuration) {
        const slot = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
        const count = bookedSlots.filter((s) => s === slot).length;
        timeSlots.push({ time: slot, available: count < store.maxAppointmentsPerSlot });
      }
    }
    res.json({ success: true, data: { date: date.toISOString().split('T')[0], slots: timeSlots } });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch availability.' });
  }
};
