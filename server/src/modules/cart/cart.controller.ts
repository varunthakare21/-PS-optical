import { Request, Response } from 'express';
import { Cart } from '../../models/Cart';
import { Product } from '../../models/Product';
import { Coupon } from '../../models/Coupon';
import { AuthRequest } from '../../middleware/auth.middleware';

const getCartFilter = (req: AuthRequest) => {
  if (req.user) return { user: req.user._id };
  const sessionId = req.cookies?.sessionId || req.headers['x-session-id'];
  if (sessionId) return { sessionId };
  return null;
};

export const getCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const filter = getCartFilter(req);
    if (!filter) { res.json({ success: true, data: { items: [] } }); return; }
    const cart = await Cart.findOne(filter).populate('items.product', 'name images basePrice salePrice slug isActive').lean();
    res.json({ success: true, data: cart || { items: [] } });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch cart.' });
  }
};

export const addToCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { productId, color, size, quantity = 1, lensType, lensOptions, prescriptionId } = req.body;
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      res.status(404).json({ success: false, message: 'Product not found or unavailable.' });
      return;
    }
    const filter = getCartFilter(req);
    if (!filter) {
      res.status(400).json({ success: false, message: 'Session not identified.' });
      return;
    }
    let cart = await Cart.findOne(filter);
    if (!cart) {
      cart = new Cart({ ...filter, items: [] });
    }
    const existingIdx = cart.items.findIndex(
      (i: any) => i.product.toString() === productId && i.color === color && i.size === size && i.lensType === lensType
    );
    if (existingIdx > -1) {
      cart.items[existingIdx].quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        color,
        size,
        lensType,
        lensOptions,
        prescriptionId,
        quantity,
        unitPrice: product.salePrice || product.basePrice,
      } as any);
    }
    await cart.save();
    res.json({ success: true, message: 'Item added to cart.', data: cart });
  } catch (error) {
    console.error('[addToCart]', error);
    res.status(500).json({ success: false, message: 'Failed to add item.' });
  }
};

export const updateCartItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { quantity } = req.body;
    const filter = getCartFilter(req);
    if (!filter) { res.status(400).json({ success: false, message: 'Not authorized.' }); return; }
    const cart = await Cart.findOne(filter);
    if (!cart) { res.status(404).json({ success: false, message: 'Cart not found.' }); return; }
    const item = cart.items.find((i: any) => i._id.toString() === req.params.itemId);
    if (!item) { res.status(404).json({ success: false, message: 'Item not found.' }); return; }
    if (quantity <= 0) {
      cart.items = cart.items.filter((i: any) => i._id.toString() !== req.params.itemId) as any;
    } else {
      item.quantity = quantity;
    }
    await cart.save();
    res.json({ success: true, data: cart });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to update cart.' });
  }
};

export const removeCartItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const filter = getCartFilter(req);
    if (!filter) { res.status(400).json({ success: false, message: 'Not authorized.' }); return; }
    const cart = await Cart.findOne(filter);
    if (!cart) { res.status(404).json({ success: false, message: 'Cart not found.' }); return; }
    cart.items = cart.items.filter((i: any) => i._id.toString() !== req.params.itemId) as any;
    await cart.save();
    res.json({ success: true, data: cart });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to remove item.' });
  }
};

export const clearCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await Cart.deleteOne({ user: req.user._id });
    res.json({ success: true, message: 'Cart cleared.' });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to clear cart.' });
  }
};

export const applyCoupon = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { code, subtotal } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    if (!coupon) {
      res.status(404).json({ success: false, message: 'Coupon not found or expired.' });
      return;
    }
    const now = new Date();
    if (now < coupon.validFrom || now > coupon.validUntil) {
      res.status(400).json({ success: false, message: 'Coupon is not valid at this time.' });
      return;
    }
    if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
      res.status(400).json({ success: false, message: 'Coupon usage limit reached.' });
      return;
    }
    if (subtotal < coupon.minOrderAmount) {
      res.status(400).json({ success: false, message: `Minimum order amount of ₹${coupon.minOrderAmount} required.` });
      return;
    }
    let discount = coupon.type === 'percentage' ? (subtotal * coupon.value) / 100 : coupon.value;
    if (coupon.maxDiscount && discount > coupon.maxDiscount) discount = coupon.maxDiscount;
    res.json({ success: true, discount, message: `Coupon applied! You save ₹${discount.toFixed(2)}` });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to apply coupon.' });
  }
};
