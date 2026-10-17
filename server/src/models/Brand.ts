import mongoose, { Schema, Document } from 'mongoose';

export interface IBrand extends Document {
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  isActive: boolean;
  isPremium: boolean;
  sortOrder: number;
}

const brandSchema = new Schema<IBrand>({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  logo: String,
  description: String,
  isActive: { type: Boolean, default: true },
  isPremium: { type: Boolean, default: false },
  sortOrder: { type: Number, default: 0 },
}, { timestamps: true });

export const Brand = mongoose.model<IBrand>('Brand', brandSchema);
