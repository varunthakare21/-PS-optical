import { useParams, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Package, ArrowRight, Home } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ordersAPI } from '../services/api';
import { Order } from '../types';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function OrderConfirmationPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [order, setOrder] = useState<Order | null>((location.state as any)?.order || null);
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    if (!order && id) {
      ordersAPI.getOrder(id)
        .then((res) => setOrder(res.data.data))
        .catch(() => setOrder(null))
        .finally(() => setLoading(false));
    }
  }, [id, order]);

  if (loading) {
    return <div style={{ padding: '8rem 0', display: 'flex', justifyContent: 'center' }}><LoadingSpinner size="lg" /></div>;
  }

  return (
    <div style={{ maxWidth: 760, margin: '4rem auto 6rem', padding: '0 1.5rem' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        style={{ background: 'white', borderRadius: 16, padding: '3rem 2rem', textAlign: 'center', border: '1px solid #F0EAE0', boxShadow: '0 8px 32px rgba(48,37,31,0.06)' }}
      >
        <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '50%', background: '#F0EAE0', marginBottom: '1.25rem' }}>
          <CheckCircle size={48} style={{ color: '#72785A' }} />
        </div>

        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', color: '#30251F', margin: '0 0 0.5rem' }}>
          Thank You For Your Order!
        </h1>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', color: '#72785A', margin: '0 0 1.5rem' }}>
          Your order has been received and is now being carefully prepared by our optical laboratory.
        </p>

        {order && (
          <div style={{ background: '#F6F1E8', borderRadius: 12, padding: '1.5rem', textAlign: 'left', marginBottom: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem', borderBottom: '1px solid #E8E0D0', paddingBottom: '1rem' }}>
              <div>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#72785A', textTransform: 'uppercase' }}>Order Number</p>
                <p style={{ margin: '4px 0 0', fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 700, color: '#30251F' }}>
                  {order.orderNumber}
                </p>
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#72785A', textTransform: 'uppercase' }}>Total Amount Paid</p>
                <p style={{ margin: '4px 0 0', fontFamily: 'Georgia, serif', fontSize: '1.15rem', fontWeight: 700, color: '#B65E43' }}>
                  ₹{order.total.toLocaleString()}
                </p>
              </div>
            </div>

            <div>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#72785A', textTransform: 'uppercase' }}>Delivering to</p>
              <p style={{ margin: '4px 0 0', fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: '#30251F' }}>
                {order.shippingAddress?.name} · {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
              </p>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link
            to="/customer/orders"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: '#B65E43', color: 'white', textDecoration: 'none',
              padding: '0.85rem 1.75rem', borderRadius: 6, fontFamily: 'Inter, sans-serif',
              fontSize: '0.875rem', fontWeight: 600,
            }}
          >
            <Package size={17} /> View My Orders
          </Link>
          <Link
            to="/"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: '#EDE5D4', color: '#30251F', textDecoration: 'none',
              padding: '0.85rem 1.75rem', borderRadius: 6, fontFamily: 'Inter, sans-serif',
              fontSize: '0.875rem', fontWeight: 600,
            }}
          >
            <Home size={17} /> Return to Homepage
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
