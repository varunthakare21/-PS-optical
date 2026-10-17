import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package, CheckCircle2, Truck, RotateCcw } from 'lucide-react';
import { ordersAPI } from '../../services/api';
import { Order } from '../../types';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const STEPS = ['pending_payment', 'confirmed', 'processing', 'ready_for_dispatch', 'shipped', 'delivered'];

export default function CustomerOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    ordersAPI.getOrder(id)
      .then((res) => setOrder(res.data.data))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div style={{ padding: '4rem 0', display: 'flex', justifyContent: 'center' }}><LoadingSpinner size="md" /></div>;
  }

  if (!order) {
    return (
      <div>
        <p>Order not found.</p>
        <Link to="/customer/orders" style={{ color: '#B65E43' }}>Back to orders</Link>
      </div>
    );
  }

  const currentStepIdx = STEPS.indexOf(order.status);

  return (
    <div>
      <Link to="/customer/orders" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#72785A', textDecoration: 'none', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
        <ArrowLeft size={16} /> Back to My Orders
      </Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.75rem', color: '#72785A', textTransform: 'uppercase' }}>Invoice &amp; Tracking</span>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.75rem', color: '#30251F', margin: '2px 0 0' }}>
            Order #{order.orderNumber}
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#72785A' }}>
            Placed on {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div>
          <span style={{
            fontSize: '0.85rem', fontWeight: 700, padding: '6px 14px', borderRadius: 6, textTransform: 'capitalize',
            background: order.status === 'delivered' ? '#E8EFE5' : '#FFF3EE',
            color: order.status === 'delivered' ? '#4A6B3D' : '#B65E43',
          }}>
            {order.status.replace(/_/g, ' ')}
          </span>
        </div>
      </div>

      {/* Progress tracker */}
      <div style={{ background: 'white', borderRadius: 14, padding: '2rem', border: '1px solid #F0EAE0', marginBottom: '2rem', boxShadow: '0 2px 10px rgba(48,37,31,0.04)' }}>
        <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#30251F', margin: '0 0 1.5rem' }}>
          Fulfillment Status
        </h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
          {['Confirmed', 'Lab Processing', 'Dispatched', 'Delivered'].map((step, idx) => {
            const isCompleted = currentStepIdx >= idx * 1.5;
            return (
              <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: isCompleted ? '#72785A' : '#EDE5D4',
                  color: isCompleted ? 'white' : '#A89C8C',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700,
                  marginBottom: '0.5rem',
                }}>
                  {isCompleted ? '✓' : idx + 1}
                </div>
                <span style={{ fontSize: '0.75rem', color: isCompleted ? '#30251F' : '#A89C8C', fontWeight: isCompleted ? 600 : 400 }}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Items & Shipping address */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }} className="grid-cols-1! md:grid-cols-2!">
        <div style={{ background: 'white', borderRadius: 12, padding: '1.5rem', border: '1px solid #F0EAE0' }}>
          <h4 style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#30251F', margin: '0 0 1rem' }}>Items in Order</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {order.items?.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F6F1E8', paddingBottom: '0.75rem' }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem', color: '#30251F' }}>{item.name}</p>
                  <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: '#72785A' }}>
                    Colour: {item.color} · Size: {item.size} · Qty: {item.quantity}
                  </p>
                  {item.lensType && (
                    <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: '#B65E43' }}>Lens: {item.lensType}</p>
                  )}
                </div>
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#30251F' }}>
                  ₹{item.totalPrice.toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #E8E0D0', display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
            <span>Final Paid Total</span>
            <span style={{ color: '#B65E43', fontSize: '1.1rem' }}>₹{order.total.toLocaleString()}</span>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: 12, padding: '1.5rem', border: '1px solid #F0EAE0', height: 'fit-content' }}>
          <h4 style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#30251F', margin: '0 0 1rem' }}>Shipping Address</h4>
          <p style={{ margin: '0 0 0.5rem', fontWeight: 600, color: '#30251F', fontSize: '0.9rem' }}>{order.shippingAddress?.name}</p>
          <p style={{ margin: 0, color: '#72785A', fontSize: '0.85rem', lineHeight: 1.6 }}>
            {order.shippingAddress?.street}<br />
            {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}<br />
            Phone: {order.shippingAddress?.phone}
          </p>

          <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #F0EAE0' }}>
            <span style={{ fontSize: '0.75rem', color: '#72785A' }}>Payment Method:</span>
            <p style={{ margin: '2px 0 0', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', color: '#30251F' }}>
              {order.paymentMethod} ({order.paymentStatus})
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
