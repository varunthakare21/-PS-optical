import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, AlertTriangle, Eye, Package, CheckCircle, Clock, Home, ArrowRight } from 'lucide-react';
import { workerAPI, adminAPI } from '../../services/api';
import { useAuth } from '../auth/AuthContext';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function WorkerDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<{
    appointments: any[];
    tryAtHome: any[];
    lowStock: any[];
    storeId?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const res = await workerAPI.getDashboard();
      setData(res.data.data);
    } catch {
      setData({ appointments: [], tryAtHome: [], lowStock: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleUpdateApptStatus = async (id: string, status: string) => {
    try {
      await adminAPI.updateAppointmentStatus(id, status);
      await fetchDashboard();
    } catch {
      alert('Failed to update status');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '4rem 0', display: 'flex', justifyContent: 'center' }}>
        <LoadingSpinner size="md" />
      </div>
    );
  }

  const appointments = data?.appointments || [];
  const lowStock = data?.lowStock || [];
  const tryAtHome = data?.tryAtHome || [];

  return (
    <div>
      {/* Top Welcome Header */}
      <div style={{ background: '#30251F', color: '#F6F1E8', borderRadius: 12, padding: '2rem', marginBottom: '2rem' }}>
        <span style={{ fontSize: '0.8rem', color: '#D4B483', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Store Staff Operations Portal
        </span>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.85rem', margin: '0.25rem 0 0.5rem' }}>
          Welcome back, {user?.name || 'Optician'}
        </h1>
        <p style={{ margin: 0, color: '#A89C8C', fontSize: '0.9rem' }}>
          Real-time store inventory management, vision consultation schedules, and dispatch monitoring.
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div style={{ background: 'white', borderRadius: 12, padding: '1.5rem', border: '1px solid #F0EAE0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: '#72785A', fontWeight: 600 }}>Active Appointments</span>
            <Calendar size={20} style={{ color: '#B65E43' }} />
          </div>
          <p style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', fontWeight: 700, color: '#30251F', margin: '0.5rem 0 0' }}>
            {appointments.length}
          </p>
        </div>

        <div style={{ background: 'white', borderRadius: 12, padding: '1.5rem', border: '1px solid #F0EAE0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: '#72785A', fontWeight: 600 }}>Home Trials Pending</span>
            <Home size={20} style={{ color: '#D4B483' }} />
          </div>
          <p style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', fontWeight: 700, color: '#30251F', margin: '0.5rem 0 0' }}>
            {tryAtHome.length}
          </p>
        </div>

        <div style={{ background: 'white', borderRadius: 12, padding: '1.5rem', border: '1px solid #F0EAE0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: '#72785A', fontWeight: 600 }}>Low Stock SKUs (&le;5)</span>
            <AlertTriangle size={20} style={{ color: '#B65E43' }} />
          </div>
          <p style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', fontWeight: 700, color: lowStock.length > 0 ? '#B65E43' : '#4A6B3D', margin: '0.5rem 0 0' }}>
            {lowStock.length}
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        {/* Today's Appointments */}
        <div style={{ background: 'white', borderRadius: 12, padding: '1.5rem', border: '1px solid #F0EAE0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', color: '#30251F', margin: 0 }}>
              Scheduled Consultations
            </h2>
            <Link to="/worker/appointments" style={{ color: '#B65E43', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>
              View All
            </Link>
          </div>

          {appointments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#A89C8C', fontSize: '0.9rem' }}>
              No pending appointments today.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {appointments.slice(0, 5).map((appt) => (
                <div
                  key={appt._id}
                  style={{
                    padding: '1rem',
                    background: '#FDFBF9',
                    borderRadius: 8,
                    border: '1px solid #F0EAE0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                  }}
                >
                  <div>
                    <h4 style={{ margin: '0 0 0.25rem', color: '#30251F', fontSize: '0.95rem' }}>
                      {appt.customerName || appt.customer?.name}
                    </h4>
                    <p style={{ margin: 0, color: '#72785A', fontSize: '0.8rem', display: 'flex', gap: '0.75rem' }}>
                      <span><Clock size={12} style={{ display: 'inline', marginRight: 2 }} /> {appt.timeSlot}</span>
                      <span>{new Date(appt.date).toLocaleDateString()}</span>
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleUpdateApptStatus(appt._id, 'completed')}
                      style={{
                        background: '#E8EFE5',
                        color: '#4A6B3D',
                        border: 'none',
                        padding: '0.4rem 0.75rem',
                        borderRadius: 4,
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Complete
                    </button>
                    <button
                      onClick={() => handleUpdateApptStatus(appt._id, 'no_show')}
                      style={{
                        background: '#FCE8E6',
                        color: '#C53030',
                        border: 'none',
                        padding: '0.4rem 0.75rem',
                        borderRadius: 4,
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      No Show
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock Watchlist */}
        <div style={{ background: 'white', borderRadius: 12, padding: '1.5rem', border: '1px solid #F0EAE0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', color: '#30251F', margin: 0 }}>
              Low Stock Alerts
            </h2>
            <Link to="/worker/inventory" style={{ color: '#B65E43', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>
              Manage Stock
            </Link>
          </div>

          {lowStock.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#4A6B3D', fontSize: '0.9rem' }}>
              All inventory levels are healthy!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {lowStock.slice(0, 5).map((inv) => (
                <div
                  key={inv._id}
                  style={{
                    padding: '1rem',
                    background: '#FFF3EE',
                    borderRadius: 8,
                    border: '1px solid #F8D7C9',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <h4 style={{ margin: '0 0 0.25rem', color: '#30251F', fontSize: '0.95rem' }}>
                      {inv.product?.name || inv.sku}
                    </h4>
                    <p style={{ margin: 0, color: '#72785A', fontSize: '0.8rem' }}>
                      Color: {inv.color} | Size: {inv.size}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#B65E43' }}>
                      {inv.quantityAvailable} left
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
