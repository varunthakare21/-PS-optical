import mongoose, { Schema, Document } from 'mongoose';

export interface IAppointment extends Document {
  customer: mongoose.Types.ObjectId;
  store: mongoose.Types.ObjectId;
  date: Date;
  timeSlot: string;
  type: 'eye_test' | 'try_at_home' | 'consultation' | 'repair';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  notes?: string;
  assignedWorker?: mongoose.Types.ObjectId;
  cancellationReason?: string;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const appointmentSchema = new Schema<IAppointment>({
  customer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  store: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true },
  type: { type: String, enum: ['eye_test', 'try_at_home', 'consultation', 'repair'], default: 'eye_test' },
  status: { type: String, enum: ['scheduled', 'confirmed', 'completed', 'cancelled', 'no_show'], default: 'scheduled' },
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  customerEmail: { type: String, required: true },
  notes: String,
  assignedWorker: { type: Schema.Types.ObjectId, ref: 'User' },
  cancellationReason: String,
  completedAt: Date,
}, { timestamps: true });

appointmentSchema.index({ store: 1, date: 1, timeSlot: 1 });
appointmentSchema.index({ customer: 1 });
appointmentSchema.index({ status: 1 });

export const Appointment = mongoose.model<IAppointment>('Appointment', appointmentSchema);
