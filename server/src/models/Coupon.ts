import mongoose, { Schema, Document } from 'mongoose';

export interface ICoupon extends Document {
  code: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderAmount: number;
  maxDiscount?: number;
  usageLimit: number;
  usedCount: number;
  perUserLimit: number;
  isActive: boolean;
  validFrom: Date;
  validUntil: Date;
  applicableCategories: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const couponSchema = new Schema<ICoupon>({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['percentage', 'fixed'], required: true },
  value: { type: Number, required: true, min: 0 },
  minOrderAmount: { type: Number, default: 0 },
  maxDiscount: Number,
  usageLimit: { type: Number, default: 0 },
  usedCount: { type: Number, default: 0 },
  perUserLimit: { type: Number, default: 1 },
  isActive: { type: Boolean, default: true },
  validFrom: { type: Date, required: true },
  validUntil: { type: Date, required: true },
  applicableCategories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
}, { timestamps: true });

export const Coupon = mongoose.model<ICoupon>('Coupon', couponSchema);
