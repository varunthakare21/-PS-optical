import { useState, useEffect } from 'react';
import {
  Calendar, Clock, CheckCircle2, MapPin, Search, Filter,
  Eye, User, Phone, Check, X, Package, ChevronRight, Truck
} from 'lucide-react';
import { adminAPI } from '../../services/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useToast } from '../../components/ui/Toaster';

export default function AdminBookings() {
  const [tryAtHomeBookings, setTryAtHomeBookings] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'try_at_home' | 'store_visit'>('try_at_home');
  const [search, setSearch] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [statusVal, setStatusVal] = useState('');
  const [updating, setUpdating] = useState(false);
  const { showToast } = useToast();

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getBookings();
      setTryAtHomeBookings(res.data.data?.tryAtHome || []);
      setAppointments(res.data.data?.appointments || []);
    } catch {
      setTryAtHomeBookings([]);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (bookingId: string) => {
    try {
      setUpdating(true);
      await adminAPI.updateTryAtHomeStatus(bookingId, statusVal);
      showToast('Frame booking status updated.', 'success');
      setSelectedBooking(null);
      await fetchBookings();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to update booking status.', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const filteredTryAtHome = tryAtHomeBookings.filter((b) => {
    const q = search.toLowerCase();
    const name = (b.customerName || b.customer?.name || '').toLowerCase();
    const phone = b.customerPhone || b.customer?.phone || '';
    const city = (b.deliveryAddress?.city || b.address?.city || '').toLowerCase();
    const pin = b.deliveryAddress?.pincode || b.address?.pincode || '';
    return !q || name.includes(q) || phone.includes(q) || city.includes(q) || pin.includes(q);
  });

  const filteredAppointments = appointments.filter((a) => {
    const q = search.toLowerCase();
    return (
      !q ||
      a.customer?.name?.toLowerCase().includes(q) ||
      a.customer?.phone?.includes(q) ||
      a.type?.toLowerCase().includes(q)
    );
  });

  return (
    <div style={{ color: '#F6F1E8' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.75rem', color: '#D4B483', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600 }}>
            Omnichannel Reservations
          </span>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', margin: '0.25rem 0 0.5rem', color: '#FFFFFF' }}>
            Frame Bookings &amp; In-Store Trials
          </h1>
          <p style={{ color: '#B8AFA8', margin: 0, fontSize: '0.85rem' }}>
            Monitor Try-at-Home frame dispatch across Maharashtra and flagship appointments in Bhandara.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setActiveTab('try_at_home')}
            style={{
              background: activeTab === 'try_at_home' ? '#D4B483' : '#2A2825',
              color: activeTab === 'try_at_home' ? '#1E1C19' : '#B8AFA8',
              border: '1px solid #3A3632',
              padding: '0.6rem 1.25rem',
              borderRadius: 6,
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Truck size={16} /> Try-at-Home Bookings ({tryAtHomeBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('store_visit')}
            style={{
              background: activeTab === 'store_visit' ? '#D4B483' : '#2A2825',
              color: activeTab === 'store_visit' ? '#1E1C19' : '#B8AFA8',
              border: '1px solid #3A3632',
              padding: '0.6rem 1.25rem',
              borderRadius: 6,
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Calendar size={16} /> Bhandara Boutique Appointments ({appointments.length})
          </button>
        </div>

        <div style={{ position: 'relative', minWidth: 260 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#B8AFA8' }} />
          <input
            type="text"
            placeholder="Search by client, phone, city…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '0.55rem 1rem 0.55rem 2.2rem',
              borderRadius: 6,
              background: '#1E1C19',
              border: '1px solid #3A3632',
              color: '#FFF',
              fontSize: '0.85rem',
              boxSizing: 'border-box',
            }}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '4rem 0', display: 'flex', justifyContent: 'center' }}>
          <LoadingSpinner size="md" />
        </div>
      ) : activeTab === 'try_at_home' ? (
        /* Try at Home Bookings */
        filteredTryAtHome.length === 0 ? (
          <div style={{ background: '#1E1C19', borderRadius: 12, padding: '3.5rem 2rem', textAlign: 'center', border: '1px solid #3A3632' }}>
            <Package size={44} style={{ color: '#D4B483', marginBottom: '1rem' }} />
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', color: '#FFFFFF' }}>No Home Trial Bookings</h3>
            <p style={{ color: '#B8AFA8', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              Customers can book up to 5 frames for doorstep trial across Maharashtra.
            </p>
          </div>
        ) : (
          <div style={{ background: '#1E1C19', borderRadius: 12, border: '1px solid #3A3632', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 800 }}>
              <thead>
                <tr style={{ background: '#2A2825', borderBottom: '1px solid #3A3632', fontSize: '0.75rem', color: '#D4B483', textTransform: 'uppercase' }}>
                  <th style={{ padding: '1rem' }}>Client &amp; Contact</th>
                  <th style={{ padding: '1rem' }}>Maharashtra Delivery Location</th>
                  <th style={{ padding: '1rem' }}>Reserved Frames</th>
                  <th style={{ padding: '1rem' }}>Trial Date &amp; Slot</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTryAtHome.map((b) => {
                  const clientName = b.customerName || b.customer?.name || 'Client';
                  const clientPhone = b.customerPhone || b.customer?.phone || b.customer?.email;
                  const cityName = b.deliveryAddress?.city || b.address?.city || 'Bhandara';
                  const stateName = b.deliveryAddress?.state || b.address?.state || 'Maharashtra';
                  const pinCode = b.deliveryAddress?.pincode || b.address?.pincode || '441904';
                  const bookingDate = b.preferredDate || b.date;

                  return (
                    <tr key={b._id} style={{ borderBottom: '1px solid #2A2825', fontSize: '0.85rem' }}>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ fontWeight: 600, color: '#FFFFFF' }}>{clientName}</div>
                        <div style={{ fontSize: '0.75rem', color: '#B8AFA8' }}>{clientPhone}</div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ color: '#F6F1E8' }}>{cityName}, {stateName}</div>
                        <div style={{ fontSize: '0.75rem', color: '#B8AFA8' }}>PIN: {pinCode}</div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                          {b.products?.map((prod: any, idx: number) => (
                            <span
                              key={idx}
                              style={{
                                background: '#2A2825',
                                border: '1px solid #3A3632',
                                padding: '2px 6px',
                                borderRadius: 4,
                                fontSize: '0.75rem',
                                color: '#D4B483',
                              }}
                            >
                              {prod.name || 'Optical Frame'}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ color: '#FFFFFF', fontWeight: 500 }}>
                          {bookingDate ? new Date(bookingDate).toLocaleDateString() : 'Scheduled'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#D4B483' }}>
                          {b.timeSlot}
                        </div>
                      </td>
                    <td style={{ padding: '1rem' }}>
                      <span
                        style={{
                          padding: '2px 8px',
                          borderRadius: 4,
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          background:
                            b.status === 'completed' ? '#273822' :
                            b.status === 'cancelled' ? '#3D281F' : '#3D341F',
                          color:
                            b.status === 'completed' ? '#8FC87A' :
                            b.status === 'cancelled' ? '#E88B6E' : '#D4B483',
                        }}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <button
                        onClick={() => {
                          setSelectedBooking(b);
                          setStatusVal(b.status);
                        }}
                        style={{
                          background: '#2A2825',
                          border: '1px solid #3A3632',
                          color: '#D4B483',
                          padding: '0.4rem 0.75rem',
                          borderRadius: 4,
                          cursor: 'pointer',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                        }}
                      >
                        Update Status
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            </table>
          </div>
        )
      ) : (
        /* Store Appointments */
        filteredAppointments.length === 0 ? (
          <div style={{ background: '#1E1C19', borderRadius: 12, padding: '3.5rem 2rem', textAlign: 'center', border: '1px solid #3A3632' }}>
            <Calendar size={44} style={{ color: '#D4B483', marginBottom: '1rem' }} />
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', color: '#FFFFFF' }}>No Store Appointments</h3>
            <p style={{ color: '#B8AFA8', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              In-store appointments for our boutique Near Post Office, Bhandara - 441904.
            </p>
          </div>
        ) : (
          <div style={{ background: '#1E1C19', borderRadius: 12, border: '1px solid #3A3632', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 750 }}>
              <thead>
                <tr style={{ background: '#2A2825', borderBottom: '1px solid #3A3632', fontSize: '0.75rem', color: '#D4B483', textTransform: 'uppercase' }}>
                  <th style={{ padding: '1rem' }}>Client Details</th>
                  <th style={{ padding: '1rem' }}>Boutique Location</th>
                  <th style={{ padding: '1rem' }}>Consultation Type</th>
                  <th style={{ padding: '1rem' }}>Date &amp; Slot</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((appt) => (
                  <tr key={appt._id} style={{ borderBottom: '1px solid #2A2825', fontSize: '0.85rem' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 600, color: '#FFFFFF' }}>{appt.customer?.name || 'Customer'}</div>
                      <div style={{ fontSize: '0.75rem', color: '#B8AFA8' }}>{appt.customer?.phone || appt.customer?.email}</div>
                    </td>
                    <td style={{ padding: '1rem', color: '#F6F1E8' }}>
                      <div style={{ fontWeight: 500 }}>Near Post Office, Bhandara</div>
                      <div style={{ fontSize: '0.75rem', color: '#B8AFA8' }}>PIN: 441904</div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ textTransform: 'capitalize', color: '#D4B483', fontWeight: 600 }}>
                        {appt.type || 'Comprehensive Eye Exam'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ color: '#FFFFFF' }}>{new Date(appt.date).toLocaleDateString()}</div>
                      <div style={{ fontSize: '0.75rem', color: '#B8AFA8' }}>{appt.timeSlot}</div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span
                        style={{
                          padding: '2px 8px',
                          borderRadius: 4,
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          background: appt.status === 'confirmed' ? '#273822' : '#3D341F',
                          color: appt.status === 'confirmed' ? '#8FC87A' : '#D4B483',
                        }}
                      >
                        {appt.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {/* Update Booking Status Modal */}
      {selectedBooking && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.75)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            style={{
              background: '#1E1C19',
              border: '1px solid #3A3632',
              borderRadius: 12,
              padding: '1.75rem',
              width: '100%',
              maxWidth: 480,
              color: '#F6F1E8',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontFamily: 'Georgia, serif', margin: 0, fontSize: '1.2rem', color: '#FFFFFF' }}>
                Update Try-at-Home Status
              </h3>
              <button onClick={() => setSelectedBooking(null)} style={{ background: 'none', border: 'none', color: '#B8AFA8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#B8AFA8', marginBottom: '1.25rem' }}>
              Client: <strong>{selectedBooking.customer?.name}</strong> &bull; Location: {selectedBooking.address?.city}, Maharashtra
            </p>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#D4B483', marginBottom: 6 }}>
                Fulfillment Status
              </label>
              <select
                value={statusVal}
                onChange={(e) => setStatusVal(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem',
                  borderRadius: 6,
                  background: '#2A2825',
                  border: '1px solid #3A3632',
                  color: '#FFF',
                  fontSize: '0.85rem',
                }}
              >
                <option value="scheduled">Scheduled for Dispatch</option>
                <option value="in_transit">In Transit (Optical Specialist En Route)</option>
                <option value="completed">Trial Completed &amp; Frames Collected</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                style={{
                  background: '#2A2825',
                  color: '#B8AFA8',
                  border: '1px solid #3A3632',
                  padding: '0.6rem 1.25rem',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: '0.82rem',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={updating}
                onClick={() => handleUpdateStatus(selectedBooking._id)}
                style={{
                  background: '#D4B483',
                  color: '#1E1C19',
                  border: 'none',
                  padding: '0.6rem 1.5rem',
                  borderRadius: 6,
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: updating ? 'not-allowed' : 'pointer',
                }}
              >
                {updating ? 'Updating…' : 'Save Status'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
