import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  product: mongoose.Types.ObjectId;
  customer: mongoose.Types.ObjectId;
  rating: number;
  title?: string;
  body: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  isApproved: boolean;
  helpfulVotes: number;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  customer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String, maxlength: 100 },
  body: { type: String, required: true, maxlength: 2000 },
  images: [String],
  isVerifiedPurchase: { type: Boolean, default: false },
  isApproved: { type: Boolean, default: false },
  helpfulVotes: { type: Number, default: 0 },
}, { timestamps: true });

reviewSchema.index({ product: 1, isApproved: 1 });
reviewSchema.index({ customer: 1 });
reviewSchema.index({ product: 1, customer: 1 }, { unique: true });

export const Review = mongoose.model<IReview>('Review', reviewSchema);
