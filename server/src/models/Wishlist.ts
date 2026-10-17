import mongoose, { Schema, Document } from 'mongoose';

export interface IWishlist extends Document {
  customer: mongoose.Types.ObjectId;
  products: mongoose.Types.ObjectId[];
  updatedAt: Date;
}

const wishlistSchema = new Schema<IWishlist>({
  customer: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
}, { timestamps: true });

export const Wishlist = mongoose.model<IWishlist>('Wishlist', wishlistSchema);
