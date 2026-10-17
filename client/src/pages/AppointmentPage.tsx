import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, CheckCircle, ShieldCheck } from 'lucide-react';
import { storesAPI, appointmentsAPI } from '../services/api';
import { Store } from '../types';
import { useAuth } from '../features/auth/AuthContext';
import { useToast } from '../components/ui/Toaster';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function AppointmentPage() {
  const [searchParams] = useSearchParams();
  const preselectedStoreId = searchParams.get('store');

  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState(preselectedStoreId || '');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [slots, setSlots] = useState<{ time: string; available: boolean }[]>([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone || '');
    }
  }, [user]);

  useEffect(() => {
    storesAPI.getAll().then((res) => {
      const list = res.data.data || [];
      setStores(list);
      if (!selectedStoreId && list.length > 0) {
        setSelectedStoreId(list[0]._id);
      }
    });
  }, []);

  useEffect(() => {
    if (!selectedStoreId || !selectedDate) return;
    setLoadingSlots(true);
    storesAPI.getAvailability(selectedStoreId, selectedDate)
      .then((res) => {
        setSlots(res.data.data?.slots || []);
        setSelectedSlot('');
      })
      .catch(() => setSlots([]))
      .finally(() => setLoadingSlots(false));
  }, [selectedStoreId, selectedDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast('Please sign in to book an eye examination.', 'info');
      navigate('/customer/login?redirect=/appointment');
      return;
    }
    if (!selectedSlot) {
      showToast('Please select a time slot.', 'warning');
      return;
    }
    setSubmitting(true);
    try {
      await appointmentsAPI.book({
        storeId: selectedStoreId,
        date: selectedDate,
        timeSlot: selectedSlot,
        type: 'eye_test',
        customerName: name,
        customerPhone: phone,
        notes,
      });
      setBookingSuccess(true);
      showToast('Appointment confirmed! Details have been sent to your email.', 'success');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to book appointment.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const inp = {
    width: '100%', padding: '0.75rem 1rem', border: '1.5px solid #E8E2D9',
    borderRadius: 7, fontFamily: 'Inter, sans-serif', fontSize: '0.9rem',
    color: '#30251F', background: 'white', outline: 'none', boxSizing: 'border-box' as const,
  };

  if (bookingSuccess) {
    return (
      <div style={{ maxWidth: 640, margin: '4rem auto 6rem', padding: '0 1.5rem', textAlign: 'center' }}>
        <div style={{ background: 'white', borderRadius: 16, padding: '3rem 2rem', border: '1px solid #F0EAE0' }}>
          <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '50%', background: '#F0EAE0', marginBottom: '1rem' }}>
            <CheckCircle size={44} style={{ color: '#72785A' }} />
          </div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.75rem', color: '#30251F', margin: '0 0 0.5rem' }}>
            Appointment Confirmed!
          </h2>
          <p style={{ fontFamily: 'Inter, sans-serif', color: '#72785A', margin: '0 0 1.5rem', lineHeight: 1.6 }}>
            Your eye examination appointment has been booked. Our senior optometrist looks forward to welcoming you.
          </p>
          <div style={{ background: '#F6F1E8', borderRadius: 10, padding: '1.25rem', textAlign: 'left', marginBottom: '2rem' }}>
            <p style={{ margin: '4px 0', fontSize: '0.85rem' }}><strong>Date:</strong> {selectedDate}</p>
            <p style={{ margin: '4px 0', fontSize: '0.85rem' }}><strong>Time Slot:</strong> {selectedSlot}</p>
            <p style={{ margin: '4px 0', fontSize: '0.85rem' }}><strong>Patient:</strong> {name} ({phone})</p>
          </div>
          <button
            onClick={() => navigate('/customer/appointments')}
            style={{ background: '#B65E43', color: 'white', padding: '0.85rem 1.75rem', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}
          >
            View in My Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '2rem 1.5rem 5rem' }}>
      <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#B65E43', margin: '0 0 0.5rem' }}>
          Optometric Care
        </p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 700, color: '#30251F', margin: 0 }}>
          Book a Free Eye-Test Appointment
        </h1>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', color: '#72785A', marginTop: '0.5rem', maxWidth: 600, margin: '0.5rem auto 0' }}>
          Comprehensive 12-point digital eye examination conducted by certified optometrists at our flagship stores.
        </p>
      </div>

      <div style={{ background: 'white', borderRadius: 16, padding: '2.5rem', border: '1px solid #F0EAE0', boxShadow: '0 8px 32px rgba(48,37,31,0.05)' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Step 1: Select Store */}
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: '#30251F', marginBottom: '0.75rem' }}>
              1. Select Optical Store Location
            </label>
            <select
              value={selectedStoreId}
              onChange={(e) => setSelectedStoreId(e.target.value)}
              style={inp}
            >
              {stores.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name} — {s.address.city}
                </option>
              ))}
            </select>
          </div>

          {/* Step 2: Date & Slots */}
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: '#30251F', marginBottom: '0.75rem' }}>
              2. Select Preferred Date &amp; Time
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }} className="grid-cols-1! md:grid-cols-2!">
              <div>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  style={inp}
                />
              </div>

              <div>
                {loadingSlots ? (
                  <div style={{ padding: '1rem', textAlign: 'center', color: '#72785A' }}>Checking slot availability…</div>
                ) : slots.length === 0 ? (
                  <p style={{ color: '#B65E43', fontSize: '0.85rem' }}>No slots available on this date. Please choose another date.</p>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '0.5rem', maxHeight: 180, overflowY: 'auto' }}>
                    {slots.map((s) => (
                      <button
                        key={s.time}
                        type="button"
                        disabled={!s.available}
                        onClick={() => setSelectedSlot(s.time)}
                        style={{
                          padding: '0.5rem', borderRadius: 6, fontSize: '0.82rem',
                          fontFamily: 'Inter, sans-serif', fontWeight: 600,
                          border: selectedSlot === s.time ? '2px solid #B65E43' : '1px solid #D8CFC4',
                          background: selectedSlot === s.time ? '#B65E43' : s.available ? 'white' : '#EDE5D4',
                          color: selectedSlot === s.time ? 'white' : s.available ? '#30251F' : '#A89C8C',
                          cursor: s.available ? 'pointer' : 'not-allowed',
                        }}
                      >
                        {s.time}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Step 3: Contact Details */}
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: '#30251F', marginBottom: '0.75rem' }}>
              3. Patient Information
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <input
                  type="text"
                  required
                  placeholder="Your Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={inp}
                />
              </div>
              <div>
                <input
                  type="tel"
                  required
                  placeholder="10-digit Mobile Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={inp}
                />
              </div>
            </div>
            <textarea
              rows={2}
              placeholder="Any specific vision concerns or requirements (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{ ...inp, resize: 'vertical' }}
            />
          </div>

          <button
            type="submit"
            disabled={submitting || !selectedSlot}
            style={{
              padding: '1rem', background: submitting || !selectedSlot ? '#C97259' : '#B65E43',
              color: 'white', border: 'none', borderRadius: 7, fontFamily: 'Inter, sans-serif',
              fontSize: '0.95rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em',
              cursor: submitting || !selectedSlot ? 'not-allowed' : 'pointer', transition: 'background 0.2s',
            }}
          >
            {submitting ? 'Confirming Appointment…' : 'Confirm Eye-Test Booking'}
          </button>
        </form>
      </div>
    </div>
  );
}
