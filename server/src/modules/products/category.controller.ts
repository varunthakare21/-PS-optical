import { Request, Response } from 'express';
import { Category } from '../../models/Category';

export const getCategories = async (_req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ sortOrder: 1 }).lean();
    res.json({ success: true, data: categories });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch categories.' });
  }
};

export const getCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const category = await Category.findOne({ slug: req.params.slug, isActive: true }).lean();
    if (!category) {
      res.status(404).json({ success: false, message: 'Category not found.' });
      return;
    }
    res.json({ success: true, data: category });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch category.' });
  }
};
