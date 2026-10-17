import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Check, Calendar, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';
import { productsAPI, tryAtHomeAPI } from '../services/api';
import { Product } from '../types';
import { useAuth } from '../features/auth/AuthContext';
import { useToast } from '../components/ui/Toaster';

export default function TryAtHomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Maharashtra');
  const [pincode, setPincode] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('10:00 AM - 01:00 PM');
  const [submitting, setSubmitting] = useState(false);
  const [booked, setBooked] = useState(false);

  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone || '');
    }
    productsAPI.getProducts({ limit: 12 }).then((res) => {
      setProducts(res.data.data || []);
    });
  }, [user]);

  const toggleSelect = (id: string) => {
    if (selectedProductIds.includes(id)) {
      setSelectedProductIds(selectedProductIds.filter((p) => p !== id));
    } else {
      if (selectedProductIds.length >= 5) {
        showToast('You can select a maximum of 5 frames to try at home.', 'warning');
        return;
      }
      setSelectedProductIds([...selectedProductIds, id]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast('Please sign in to book Try-at-Home.', 'info');
      navigate('/customer/login?redirect=/try-at-home');
      return;
    }
    if (selectedProductIds.length === 0) {
      showToast('Please choose at least 1 frame to try.', 'warning');
      return;
    }
    setSubmitting(true);
    try {
      await tryAtHomeAPI.book({
        productIds: selectedProductIds,
        deliveryAddress: { street, city, state, pincode },
        preferredDate,
        timeSlot,
        customerName: name,
        customerPhone: phone,
      });
      setBooked(true);
      showToast('Try-at-Home session booked! We will confirm via SMS.', 'success');
    } catch {
      showToast('Failed to book Try-at-Home session.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const inp = {
    width: '100%', padding: '0.75rem 0.9rem', border: '1.5px solid #E8E2D9',
    borderRadius: 7, fontFamily: 'Inter, sans-serif', fontSize: '0.9rem',
    color: '#30251F', background: 'white', outline: 'none', boxSizing: 'border-box' as const,
  };

  if (booked) {
    return (
      <div style={{ maxWidth: 640, margin: '4rem auto 6rem', padding: '0 1.5rem', textAlign: 'center' }}>
        <div style={{ background: 'white', borderRadius: 16, padding: '3rem 2rem', border: '1px solid #F0EAE0' }}>
          <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '50%', background: '#F0EAE0', marginBottom: '1rem' }}>
            <Package size={44} style={{ color: '#72785A' }} />
          </div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.75rem', color: '#30251F', margin: '0 0 0.5rem' }}>
            Try-at-Home Confirmed!
          </h2>
          <p style={{ fontFamily: 'Inter, sans-serif', color: '#72785A', margin: '0 0 1.5rem', lineHeight: 1.6 }}>
            Our optical representative will deliver your {selectedProductIds.length} chosen frames on {preferredDate} during {timeSlot}.
          </p>
          <button
            onClick={() => navigate('/customer/dashboard')}
            style={{ background: '#B65E43', color: 'white', padding: '0.85rem 1.75rem', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}
          >
            Go to My Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '2rem 1.5rem 5rem' }}>
      <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#B65E43', margin: '0 0 0.5rem' }}>
          At Your Doorstep
        </p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 700, color: '#30251F', margin: 0 }}>
          Try at Home Service
        </h1>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', color: '#72785A', marginTop: '0.5rem', maxWidth: 600, margin: '0.5rem auto 0' }}>
          Pick up to 5 favorite frames. We deliver them to your door with a certified optician for a 48-hour trial and pupil distance measurement.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '3rem' }} className="grid-cols-1! lg:grid-cols-2!">
          {/* Step 1: Select Frames */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', color: '#30251F', margin: 0 }}>
                1. Select Up to 5 Frames ({selectedProductIds.length}/5 Selected)
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
              {products.map((p) => {
                const selected = selectedProductIds.includes(p._id);
                return (
                  <div
                    key={p._id}
                    onClick={() => toggleSelect(p._id)}
                    style={{
                      background: 'white', borderRadius: 12, padding: '0.875rem',
                      border: selected ? '2px solid #B65E43' : '1px solid #E8E0D0',
                      boxShadow: selected ? '0 4px 16px rgba(182,94,67,0.15)' : 'none',
                      cursor: 'pointer', position: 'relative',
                    }}
                  >
                    {selected && (
                      <span style={{ position: 'absolute', top: 8, right: 8, background: '#B65E43', color: 'white', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>
                        ✓
                      </span>
                    )}
                    <div style={{ width: '100%', height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F6F1E8', borderRadius: 8, marginBottom: 8 }}>
                      {p.images?.[0] && <img src={p.images[0]} alt="" style={{ maxWidth: '90%', maxHeight: '80%', objectFit: 'contain' }} />}
                    </div>
                    <p style={{ margin: '0 0 2px', fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', fontWeight: 600, color: '#30251F' }}>
                      {p.name}
                    </p>
                    <p style={{ margin: 0, fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#B65E43' }}>
                      ₹{(p.salePrice || p.basePrice).toLocaleString()}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 2: Delivery & Date Information */}
          <div>
            <div style={{ background: 'white', borderRadius: 14, padding: '2rem', border: '1px solid #F0EAE0', boxShadow: '0 4px 20px rgba(48,37,31,0.05)' }}>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', color: '#30251F', margin: '0 0 1.25rem' }}>
                2. Delivery &amp; Schedule
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <input type="text" required placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} style={inp} />
                  <input type="tel" required placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} style={inp} />
                </div>

                <input type="text" required placeholder="Delivery Address" value={street} onChange={(e) => setStreet(e.target.value)} style={inp} />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                  <input type="text" required placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} style={inp} />
                  <input type="text" required placeholder="State" value={state} onChange={(e) => setState(e.target.value)} style={inp} />
                  <input type="text" maxLength={6} required placeholder="PIN Code" value={pincode} onChange={(e) => setPincode(e.target.value)} style={inp} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#4A3A33', marginBottom: 4 }}>Date</label>
                    <input type="date" required min={new Date().toISOString().split('T')[0]} value={preferredDate} onChange={(e) => setPreferredDate(e.target.value)} style={inp} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#4A3A33', marginBottom: 4 }}>Slot</label>
                    <select value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)} style={inp}>
                      <option value="10:00 AM - 01:00 PM">10:00 AM - 01:00 PM</option>
                      <option value="02:00 PM - 05:00 PM">02:00 PM - 05:00 PM</option>
                      <option value="05:00 PM - 08:00 PM">05:00 PM - 08:00 PM</option>
                    </select>
                  </div>
                </div>

                <div style={{ padding: '0.875rem', background: '#F6F1E8', borderRadius: 8, fontSize: '0.78rem', color: '#72785A' }}>
                  ✓ 100% Free Service · No purchase obligation · Certified optician accompanied
                </div>

                <button
                  type="submit"
                  disabled={submitting || selectedProductIds.length === 0}
                  style={{
                    padding: '0.95rem', background: submitting || selectedProductIds.length === 0 ? '#C97259' : '#B65E43',
                    color: 'white', border: 'none', borderRadius: 7, fontFamily: 'Inter, sans-serif',
                    fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', cursor: submitting || selectedProductIds.length === 0 ? 'not-allowed' : 'pointer',
                  }}
                >
                  {submitting ? 'Booking Session…' : 'Confirm Try-at-Home Booking'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
