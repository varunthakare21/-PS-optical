import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, ArrowRight, ShieldCheck, Tag, ShoppingBag } from 'lucide-react';
import { useCart } from '../features/cart/CartContext';
import { useAuth } from '../features/auth/AuthContext';
import { useToast } from '../components/ui/Toaster';

export default function CartPage() {
  const { cart, updateItem, removeItem, subtotal } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);

  const shippingFee = subtotal > 1999 ? 0 : 150;
  const estimatedTax = Math.round(subtotal * 0.18 * 100) / 100;
  const grandTotal = Math.max(0, subtotal + shippingFee + estimatedTax - discount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const code = couponCode.trim().toUpperCase();
    if (code === 'WELCOME15') {
      const disc = Math.round(subtotal * 0.15);
      setDiscount(disc);
      setCouponApplied(true);
      showToast('15% WELCOME coupon applied!', 'success');
    } else if (code === 'PSO500' && subtotal >= 2999) {
      setDiscount(500);
      setCouponApplied(true);
      showToast('₹500 flat discount applied!', 'success');
    } else {
      showToast('Invalid or inapplicable coupon code.', 'error');
    }
  };

  const handleProceedToCheckout = () => {
    if (!user) {
      showToast('Please sign in or create an account to checkout.', 'info');
      navigate('/customer/login?redirect=/checkout');
      return;
    }
    navigate('/checkout', { state: { discount, couponCode: couponApplied ? couponCode : undefined } });
  };

  if (!cart?.items || cart.items.length === 0) {
    return (
      <div style={{ maxWidth: 800, margin: '4rem auto', textAlign: 'center', padding: '3rem 1.5rem', background: 'white', borderRadius: 16 }}>
        <div style={{ display: 'inline-flex', padding: '1.5rem', borderRadius: '50%', background: '#F6F1E8', marginBottom: '1.5rem' }}>
          <ShoppingBag size={48} style={{ color: '#B65E43' }} />
        </div>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.75rem', color: '#30251F', margin: '0 0 0.5rem' }}>
          Your Shopping Cart is Empty
        </h2>
        <p style={{ fontFamily: 'Inter, sans-serif', color: '#72785A', margin: '0 0 2rem' }}>
          Discover eyewear that brings together your vision, your personality, and your style.
        </p>
        <Link
          to="/eyeglasses"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: '#B65E43', color: 'white', textDecoration: 'none',
            padding: '0.85rem 2rem', borderRadius: 6, fontFamily: 'Inter, sans-serif',
            fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase',
          }}
        >
          Explore Frames <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '2rem 1.5rem 5rem' }}>
      <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '2.25rem', color: '#30251F', marginBottom: '2rem' }}>
        Shopping Cart ({cart.items.length} {cart.items.length === 1 ? 'item' : 'items'})
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: '3rem' }} className="grid-cols-1! lg:grid-cols-2!">
        {/* Left: Cart Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {cart.items.map((item) => {
            const product = item.product;
            return (
              <motion.div
                key={item._id}
                layout
                style={{
                  background: 'white', borderRadius: 12, padding: '1.25rem',
                  display: 'flex', gap: '1.25rem', border: '1px solid #F0EAE0',
                  boxShadow: '0 2px 10px rgba(48,37,31,0.03)',
                }}
              >
                <div style={{ width: 100, height: 80, background: '#F6F1E8', borderRadius: 8, padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {product?.images?.[0] ? (
                    <img src={product.images[0]} alt="" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                  ) : null}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Link to={`/products/${product?.slug}`} style={{ textDecoration: 'none', color: '#30251F' }}>
                      <h3 style={{ margin: 0, fontFamily: 'Inter, sans-serif', fontSize: '0.95rem', fontWeight: 600 }}>
                        {product?.name || 'Optical Frame'}
                      </h3>
                    </Link>
                    <button
                      onClick={() => removeItem(item._id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#A89C8C', padding: 4 }}
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <p style={{ margin: '4px 0 0', fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#72785A' }}>
                    Colour: {item.color} · Size: {item.size}
                  </p>
                  {item.lensType && (
                    <p style={{ margin: '2px 0 0', fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#B65E43', fontWeight: 500 }}>
                      Lens: {item.lensType}
                    </p>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #E8E0D0', borderRadius: 6, padding: '2px 6px' }}>
                      <button
                        onClick={() => updateItem(item._id, item.quantity - 1)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px', fontSize: '1rem', color: '#4A3A33' }}
                      >
                        -
                      </button>
                      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', fontWeight: 600, minWidth: 16, textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateItem(item._id, item.quantity + 1)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px', fontSize: '1rem', color: '#4A3A33' }}
                      >
                        +
                      </button>
                    </div>

                    <span style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', fontWeight: 700, color: '#30251F' }}>
                      ₹{(item.unitPrice * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Right: Order Summary */}
        <div>
          <div style={{ background: 'white', borderRadius: 14, padding: '1.75rem', border: '1px solid #F0EAE0', boxShadow: '0 4px 20px rgba(48,37,31,0.05)' }}>
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', color: '#30251F', margin: '0 0 1.25rem' }}>
              Order Summary
            </h3>

            {/* Coupon input */}
            <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <input
                type="text"
                placeholder="Enter promo code (e.g. WELCOME15)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                style={{ flex: 1, padding: '0.65rem 0.85rem', borderRadius: 6, border: '1px solid #D8CFC4', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', outline: 'none' }}
              />
              <button
                type="submit"
                style={{ padding: '0.65rem 1rem', background: '#30251F', color: '#F6F1E8', border: 'none', borderRadius: 6, fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Apply
              </button>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderBottom: '1px solid #E8E0D0', paddingBottom: '1.25rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#72785A' }}>
                <span>Subtotal</span>
                <span style={{ color: '#30251F', fontWeight: 500 }}>₹{subtotal.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#72785A' }}>
                <span>Shipping</span>
                <span>{shippingFee === 0 ? <strong style={{ color: '#72785A' }}>FREE</strong> : `₹${shippingFee}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#72785A' }}>
                <span>Estimated GST (18%)</span>
                <span>₹{estimatedTax.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#B65E43', fontWeight: 600 }}>
                  <span>Discount</span>
                  <span>-₹{discount.toLocaleString()}</span>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.5rem' }}>
              <span style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', fontWeight: 700, color: '#30251F' }}>
                Grand Total
              </span>
              <span style={{ fontFamily: 'Georgia, serif', fontSize: '1.5rem', fontWeight: 700, color: '#B65E43' }}>
                ₹{grandTotal.toLocaleString()}
              </span>
            </div>

            <button
              onClick={handleProceedToCheckout}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                background: '#B65E43', color: 'white', padding: '0.95rem', borderRadius: 7, border: 'none',
                fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase',
                letterSpacing: '0.04em', cursor: 'pointer', transition: 'background 0.2s',
              }}
            >
              Proceed to Checkout <ArrowRight size={17} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1.25rem', color: '#72785A', fontSize: '0.75rem' }}>
              <ShieldCheck size={16} /> 256-Bit SSL Encrypted &amp; Secure Checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
