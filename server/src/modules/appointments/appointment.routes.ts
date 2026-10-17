import { Router } from 'express';
import { bookAppointment, getMyAppointments, cancelAppointment } from './appointment.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';

const router = Router();
router.post('/', authenticate, authorize('customer'), bookAppointment);
router.get('/my-appointments', authenticate, authorize('customer'), getMyAppointments);
router.patch('/:id/cancel', authenticate, authorize('customer'), cancelAppointment);

export default router;
