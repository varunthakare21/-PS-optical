import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Product } from '../../models/Product';
import { Category } from '../../models/Category';
import { Brand } from '../../models/Brand';
import { createPaginationMeta, paginateResults } from '../../utils/helpers';

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(48, parseInt(req.query.limit as string) || 12);
    const { skip } = paginateResults(page, limit);

    const filter: any = { isActive: true };

    if (req.query.category) {
      const catParam = req.query.category as string;
      if (mongoose.Types.ObjectId.isValid(catParam)) {
        filter.category = catParam;
      } else {
        const foundCategory = await Category.findOne({ slug: catParam });
        if (foundCategory) {
          filter.category = foundCategory._id;
        } else {
          filter.category = new mongoose.Types.ObjectId(); // No match
        }
      }
    }

    if (req.query.brand) {
      const brandParam = req.query.brand as string;
      if (mongoose.Types.ObjectId.isValid(brandParam)) {
        filter.brand = brandParam;
      } else {
        const foundBrand = await Brand.findOne({ slug: brandParam });
        if (foundBrand) {
          filter.brand = foundBrand._id;
        } else {
          filter.brand = new mongoose.Types.ObjectId(); // No match
        }
      }
    }
    if (req.query.gender) filter.gender = req.query.gender;
    if (req.query.frameShape) filter.frameShape = req.query.frameShape;
    if (req.query.frameMaterial) filter.frameMaterial = req.query.frameMaterial;
    if (req.query.frameSize) filter.frameSize = req.query.frameSize;
    if (req.query.minPrice || req.query.maxPrice) {
      filter.basePrice = {};
      if (req.query.minPrice) filter.basePrice.$gte = parseFloat(req.query.minPrice as string);
      if (req.query.maxPrice) filter.basePrice.$lte = parseFloat(req.query.maxPrice as string);
    }
    if (req.query.q) {
      filter.$text = { $search: req.query.q as string };
    }

    const sortMap: Record<string, any> = {
      price_asc: { basePrice: 1 },
      price_desc: { basePrice: -1 },
      newest: { createdAt: -1 },
      rating: { averageRating: -1 },
      popular: { reviewCount: -1 },
    };
    const sort = sortMap[req.query.sort as string] || { createdAt: -1 };

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('category', 'name slug')
        .populate('brand', 'name slug logo')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: products,
      pagination: createPaginationMeta(total, page, limit),
    });
  } catch (error) {
    console.error('[getProducts]', error);
    res.status(500).json({ success: false, message: 'Failed to fetch products.' });
  }
};

export const getProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true })
      .populate('category', 'name slug')
      .populate('brand', 'name slug logo isPremium')
      .lean();
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found.' });
      return;
    }
    res.json({ success: true, data: product });
  } catch (error) {
    console.error('[getProduct]', error);
    res.status(500).json({ success: false, message: 'Failed to fetch product.' });
  }
};

export const searchProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const q = (req.query.q as string)?.trim();
    if (!q || q.length < 2) {
      res.json({ success: true, data: [] });
      return;
    }
    const products = await Product.find(
      { $text: { $search: q }, isActive: true },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(10)
      .populate('category', 'name slug')
      .lean();
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Search failed.' });
  }
};

export const getFeatured = async (_req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find({ isActive: true, isFeatured: true })
      .populate('category', 'name slug')
      .populate('brand', 'name slug')
      .limit(8)
      .lean();
    res.json({ success: true, data: products });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch featured products.' });
  }
};

export const getBestsellers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find({ isActive: true, isBestseller: true })
      .populate('category', 'name slug')
      .populate('brand', 'name slug')
      .limit(8)
      .lean();
    res.json({ success: true, data: products });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch bestsellers.' });
  }
};

export const getNewArrivals = async (_req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find({ isActive: true, isNewArrival: true })
      .populate('category', 'name slug')
      .populate('brand', 'name slug')
      .sort({ createdAt: -1 })
      .limit(8)
      .lean();
    res.json({ success: true, data: products });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch new arrivals.' });
  }
};
