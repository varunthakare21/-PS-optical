import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, XCircle, CheckCircle, Plus } from 'lucide-react';
import { appointmentsAPI } from '../../services/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function CustomerAppointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const fetchAppointments = async () => {
    try {
      const res = await appointmentsAPI.getMyAppointments();
      setAppointments(res.data.data || []);
    } catch {
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      setCancellingId(id);
      await appointmentsAPI.cancel(id, 'Cancelled by customer');
      await fetchAppointments();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to cancel appointment');
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '4rem 0', display: 'flex', justifyContent: 'center' }}>
        <LoadingSpinner size="md" />
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.85rem', color: '#30251F', margin: '0 0 0.25rem' }}>
            Eye Test &amp; Store Appointments
          </h1>
          <p style={{ color: '#72785A', margin: 0, fontSize: '0.9rem' }}>
            Manage your booked comprehensive vision examinations and frame styling sessions.
          </p>
        </div>
        <Link
          to="/appointment"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: '#B65E43',
            color: 'white',
            textDecoration: 'none',
            padding: '0.75rem 1.25rem',
            borderRadius: 6,
            fontWeight: 600,
            fontSize: '0.9rem',
          }}
        >
          <Plus size={16} /> Book New Test
        </Link>
      </div>

      {appointments.length === 0 ? (
        <div style={{ background: 'white', borderRadius: 12, padding: '3.5rem 2rem', textAlign: 'center', border: '1px solid #F0EAE0' }}>
          <Calendar size={44} style={{ color: '#A89C8C', marginBottom: '1rem' }} />
          <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', color: '#30251F' }}>No appointments booked yet</h3>
          <p style={{ color: '#72785A', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            Book a 20-step zero-error eye test with certified optometrists at our flagship stores.
          </p>
          <Link
            to="/appointment"
            style={{
              display: 'inline-block',
              marginTop: '1.25rem',
              background: '#30251F',
              color: 'white',
              textDecoration: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: 6,
              fontWeight: 600,
            }}
          >
            Find Slots
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {appointments.map((appt) => (
            <div
              key={appt._id}
              style={{
                background: 'white',
                borderRadius: 12,
                padding: '1.5rem',
                border: '1px solid #F0EAE0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: 4,
                      textTransform: 'uppercase',
                      background:
                        appt.status === 'confirmed'
                          ? '#E8EFE5'
                          : appt.status === 'completed'
                          ? '#F0EAE0'
                          : appt.status === 'cancelled'
                          ? '#FCE8E6'
                          : '#FFF3EE',
                      color:
                        appt.status === 'confirmed'
                          ? '#4A6B3D'
                          : appt.status === 'completed'
                          ? '#30251F'
                          : appt.status === 'cancelled'
                          ? '#C53030'
                          : '#B65E43',
                    }}
                  >
                    {appt.status}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: '#72785A', textTransform: 'capitalize' }}>
                    Type: {appt.type.replace('_', ' ')}
                  </span>
                </div>
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.15rem', color: '#30251F', margin: '0 0 0.5rem' }}>
                  {appt.store?.name || 'PS Optical Flagship Store'}
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', color: '#72785A', fontSize: '0.85rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={14} /> {new Date(appt.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={14} /> {appt.timeSlot}
                  </span>
                  {appt.store?.address && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={14} /> {appt.store.address.city}, {appt.store.address.pincode}
                    </span>
                  )}
                </div>
              </div>

              <div>
                {['scheduled', 'confirmed'].includes(appt.status) && (
                  <button
                    onClick={() => handleCancel(appt._id)}
                    disabled={cancellingId === appt._id}
                    style={{
                      background: 'none',
                      border: '1px solid #D4B483',
                      color: '#B65E43',
                      padding: '0.5rem 1rem',
                      borderRadius: 6,
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {cancellingId === appt._id ? 'Cancelling...' : 'Cancel Appointment'}
                  </button>
                )}
                {appt.status === 'completed' && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#4A6B3D', fontSize: '0.85rem', fontWeight: 600 }}>
                    <CheckCircle size={16} /> Completed
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
