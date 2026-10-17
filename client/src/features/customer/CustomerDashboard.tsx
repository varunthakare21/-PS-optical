import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, Calendar, ClipboardList, ArrowRight, Package } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { ordersAPI, wishlistAPI, appointmentsAPI, prescriptionsAPI } from '../../services/api';
import { Order } from '../../types';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [appointmentCount, setAppointmentCount] = useState(0);
  const [prescriptionCount, setPrescriptionCount] = useState(0);

  useEffect(() => {
    ordersAPI.getMyOrders(1).then((res) => setRecentOrders(res.data.data?.slice(0, 3) || [])).catch(() => {});
    wishlistAPI.getWishlist().then((res) => setWishlistCount(res.data.data?.products?.length || 0)).catch(() => {});
    appointmentsAPI.getMyAppointments().then((res) => setAppointmentCount(res.data.data?.length || 0)).catch(() => {});
    prescriptionsAPI.getAll().then((res) => setPrescriptionCount(res.data.data?.length || 0)).catch(() => {});
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.85rem', color: '#30251F', margin: '0 0 0.5rem' }}>
          Welcome back, {user?.name}
        </h1>
        <p style={{ fontFamily: 'Inter, sans-serif', color: '#72785A', fontSize: '0.95rem', margin: 0 }}>
          Manage your optical orders, prescriptions, appointments, and saved preferences.
        </p>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        {[
          { label: 'Active Orders', count: recentOrders.length, icon: ShoppingBag, href: '/customer/orders', color: '#B65E43' },
          { label: 'Saved Frames', count: wishlistCount, icon: Heart, href: '/customer/wishlist', color: '#B65E43' },
          { label: 'Eye Appointments', count: appointmentCount, icon: Calendar, href: '/customer/appointments', color: '#72785A' },
          { label: 'Prescriptions', count: prescriptionCount, icon: ClipboardList, href: '/customer/prescriptions', color: '#30251F' },
        ].map(({ label, count, icon: Icon, href, color }) => (
          <Link key={label} to={href} style={{ textDecoration: 'none' }}>
            <div style={{ background: 'white', borderRadius: 12, padding: '1.25rem', border: '1px solid #F0EAE0', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 2px 10px rgba(48,37,31,0.04)' }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: '#F6F1E8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={20} style={{ color }} />
              </div>
              <div>
                <p style={{ margin: 0, fontFamily: 'Georgia, serif', fontSize: '1.4rem', fontWeight: 700, color: '#30251F' }}>{count}</p>
                <p style={{ margin: 0, fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: '#72785A' }}>{label}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Orders Section */}
      <div style={{ background: 'white', borderRadius: 14, padding: '1.75rem', border: '1px solid #F0EAE0', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', color: '#30251F', margin: 0 }}>Recent Orders</h2>
          <Link to="/customer/orders" style={{ color: '#B65E43', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>
            View All Orders →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#72785A', fontSize: '0.9rem' }}>
            <p>You haven't placed any orders yet.</p>
            <Link to="/eyeglasses" style={{ display: 'inline-block', marginTop: '0.5rem', color: '#B65E43', fontWeight: 600 }}>Explore frames</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recentOrders.map((ord) => (
              <div key={ord._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#F6F1E8', borderRadius: 8, flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: '0.88rem', color: '#30251F' }}>#{ord.orderNumber}</p>
                  <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: '#72785A' }}>
                    {ord.items?.length || 0} item(s) · {new Date(ord.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '3px 8px', borderRadius: 4, background: ord.status === 'delivered' ? '#E8EFE5' : '#FFF3EE', color: ord.status === 'delivered' ? '#4A6B3D' : '#B65E43', textTransform: 'capitalize' }}>
                    {ord.status.replace(/_/g, ' ')}
                  </span>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#30251F' }}>₹{ord.total.toLocaleString()}</span>
                  <Link to={`/customer/orders/${ord._id}`} style={{ color: '#B65E43', textDecoration: 'none', fontSize: '0.82rem', fontWeight: 600 }}>
                    Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick shortcuts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
        <div style={{ background: '#FDF8F3', borderRadius: 12, padding: '1.5rem', border: '1px solid #F0DCCE' }}>
          <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#30251F', margin: '0 0 0.5rem' }}>
            Need a Fresh Eye Test?
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#72785A', margin: '0 0 1rem', lineHeight: 1.5 }}>
            Book a complimentary 12-point examination with certified opticians at our store.
          </p>
          <Link to="/appointment" style={{ color: '#B65E43', fontWeight: 600, fontSize: '0.85rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
            Book Eye Test <ArrowRight size={14} />
          </Link>
        </div>

        <div style={{ background: '#F5F6F2', borderRadius: 12, padding: '1.5rem', border: '1px solid #E8EAE0' }}>
          <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#30251F', margin: '0 0 0.5rem' }}>
            Store Your Prescription
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#72785A', margin: '0 0 1rem', lineHeight: 1.5 }}>
            Save your SPH, CYL, Axis, and Pupillary Distance for instant lens selection next time.
          </p>
          <Link to="/customer/prescriptions" style={{ color: '#72785A', fontWeight: 600, fontSize: '0.85rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
            Manage Prescriptions <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
