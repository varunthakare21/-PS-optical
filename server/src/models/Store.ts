import mongoose, { Schema, Document } from 'mongoose';

export interface IStore extends Document {
  name: string;
  slug: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    coordinates?: { lat: number; lng: number };
  };
  phone: string;
  email?: string;
  openingHours: {
    day: string;
    open: string;
    close: string;
    closed: boolean;
  }[];
  services: string[];
  images: string[];
  isActive: boolean;
  appointmentSlotDuration: number;
  maxAppointmentsPerSlot: number;
  createdAt: Date;
  updatedAt: Date;
}

const storeSchema = new Schema<IStore>({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, default: 'India' },
    coordinates: { lat: Number, lng: Number },
  },
  phone: { type: String, required: true },
  email: String,
  openingHours: [{
    day: String,
    open: String,
    close: String,
    closed: { type: Boolean, default: false },
  }],
  services: [String],
  images: [String],
  isActive: { type: Boolean, default: true },
  appointmentSlotDuration: { type: Number, default: 30 },
  maxAppointmentsPerSlot: { type: Number, default: 2 },
}, { timestamps: true });

export const Store = mongoose.model<IStore>('Store', storeSchema);
