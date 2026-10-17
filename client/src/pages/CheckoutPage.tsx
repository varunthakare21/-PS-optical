import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ShieldCheck, ArrowLeft, Lock } from 'lucide-react';
import { useCart } from '../features/cart/CartContext';
import { useAuth } from '../features/auth/AuthContext';
import { ordersAPI, paymentsAPI } from '../services/api';
import { useToast } from '../components/ui/Toaster';

const addressSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().min(10, 'Valid 10-digit mobile number required'),
  street: z.string().min(5, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required').refine(
    (val) => /maharashtra/i.test(val.trim()),
    { message: 'Delivery is currently available all over Maharashtra only.' }
  ),
  pincode: z.string().length(6, 'Valid 6-digit PIN code required').refine(
    (p) => /^4[0-4]\d{4}$/.test(p),
    { message: 'Delivery is available across Maharashtra PIN codes (40xxxx to 44xxxx).' }
  ),
  paymentMethod: z.enum(['card', 'upi', 'cod']),
});

type Form = z.infer<typeof addressSchema>;

export default function CheckoutPage() {
  const { cart, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const discount = (location.state as any)?.discount || 0;
  const couponCode = (location.state as any)?.couponCode || '';

  const shippingFee = subtotal > 1999 ? 0 : 150;
  const estimatedTax = Math.round(subtotal * 0.18 * 100) / 100;
  const finalTotal = Math.max(0, subtotal + shippingFee + estimatedTax - discount);

  const { register, handleSubmit, formState: { errors } } = useForm<Form>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      state: 'Maharashtra',
      paymentMethod: 'upi',
    },
  });

  const onSubmit = async (data: Form) => {
    if (!cart?.items?.length) {
      showToast('Your cart is empty.', 'error');
      navigate('/cart');
      return;
    }

    setLoading(true);
    try {
      const itemsPayload = cart.items.map((item) => ({
        product: (item.product as any)._id,
        name: (item.product as any).name,
        image: (item.product as any).images?.[0] || '',
        color: item.color,
        size: item.size,
        lensType: item.lensType,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.unitPrice * item.quantity,
      }));

      // 1. Create order on backend
      const orderRes = await ordersAPI.create({
        shippingAddress: {
          name: data.name,
          phone: data.phone,
          street: data.street,
          city: data.city,
          state: data.state,
          pincode: data.pincode,
          country: 'India',
        },
        paymentMethod: data.paymentMethod,
        couponCode,
        items: itemsPayload,
        subtotal,
        shippingFee,
        tax: estimatedTax,
        discount,
        total: finalTotal,
      });

      const order = orderRes.data.data;

      // 2. Simulate payment confirmation
      if (data.paymentMethod !== 'cod') {
        const payRes = await paymentsAPI.create({ orderId: order._id, method: data.paymentMethod });
        await paymentsAPI.confirm({ orderId: order._id, paymentId: payRes.data.data.paymentId });
      }

      await clearCart();
      showToast('Order placed successfully!', 'success');
      navigate(`/order-confirmation/${order._id}`, { state: { order } });
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to place order. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const inp = {
    width: '100%', padding: '0.75rem 0.9rem', border: '1.5px solid #E8E2D9',
    borderRadius: 7, fontFamily: 'Inter, sans-serif', fontSize: '0.9rem',
    color: '#30251F', background: 'white', outline: 'none', boxSizing: 'border-box' as const,
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1.5rem 5rem' }}>
      <Link to="/cart" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#72785A', textDecoration: 'none', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
        <ArrowLeft size={16} /> Back to Cart
      </Link>

      <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', color: '#30251F', marginBottom: '2rem' }}>
        Secure Checkout
      </h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '3rem' }} className="grid-cols-1! lg:grid-cols-2!">
          {/* Left: Shipping & Payment form */}
          <div>
            <div style={{ background: 'white', borderRadius: 12, padding: '1.75rem', border: '1px solid #F0EAE0', marginBottom: '2rem' }}>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.2rem', color: '#30251F', margin: '0 0 0.5rem' }}>
                1. Delivery Address
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: '#F6F1E8', border: '1px solid #E8E0D0', borderRadius: 8, padding: '0.65rem 0.9rem', marginBottom: '1.25rem', fontSize: '0.82rem', color: '#30251F' }}>
                <span style={{ fontSize: '1.1rem' }}>🚚</span>
                <span><strong>Delivery Across All Over Maharashtra:</strong> Fast courier dispatch from our central Bhandara optical boutique to any town, village, or city in Maharashtra.</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4A3A33', marginBottom: 4 }}>Full Name</label>
                    <input {...register('name')} placeholder="Recipient name" style={inp} />
                    {errors.name && <p style={{ color: '#B65E43', fontSize: '0.72rem', margin: '4px 0 0' }}>{errors.name.message}</p>}
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4A3A33', marginBottom: 4 }}>Mobile Number</label>
                    <input {...register('phone')} placeholder="10-digit number" style={inp} />
                    {errors.phone && <p style={{ color: '#B65E43', fontSize: '0.72rem', margin: '4px 0 0' }}>{errors.phone.message}</p>}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4A3A33', marginBottom: 4 }}>Street Address / Landmark</label>
                  <input {...register('street')} placeholder="Flat, house no., building, street, landmark" style={inp} />
                  {errors.street && <p style={{ color: '#B65E43', fontSize: '0.72rem', margin: '4px 0 0' }}>{errors.street.message}</p>}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4A3A33', marginBottom: 4 }}>City / District</label>
                    <input {...register('city')} placeholder="e.g. Bhandara, Nagpur, Mumbai" style={inp} />
                    {errors.city && <p style={{ color: '#B65E43', fontSize: '0.72rem', margin: '4px 0 0' }}>{errors.city.message}</p>}
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4A3A33', marginBottom: 4 }}>State</label>
                    <input {...register('state')} placeholder="Maharashtra" defaultValue="Maharashtra" style={inp} />
                    {errors.state && <p style={{ color: '#B65E43', fontSize: '0.72rem', margin: '4px 0 0' }}>{errors.state.message}</p>}
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4A3A33', marginBottom: 4 }}>PIN Code</label>
                    <input {...register('pincode')} maxLength={6} placeholder="6 digits (441904...)" style={inp} />
                    {errors.pincode && <p style={{ color: '#B65E43', fontSize: '0.72rem', margin: '4px 0 0' }}>{errors.pincode.message}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment selection */}
            <div style={{ background: 'white', borderRadius: 12, padding: '1.75rem', border: '1px solid #F0EAE0' }}>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.2rem', color: '#30251F', margin: '0 0 1.25rem' }}>
                2. Payment Method
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { id: 'upi', label: 'UPI / QR / Instant Netbanking', desc: 'Google Pay, PhonePe, Paytm, BHIM' },
                  { id: 'card', label: 'Credit / Debit Card', desc: 'Visa, MasterCard, RuPay, Amex' },
                  { id: 'cod', label: 'Cash on Delivery', desc: 'Pay with cash upon frame delivery' },
                ].map((pm) => (
                  <label
                    key={pm.id}
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.875rem 1rem',
                      borderRadius: 8, border: '1px solid #E8E0D0', cursor: 'pointer',
                    }}
                  >
                    <input type="radio" value={pm.id} {...register('paymentMethod')} style={{ marginTop: 3 }} />
                    <div>
                      <p style={{ margin: 0, fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: '#30251F' }}>{pm.label}</p>
                      <p style={{ margin: 0, fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#72785A' }}>{pm.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Order Summary Sidebar */}
          <div>
            <div style={{ background: 'white', borderRadius: 14, padding: '1.75rem', border: '1px solid #F0EAE0', boxShadow: '0 4px 20px rgba(48,37,31,0.05)' }}>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.2rem', color: '#30251F', margin: '0 0 1.25rem' }}>
                Summary
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderBottom: '1px solid #E8E0D0', paddingBottom: '1rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#72785A' }}>
                  <span>Items subtotal</span>
                  <span style={{ color: '#30251F' }}>₹{subtotal.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#72785A' }}>
                  <span>Shipping</span>
                  <span>{shippingFee === 0 ? <strong style={{ color: '#72785A' }}>FREE</strong> : `₹${shippingFee}`}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#72785A' }}>
                  <span>GST (18%)</span>
                  <span>₹{estimatedTax.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#B65E43', fontWeight: 600 }}>
                    <span>Coupon ({couponCode})</span>
                    <span>-₹{discount.toLocaleString()}</span>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.5rem' }}>
                <span style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', fontWeight: 700, color: '#30251F' }}>Total Payable</span>
                <span style={{ fontFamily: 'Georgia, serif', fontSize: '1.5rem', fontWeight: 700, color: '#B65E43' }}>
                  ₹{finalTotal.toLocaleString()}
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  background: loading ? '#C97259' : '#B65E43', color: 'white', padding: '0.95rem',
                  borderRadius: 7, border: 'none', fontFamily: 'Inter, sans-serif', fontSize: '0.9rem',
                  fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                <Lock size={16} /> {loading ? 'Processing Order…' : 'Place Order & Pay'}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1.25rem', color: '#72785A', fontSize: '0.75rem' }}>
                <ShieldCheck size={16} /> Verified Secure Payment Gateway
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
