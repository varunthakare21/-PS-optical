import { Request, Response } from 'express';
import { Review } from '../../models/Review';
import { Product } from '../../models/Product';
import { AuthRequest } from '../../middleware/auth.middleware';

export const getProductReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const reviews = await Review.find({ product: req.params.productId, isApproved: true })
      .populate('customer', 'name avatar')
      .sort({ createdAt: -1 })
      .lean();
    res.json({ success: true, data: reviews });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch reviews.' });
  }
};

export const createReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { productId, rating, title, body } = req.body;
    const existing = await Review.findOne({ product: productId, customer: req.user._id });
    if (existing) {
      res.status(409).json({ success: false, message: 'You have already reviewed this product.' });
      return;
    }
    const review = await Review.create({
      product: productId,
      customer: req.user._id,
      rating,
      title,
      body,
      isApproved: false,
    });
    // Recalculate product rating
    const allReviews = await Review.find({ product: productId, isApproved: true });
    const avg = allReviews.length ? allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length : 0;
    await Product.findByIdAndUpdate(productId, { averageRating: avg, reviewCount: allReviews.length });
    res.status(201).json({ success: true, data: review, message: 'Review submitted and pending approval.' });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to submit review.' });
  }
};
