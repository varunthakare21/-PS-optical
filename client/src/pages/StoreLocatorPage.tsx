import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, Search, Calendar, Navigation } from 'lucide-react';
import { storesAPI } from '../services/api';
import { Store } from '../types';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function StoreLocatorPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchCity, setSearchCity] = useState('');
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  useEffect(() => {
    setLoading(true);
    storesAPI.getAll(searchCity ? { city: searchCity } : undefined)
      .then((res) => {
        const list = res.data.data || [];
        setStores(list);
        if (list.length > 0) setSelectedStore(list[0]);
      })
      .catch(() => setStores([]))
      .finally(() => setLoading(false));
  }, [searchCity]);

  return (
    <div style={{ maxWidth: 1340, margin: '0 auto', padding: '2rem 1.5rem 5rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#B65E43', margin: '0 0 0.5rem' }}>
          Exclusive Optical Boutique
        </p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 700, color: '#30251F', margin: 0 }}>
          PS OPTICAL Flagship — Bhandara
        </h1>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', color: '#72785A', marginTop: '0.5rem', lineHeight: 1.6 }}>
          Visit our premier optical boutique at <strong>Near Post Office, Bhandara, Maharashtra - 441904</strong> for complimentary zero-error eye exams, custom lens tailoring, and luxury frame styling.
        </p>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#F0EAE0', padding: '0.5rem 1rem', borderRadius: 8, marginTop: '0.75rem', fontSize: '0.85rem', color: '#30251F' }}>
          <span>🚚</span>
          <span><strong>Statewide Delivery:</strong> We ship all designer frames &amp; prescription glasses <strong>all over Maharashtra</strong> directly to your doorstep.</span>
        </div>
      </div>

      {/* Search Input */}
      <div style={{ maxWidth: 480, marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'white', borderRadius: 8, padding: '0.65rem 1rem', border: '1.5px solid #D8CFC4' }}>
          <Search size={18} style={{ color: '#A89C8C' }} />
          <input
            type="text"
            placeholder="Search store (e.g. Bhandara, 441904)"
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            style={{ border: 'none', background: 'none', outline: 'none', fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: '#30251F', width: '100%' }}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '6rem 0', display: 'flex', justifyContent: 'center' }}><LoadingSpinner size="lg" /></div>
      ) : stores.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: 12 }}>
          <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.2rem', color: '#30251F' }}>No stores found in "{searchCity}"</p>
          <button onClick={() => setSearchCity('')} style={{ marginTop: '0.5rem', background: '#B65E43', color: 'white', border: 'none', padding: '0.6rem 1.25rem', borderRadius: 6, cursor: 'pointer' }}>
            Show all stores
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '2.5rem' }} className="grid-cols-1! lg:grid-cols-2!">
          {/* Store List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {stores.map((s) => {
              const active = selectedStore?._id === s._id;
              return (
                <div
                  key={s._id}
                  onClick={() => setSelectedStore(s)}
                  style={{
                    background: 'white', borderRadius: 14, padding: '1.5rem',
                    border: active ? '2px solid #B65E43' : '1px solid #E8E0D0',
                    boxShadow: active ? '0 8px 32px rgba(182,94,67,0.12)' : '0 2px 10px rgba(48,37,31,0.04)',
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}
                >
                  <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', color: '#30251F', margin: '0 0 0.5rem' }}>
                    {s.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: '#4A3A33', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                    <MapPin size={16} style={{ color: '#B65E43', marginTop: 2, flexShrink: 0 }} />
                    <span>{s.address.street}, {s.address.city}, {s.address.state} - {s.address.pincode}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#72785A', fontSize: '0.82rem', marginBottom: '1rem' }}>
                    <Phone size={14} style={{ color: '#72785A' }} />
                    <span>{s.phone}</span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                    {s.services?.map((svc) => (
                      <span key={svc} style={{ background: '#F6F1E8', color: '#30251F', fontSize: '0.72rem', padding: '3px 8px', borderRadius: 4 }}>
                        ✓ {svc}
                      </span>
                    ))}
                  </div>

                  <Link
                    to={`/appointment?store=${s._id}`}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                      background: '#B65E43', color: 'white', textDecoration: 'none',
                      padding: '0.6rem 1.25rem', borderRadius: 6, fontFamily: 'Inter, sans-serif',
                      fontSize: '0.8rem', fontWeight: 600,
                    }}
                  >
                    <Calendar size={14} /> Book Eye Test at this Store
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Interactive Map / Store Detail View */}
          <div style={{ position: 'sticky', top: 90, height: 'fit-content' }}>
            {selectedStore && (
              <div style={{ background: 'white', borderRadius: 14, overflow: 'hidden', border: '1px solid #F0EAE0', boxShadow: '0 4px 20px rgba(48,37,31,0.06)' }}>
                {selectedStore.images?.[0] && (
                  <div style={{ height: 200, width: '100%', overflow: 'hidden' }}>
                    <img src={selectedStore.images[0]} alt={selectedStore.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
                <div style={{ padding: '1.75rem' }}>
                  <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.35rem', color: '#30251F', margin: '0 0 1rem' }}>
                    {selectedStore.name}
                  </h3>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <h5 style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', textTransform: 'uppercase', color: '#72785A', margin: '0 0 0.5rem' }}>
                      Opening Hours
                    </h5>
                    {selectedStore.openingHours?.map((oh, idx) => (
                      <p key={idx} style={{ margin: '2px 0', fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: '#30251F' }}>
                        <strong>{oh.day}:</strong> {oh.closed ? 'Closed' : `${oh.open} – ${oh.close}`}
                      </p>
                    ))}
                  </div>

                  {/* Simulated Map / Directions widget */}
                  <div style={{ background: '#F6F1E8', borderRadius: 8, padding: '1.25rem', textAlign: 'center', marginBottom: '1.5rem' }}>
                    <MapPin size={24} style={{ color: '#B65E43', marginBottom: 4 }} />
                    <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: 600, color: '#30251F' }}>
                      Map Coordinates
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: '#72785A' }}>
                      Lat: {selectedStore.address.coordinates?.lat || 19.0760}, Lng: {selectedStore.address.coordinates?.lng || 72.8777}
                    </p>
                  </div>

                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(`${selectedStore.name} ${selectedStore.address.street} ${selectedStore.address.city}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                      width: '100%', background: '#30251F', color: '#F6F1E8', textDecoration: 'none',
                      padding: '0.8rem', borderRadius: 6, fontFamily: 'Inter, sans-serif',
                      fontSize: '0.85rem', fontWeight: 600,
                    }}
                  >
                    <Navigation size={15} /> Get Driving Directions
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
