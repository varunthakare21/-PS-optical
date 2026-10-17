import mongoose, { Schema, Document } from 'mongoose';

export interface ITryAtHome extends Document {
  customer: mongoose.Types.ObjectId;
  products: mongoose.Types.ObjectId[];
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  preferredDate: Date;
  timeSlot: string;
  status: 'requested' | 'confirmed' | 'dispatched' | 'delivered' | 'returned' | 'cancelled';
  customerName: string;
  customerPhone: string;
  notes?: string;
  assignedStore?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const tryAtHomeSchema = new Schema<ITryAtHome>({
  customer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  deliveryAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
  },
  preferredDate: { type: Date, required: true },
  timeSlot: { type: String, required: true },
  status: { type: String, enum: ['requested', 'confirmed', 'dispatched', 'delivered', 'returned', 'cancelled'], default: 'requested' },
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  notes: String,
  assignedStore: { type: Schema.Types.ObjectId, ref: 'Store' },
}, { timestamps: true });

export const TryAtHome = mongoose.model<ITryAtHome>('TryAtHome', tryAtHomeSchema);
