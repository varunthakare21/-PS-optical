import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowRight, RotateCcw } from 'lucide-react';
import { ordersAPI } from '../../services/api';
import { Order } from '../../types';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function CustomerOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ordersAPI.getMyOrders()
      .then((res) => setOrders(res.data.data || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div style={{ padding: '4rem 0', display: 'flex', justifyContent: 'center' }}><LoadingSpinner size="md" /></div>;
  }

  return (
    <div>
      <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.85rem', color: '#30251F', margin: '0 0 1.5rem' }}>
        My Orders &amp; Tracking
      </h1>

      {orders.length === 0 ? (
        <div style={{ background: 'white', borderRadius: 12, padding: '3rem', textAlign: 'center', border: '1px solid #F0EAE0' }}>
          <Package size={40} style={{ color: '#A89C8C', marginBottom: '1rem' }} />
          <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', color: '#30251F' }}>No orders placed yet</h3>
          <p style={{ color: '#72785A', fontSize: '0.9rem', marginTop: '0.5rem' }}>When you purchase frames or prescription lenses, track them here.</p>
          <Link to="/eyeglasses" style={{ display: 'inline-block', marginTop: '1rem', background: '#B65E43', color: 'white', textDecoration: 'none', padding: '0.75rem 1.5rem', borderRadius: 6, fontWeight: 600 }}>
            Start Shopping
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {orders.map((order) => (
            <div key={order._id} style={{ background: 'white', borderRadius: 12, padding: '1.5rem', border: '1px solid #F0EAE0', boxShadow: '0 2px 10px rgba(48,37,31,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F0EAE0', paddingBottom: '1rem', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#72785A', textTransform: 'uppercase' }}>Order Number</span>
                  <p style={{ margin: 0, fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 700, color: '#30251F' }}>#{order.orderNumber}</p>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#72785A', textTransform: 'uppercase' }}>Placed On</span>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#30251F' }}>{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#72785A', textTransform: 'uppercase' }}>Total</span>
                  <p style={{ margin: 0, fontFamily: 'Georgia, serif', fontSize: '1.1rem', fontWeight: 700, color: '#B65E43' }}>₹{order.total.toLocaleString()}</p>
                </div>
                <div>
                  <span style={{
                    fontSize: '0.75rem', fontWeight: 700, padding: '4px 10px', borderRadius: 4, textTransform: 'capitalize',
                    background: order.status === 'delivered' ? '#E8EFE5' : '#FFF3EE',
                    color: order.status === 'delivered' ? '#4A6B3D' : '#B65E43',
                  }}>
                    {order.status.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              {/* Items in order */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                {order.items?.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {item.image && <img src={item.image} alt="" style={{ width: 40, height: 30, objectFit: 'contain', background: '#F6F1E8', borderRadius: 4 }} />}
                      <div>
                        <span style={{ fontWeight: 600, color: '#30251F' }}>{item.name}</span>
                        <span style={{ color: '#72785A', marginLeft: 8 }}>({item.color}, {item.size})</span>
                        {item.lensType && <span style={{ color: '#B65E43', marginLeft: 8 }}>· {item.lensType}</span>}
                      </div>
                    </div>
                    <span style={{ fontWeight: 600, color: '#30251F' }}>₹{item.totalPrice.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid #F0EAE0', paddingTop: '1rem' }}>
                <Link to={`/customer/orders/${order._id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#B65E43', fontWeight: 600, fontSize: '0.85rem', textDecoration: 'none' }}>
                  View Full Tracking &amp; Invoice <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
