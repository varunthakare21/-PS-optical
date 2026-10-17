import mongoose, { Schema, Document } from 'mongoose';

export interface IReturn extends Document {
  order: mongoose.Types.ObjectId;
  customer: mongoose.Types.ObjectId;
  reason: string;
  description?: string;
  images?: string[];
  status: 'requested' | 'approved' | 'rejected' | 'picked_up' | 'received' | 'refund_initiated' | 'refunded';
  refundAmount?: number;
  refundMethod?: string;
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const returnSchema = new Schema<IReturn>({
  order: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  customer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  reason: { type: String, required: true },
  description: String,
  images: [String],
  status: { type: String, enum: ['requested', 'approved', 'rejected', 'picked_up', 'received', 'refund_initiated', 'refunded'], default: 'requested' },
  refundAmount: Number,
  refundMethod: String,
  adminNotes: String,
}, { timestamps: true });

export const Return = mongoose.model<IReturn>('Return', returnSchema);
