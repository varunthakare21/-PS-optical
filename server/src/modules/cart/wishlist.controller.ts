import { Response } from 'express';
import { Wishlist } from '../../models/Wishlist';
import { AuthRequest } from '../../middleware/auth.middleware';

export const getWishlist = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const wishlist = await Wishlist.findOne({ customer: req.user._id })
      .populate('products', 'name images basePrice salePrice slug averageRating')
      .lean();
    res.json({ success: true, data: wishlist || { products: [] } });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch wishlist.' });
  }
};

export const addToWishlist = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let wishlist = await Wishlist.findOne({ customer: req.user._id });
    if (!wishlist) wishlist = new Wishlist({ customer: req.user._id, products: [] });
    if (!wishlist.products.includes(req.params.productId as any)) {
      wishlist.products.push(req.params.productId as any);
      await wishlist.save();
    }
    res.json({ success: true, message: 'Added to wishlist.' });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to update wishlist.' });
  }
};

export const removeFromWishlist = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const wishlist = await Wishlist.findOne({ customer: req.user._id });
    if (wishlist) {
      wishlist.products = wishlist.products.filter((p) => p.toString() !== req.params.productId) as any;
      await wishlist.save();
    }
    res.json({ success: true, message: 'Removed from wishlist.' });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to update wishlist.' });
  }
};
