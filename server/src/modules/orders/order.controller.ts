import { Request, Response } from 'express';
import { Order } from '../../models/Order';
import { Cart } from '../../models/Cart';
import { Coupon } from '../../models/Coupon';
import { AuthRequest } from '../../middleware/auth.middleware';
import { generateOrderNumber } from '../../utils/helpers';
import { sendEmail, emailTemplates } from '../../utils/email';

export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { shippingAddress, paymentMethod, couponCode, items, subtotal, shippingFee, tax, discount, total } = req.body;

    // Delivery is available across all of Maharashtra
    if (shippingAddress?.state && !/maharashtra/i.test(shippingAddress.state)) {
      res.status(400).json({ success: false, message: 'Delivery is currently available all over Maharashtra only.' });
      return;
    }
    if (shippingAddress) {
      shippingAddress.state = shippingAddress.state || 'Maharashtra';
    }

    // Validate total server-side against submitted items
    let serverSubtotal = 0;
    for (const item of items) {
      serverSubtotal += item.unitPrice * item.quantity;
    }
    const serverShipping = shippingFee >= 0 ? shippingFee : 0;
    const serverTax = Math.round(serverSubtotal * 0.18 * 100) / 100;
    let serverDiscount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      if (coupon && new Date() >= coupon.validFrom && new Date() <= coupon.validUntil) {
        serverDiscount = coupon.type === 'percentage' ? (serverSubtotal * coupon.value) / 100 : coupon.value;
        if (coupon.maxDiscount && serverDiscount > coupon.maxDiscount) serverDiscount = coupon.maxDiscount;
        coupon.usedCount += 1;
        await coupon.save();
      }
    }
    const serverTotal = serverSubtotal + serverShipping + serverTax - serverDiscount;
    const orderNumber = generateOrderNumber();
    const order = await Order.create({
      orderNumber,
      customer: req.user._id,
      items,
      shippingAddress,
      subtotal: serverSubtotal,
      shippingFee: serverShipping,
      tax: serverTax,
      discount: serverDiscount,
      couponCode,
      total: serverTotal,
      paymentMethod,
      status: 'pending_payment',
    });
    // Clear cart
    await Cart.deleteOne({ user: req.user._id });
    // Send confirmation email
    await sendEmail({
      to: req.user.email,
      subject: `Order Confirmed #${orderNumber} — PS OPTICAL`,
      html: emailTemplates.orderConfirmation(req.user.name, orderNumber, serverTotal),
    });
    res.status(201).json({ success: true, data: order });
  } catch (error) {
    console.error('[createOrder]', error);
    res.status(500).json({ success: false, message: 'Failed to create order.' });
  }
};

export const getMyOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      Order.find({ customer: req.user._id }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Order.countDocuments({ customer: req.user._id }),
    ]);
    res.json({ success: true, data: orders, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch orders.' });
  }
};

export const getOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product', 'name images slug').lean();
    if (!order) { res.status(404).json({ success: false, message: 'Order not found.' }); return; }
    if (req.user.role === 'customer' && order.customer.toString() !== req.user._id.toString()) {
      res.status(403).json({ success: false, message: 'Access denied.' }); return;
    }
    res.json({ success: true, data: order });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch order.' });
  }
};

export const cancelOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const order = await Order.findOne({ _id: req.params.id, customer: req.user._id });
    if (!order) { res.status(404).json({ success: false, message: 'Order not found.' }); return; }
    if (!['pending_payment', 'confirmed'].includes(order.status)) {
      res.status(400).json({ success: false, message: 'Order cannot be cancelled at this stage.' }); return;
    }
    order.status = 'cancelled';
    order.cancelledAt = new Date();
    order.cancelReason = req.body.reason || 'Cancelled by customer';
    await order.save();
    res.json({ success: true, message: 'Order cancelled successfully.' });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to cancel order.' });
  }
};
