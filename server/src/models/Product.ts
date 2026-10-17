import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription?: string;
  category: mongoose.Types.ObjectId;
  brand: mongoose.Types.ObjectId;
  images: string[];
  frameShape: string;
  frameMaterial: string;
  frameColor: string[];
  frameSize: 'narrow' | 'medium' | 'wide' | 'extra-wide';
  gender: 'men' | 'women' | 'unisex' | 'kids';
  lensWidth: number;
  bridgeWidth: number;
  templeLength: number;
  weight?: number;
  basePrice: number;
  salePrice?: number;
  costPrice?: number;
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  isBestseller: boolean;
  isNewArrival: boolean;
  supportedLensTypes: string[];
  prescriptionCompatible: boolean;
  virtualTryOnAsset?: string;
  averageRating: number;
  reviewCount: number;
  warranty?: string;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  sku: { type: String, required: true, unique: true, uppercase: true },
  description: { type: String, required: true },
  shortDescription: String,
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  brand: { type: Schema.Types.ObjectId, ref: 'Brand', required: true },
  images: [String],
  frameShape: { type: String, required: true },
  frameMaterial: { type: String, required: true },
  frameColor: [String],
  frameSize: { type: String, enum: ['narrow', 'medium', 'wide', 'extra-wide'], default: 'medium' },
  gender: { type: String, enum: ['men', 'women', 'unisex', 'kids'], default: 'unisex' },
  lensWidth: Number,
  bridgeWidth: Number,
  templeLength: Number,
  weight: Number,
  basePrice: { type: Number, required: true, min: 0 },
  salePrice: { type: Number, min: 0 },
  costPrice: { type: Number, min: 0 },
  tags: [String],
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  isBestseller: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  supportedLensTypes: [String],
  prescriptionCompatible: { type: Boolean, default: true },
  virtualTryOnAsset: String,
  averageRating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  warranty: String,
}, { timestamps: true });

productSchema.index({ category: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ gender: 1 });
productSchema.index({ basePrice: 1 });
productSchema.index({ isActive: 1, isFeatured: 1 });
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

export const Product = mongoose.model<IProduct>('Product', productSchema);
