import { useState, useEffect } from 'react';
import { Calendar, Clock, Phone, Mail, User, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { adminAPI, workerAPI } from '../../services/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function WorkerAppointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      // Fetch via worker dashboard or admin endpoint
      const dash = await workerAPI.getDashboard();
      setAppointments(dash.data.data?.appointments || []);
    } catch {
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

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

  const filtered = appointments.filter((a) => {
    if (statusFilter === 'all') return true;
    return a.status === statusFilter;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.85rem', color: '#30251F', margin: '0 0 0.25rem' }}>
            Vision Consultations &amp; Appointments
          </h1>
          <p style={{ color: '#72785A', margin: 0, fontSize: '0.9rem' }}>
            Manage in-store zero-error eye testing slots and frame fitting appointments.
          </p>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['all', 'scheduled', 'confirmed', 'completed', 'no_show', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: 20,
                border: statusFilter === st ? '1px solid #30251F' : '1px solid #D4B483',
                background: statusFilter === st ? '#30251F' : 'white',
                color: statusFilter === st ? '#F6F1E8' : '#30251F',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '4rem 0', display: 'flex', justifyContent: 'center' }}>
          <LoadingSpinner size="md" />
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ background: 'white', borderRadius: 12, padding: '3.5rem 2rem', textAlign: 'center', border: '1px solid #F0EAE0' }}>
          <Calendar size={44} style={{ color: '#A89C8C', marginBottom: '1rem' }} />
          <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', color: '#30251F' }}>No appointments found</h3>
          <p style={{ color: '#72785A', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            There are currently no appointments matching the selected filter for your store.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.25rem' }}>
          {filtered.map((appt) => (
            <div
              key={appt._id}
              style={{
                background: 'white',
                borderRadius: 12,
                padding: '1.5rem',
                border: '1px solid #F0EAE0',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: 4,
                      textTransform: 'uppercase',
                      background:
                        appt.status === 'completed'
                          ? '#E8EFE5'
                          : appt.status === 'confirmed'
                          ? '#F6F1E8'
                          : appt.status === 'no_show' || appt.status === 'cancelled'
                          ? '#FCE8E6'
                          : '#FFF3EE',
                      color:
                        appt.status === 'completed'
                          ? '#4A6B3D'
                          : appt.status === 'confirmed'
                          ? '#72785A'
                          : appt.status === 'no_show' || appt.status === 'cancelled'
                          ? '#C53030'
                          : '#B65E43',
                    }}
                  >
                    {appt.status.replace('_', ' ')}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#72785A', textTransform: 'capitalize' }}>
                    Type: {appt.type?.replace('_', ' ') || 'Eye Test'}
                  </span>
                </div>

                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.2rem', color: '#30251F', margin: '0 0 0.5rem' }}>
                  {appt.customerName || appt.customer?.name}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', color: '#72785A', fontSize: '0.85rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar size={14} />
                    <span>{new Date(appt.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={14} />
                    <span>{appt.timeSlot}</span>
                  </div>
                  {(appt.customerPhone || appt.customer?.phone) && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Phone size={14} />
                      <span>{appt.customerPhone || appt.customer?.phone}</span>
                    </div>
                  )}
                  {(appt.customerEmail || appt.customer?.email) && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Mail size={14} />
                      <span>{appt.customerEmail || appt.customer?.email}</span>
                    </div>
                  )}
                </div>

                {appt.notes && (
                  <p style={{ margin: '0 0 1rem', padding: '0.5rem 0.75rem', background: '#F6F1E8', borderRadius: 6, fontSize: '0.8rem', color: '#30251F' }}>
                    <strong>Note:</strong> {appt.notes}
                  </p>
                )}
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', borderTop: '1px solid #F0EAE0', paddingTop: '1rem' }}>
                {appt.status !== 'confirmed' && appt.status !== 'completed' && (
                  <button
                    onClick={() => handleStatusChange(appt._id, 'confirmed')}
                    disabled={updatingId === appt._id}
                    style={{
                      flex: 1,
                      background: '#30251F',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem',
                      borderRadius: 4,
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Confirm Slot
                  </button>
                )}
                {appt.status !== 'completed' && (
                  <button
                    onClick={() => handleStatusChange(appt._id, 'completed')}
                    disabled={updatingId === appt._id}
                    style={{
                      flex: 1,
                      background: '#E8EFE5',
                      color: '#4A6B3D',
                      border: 'none',
                      padding: '0.5rem',
                      borderRadius: 4,
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Mark Complete
                  </button>
                )}
                {appt.status !== 'no_show' && appt.status !== 'completed' && (
                  <button
                    onClick={() => handleStatusChange(appt._id, 'no_show')}
                    disabled={updatingId === appt._id}
                    style={{
                      background: '#FCE8E6',
                      color: '#C53030',
                      border: 'none',
                      padding: '0.5rem 0.75rem',
                      borderRadius: 4,
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    No Show
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
