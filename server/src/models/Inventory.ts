import mongoose, { Schema, Document } from 'mongoose';

export interface IInventory extends Document {
  product: mongoose.Types.ObjectId;
  store: mongoose.Types.ObjectId;
  color: string;
  size: string;
  quantityAvailable: number;
  quantityReserved: number;
  quantityTotal: number;
  lowStockThreshold: number;
  sku: string;
  updatedAt: Date;
}

const inventorySchema = new Schema<IInventory>({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  store: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
  color: { type: String, required: true },
  size: { type: String, required: true },
  quantityAvailable: { type: Number, default: 0, min: 0 },
  quantityReserved: { type: Number, default: 0, min: 0 },
  quantityTotal: { type: Number, default: 0, min: 0 },
  lowStockThreshold: { type: Number, default: 5 },
  sku: { type: String, required: true },
}, { timestamps: true });

inventorySchema.index({ product: 1, store: 1, color: 1, size: 1 }, { unique: true });
inventorySchema.index({ store: 1 });

export const Inventory = mongoose.model<IInventory>('Inventory', inventorySchema);
