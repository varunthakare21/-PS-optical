import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, CheckCircle, XCircle, User, Phone, Store } from 'lucide-react';
import { adminAPI } from '../../services/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [selectedStore, setSelectedStore] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [apptRes, storesRes] = await Promise.all([
        adminAPI.getAppointments(selectedStore || undefined),
        adminAPI.getStores(),
      ]);
      setAppointments(apptRes.data.data || []);
      setStores(storesRes.data.data || []);
    } catch {
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedStore]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      setUpdatingId(id);
      await adminAPI.updateAppointmentStatus(id, newStatus);
      setAppointments((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: newStatus } : a))
      );
    } catch {
      alert('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div style={{ color: '#F6F1E8' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.85rem', margin: '0 0 0.25rem', color: '#FFFFFF' }}>
            Vision Test Appointments
          </h1>
          <p style={{ color: '#B8AFA8', margin: 0, fontSize: '0.85rem' }}>
            All booked clinical eye examinations across the retail network.
          </p>
        </div>

        {/* Store filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Store size={16} style={{ color: '#D4B483' }} />
          <select
            value={selectedStore}
            onChange={(e) => setSelectedStore(e.target.value)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 6,
              background: '#1E1C19',
              border: '1px solid #3A3632',
              color: '#F6F1E8',
              fontSize: '0.85rem',
            }}
          >
            <option value="">All Retail Stores</option>
            {stores.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '4rem 0', display: 'flex', justifyContent: 'center' }}>
          <LoadingSpinner size="md" />
        </div>
      ) : appointments.length === 0 ? (
        <div style={{ background: '#1E1C19', borderRadius: 12, padding: '3.5rem 2rem', textAlign: 'center', border: '1px solid #3A3632' }}>
          <Calendar size={44} style={{ color: '#72785A', marginBottom: '1rem' }} />
          <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', color: '#FFFFFF' }}>No appointments booked</h3>
        </div>
      ) : (
        <div style={{ background: '#1E1C19', borderRadius: 12, border: '1px solid #3A3632', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 720 }}>
            <thead>
              <tr style={{ background: '#2A2825', borderBottom: '1px solid #3A3632', fontSize: '0.75rem', color: '#D4B483', textTransform: 'uppercase' }}>
                <th style={{ padding: '1rem' }}>Patient / Client</th>
                <th style={{ padding: '1rem' }}>Location</th>
                <th style={{ padding: '1rem' }}>Date &amp; Slot</th>
                <th style={{ padding: '1rem' }}>Type</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Status Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <tr key={appt._id} style={{ borderBottom: '1px solid #2A2825', fontSize: '0.85rem' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 600, color: '#FFFFFF' }}>
                      {appt.customerName || appt.customer?.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#B8AFA8' }}>
                      {appt.customerPhone || appt.customer?.phone}
                    </div>
                  </td>
                  <td style={{ padding: '1rem', color: '#B8AFA8' }}>
                    {appt.store?.name || 'Flagship Store'}
                  </td>
                  <td style={{ padding: '1rem', color: '#FFFFFF' }}>
                    <div>{new Date(appt.date).toLocaleDateString()}</div>
                    <div style={{ fontSize: '0.75rem', color: '#D4B483' }}>{appt.timeSlot}</div>
                  </td>
                  <td style={{ padding: '1rem', color: '#B8AFA8', textTransform: 'capitalize' }}>
                    {appt.type?.replace('_', ' ') || 'Eye Test'}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <select
                      value={appt.status}
                      disabled={updatingId === appt._id}
                      onChange={(e) => handleStatusChange(appt._id, e.target.value)}
                      style={{
                        padding: '0.35rem 0.65rem',
                        borderRadius: 4,
                        background: '#2A2825',
                        border: '1px solid #3A3632',
                        color: '#F6F1E8',
                        fontSize: '0.8rem',
                      }}
                    >
                      <option value="scheduled">Scheduled</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="no_show">No Show</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
