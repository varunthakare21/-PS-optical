import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  name: string;
  image: string;
  color: string;
  size: string;
  lensType?: string;
  lensOptions?: string[];
  prescriptionId?: mongoose.Types.ObjectId;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface IOrder extends Document {
  orderNumber: string;
  customer: mongoose.Types.ObjectId;
  items: IOrderItem[];
  shippingAddress: {
    name: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  subtotal: number;
  shippingFee: number;
  tax: number;
  discount: number;
  couponCode?: string;
  total: number;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded' | 'partial_refund';
  paymentId?: string;
  status: 'pending_payment' | 'confirmed' | 'processing' | 'ready_for_dispatch' | 'shipped' | 'delivered' | 'cancelled' | 'return_requested' | 'returned' | 'refunded';
  trackingNumber?: string;
  notes?: string;
  estimatedDelivery?: Date;
  deliveredAt?: Date;
  cancelledAt?: Date;
  cancelReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>({
  orderNumber: { type: String, required: true, unique: true },
  customer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    name: String,
    image: String,
    color: String,
    size: String,
    lensType: String,
    lensOptions: [String],
    prescriptionId: { type: Schema.Types.ObjectId, ref: 'Prescription' },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
  }],
  shippingAddress: {
    name: String,
    phone: String,
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: { type: String, default: 'India' },
  },
  subtotal: { type: Number, required: true },
  shippingFee: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  couponCode: String,
  total: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded', 'partial_refund'], default: 'pending' },
  paymentId: String,
  status: { type: String, enum: ['pending_payment', 'confirmed', 'processing', 'ready_for_dispatch', 'shipped', 'delivered', 'cancelled', 'return_requested', 'returned', 'refunded'], default: 'pending_payment' },
  trackingNumber: String,
  notes: String,
  estimatedDelivery: Date,
  deliveredAt: Date,
  cancelledAt: Date,
  cancelReason: String,
}, { timestamps: true });

orderSchema.index({ customer: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

export const Order = mongoose.model<IOrder>('Order', orderSchema);
