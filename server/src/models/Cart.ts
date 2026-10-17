import mongoose, { Schema, Document } from 'mongoose';

export interface ICartItem {
  product: mongoose.Types.ObjectId;
  color: string;
  size: string;
  lensType?: string;
  lensOptions?: string[];
  prescriptionId?: mongoose.Types.ObjectId;
  quantity: number;
  unitPrice: number;
}

export interface ICart extends Document {
  user?: mongoose.Types.ObjectId;
  sessionId?: string;
  items: ICartItem[];
  couponCode?: string;
  expiresAt?: Date;
  updatedAt: Date;
}

const cartSchema = new Schema<ICart>({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  sessionId: String,
  items: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    color: { type: String, required: true },
    size: { type: String, required: true },
    lensType: String,
    lensOptions: [String],
    prescriptionId: { type: Schema.Types.ObjectId, ref: 'Prescription' },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    unitPrice: { type: Number, required: true },
  }],
  couponCode: String,
  expiresAt: { type: Date, default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
}, { timestamps: true });

cartSchema.index({ user: 1 });
cartSchema.index({ sessionId: 1 });
cartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Cart = mongoose.model<ICart>('Cart', cartSchema);
