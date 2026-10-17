import { useState, useEffect } from 'react';
import { Store as StoreIcon, Plus, Edit2, MapPin, Phone, X, Check } from 'lucide-react';
import { adminAPI } from '../../services/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function AdminStores() {
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStore, setEditingStore] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: '',
    slug: '',
    phone: '',
    email: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    services: 'Eye Testing, Frame Styling, Lens Fitting, Contact Lens Consultation',
    isActive: true,
  });

  const fetchStores = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getStores();
      setStores(res.data.data || []);
    } catch {
      setStores([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const openCreate = () => {
    setEditingStore(null);
    setForm({
      name: '',
      slug: '',
      phone: '+91 ',
      email: '',
      street: '',
      city: '',
      state: '',
      pincode: '',
      services: 'Eye Testing, Frame Styling, Lens Fitting, Contact Lens Consultation',
      isActive: true,
    });
    setShowModal(true);
  };

  const openEdit = (store: any) => {
    setEditingStore(store);
    setForm({
      name: store.name,
      slug: store.slug,
      phone: store.phone,
      email: store.email || '',
      street: store.address?.street || '',
      city: store.address?.city || '',
      state: store.address?.state || '',
      pincode: store.address?.pincode || '',
      services: Array.isArray(store.services) ? store.services.join(', ') : store.services || '',
      isActive: store.isActive ?? true,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload = {
        name: form.name,
        slug: form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        phone: form.phone,
        email: form.email,
        address: {
          street: form.street,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
          country: 'India',
        },
        services: form.services.split(',').map((s) => s.trim()),
        isActive: form.isActive,
      };

      if (editingStore) {
        await adminAPI.updateStore(editingStore._id, payload);
      } else {
        await adminAPI.createStore(payload);
      }
      setShowModal(false);
      await fetchStores();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save store');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ color: '#F6F1E8' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.85rem', margin: '0 0 0.25rem', color: '#FFFFFF' }}>
            Flagship Optical Stores
          </h1>
          <p style={{ color: '#B8AFA8', margin: 0, fontSize: '0.85rem' }}>
            Omnichannel physical boutique locations, opening schedules, and consultation centers.
          </p>
        </div>
        <button
          onClick={openCreate}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: '#D4B483',
            color: '#1E1C19',
            border: 'none',
            padding: '0.65rem 1.25rem',
            borderRadius: 6,
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer',
          }}
        >
          <Plus size={16} /> Add Flagship Store
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '4rem 0', display: 'flex', justifyContent: 'center' }}>
          <LoadingSpinner size="md" />
        </div>
      ) : stores.length === 0 ? (
        <div style={{ background: '#1E1C19', borderRadius: 12, padding: '3.5rem 2rem', textAlign: 'center', border: '1px solid #3A3632' }}>
          <StoreIcon size={44} style={{ color: '#72785A', marginBottom: '1rem' }} />
          <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', color: '#FFFFFF' }}>No stores registered</h3>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {stores.map((s) => (
            <div
              key={s._id}
              style={{
                background: '#1E1C19',
                borderRadius: 12,
                padding: '1.5rem',
                border: '1px solid #3A3632',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', color: '#FFFFFF', margin: 0 }}>
                    {s.name}
                  </h3>
                  <button
                    onClick={() => openEdit(s)}
                    style={{ background: '#2A2825', border: '1px solid #3A3632', color: '#D4B483', padding: '0.35rem 0.5rem', borderRadius: 4, cursor: 'pointer' }}
                  >
                    <Edit2 size={13} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', color: '#B8AFA8', fontSize: '0.85rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <MapPin size={14} style={{ color: '#D4B483', marginTop: 2, flexShrink: 0 }} />
                    <span>{s.address?.street}, {s.address?.city}, {s.address?.state} - {s.address?.pincode}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Phone size={14} style={{ color: '#D4B483', flexShrink: 0 }} />
                    <span>{s.phone}</span>
                  </div>
                </div>

                {s.services && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
                    {s.services.map((svc: string, i: number) => (
                      <span key={i} style={{ background: '#2A2825', border: '1px solid #3A3632', padding: '2px 8px', borderRadius: 4, fontSize: '0.7rem', color: '#D4B483' }}>
                        {svc}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ borderTop: '1px solid #2A2825', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
                <span style={{ color: '#72785A' }}>Slug: /{s.slug}</span>
                <span style={{ color: s.isActive ? '#8FC87A' : '#E88B6E', fontWeight: 700 }}>
                  {s.isActive ? 'OPERATIONAL' : 'CLOSED'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#1E1C19', border: '1px solid #3A3632', borderRadius: 12, padding: '2rem', width: '100%', maxWidth: 540, color: '#F6F1E8' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', color: '#FFFFFF', margin: 0 }}>
                {editingStore ? 'Edit Store' : 'Add Store'}
              </h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#B8AFA8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#D4B483', marginBottom: 4 }}>Store Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  placeholder="e.g. PS OPTICAL Indiranagar Flagship"
                  style={{ width: '100%', padding: '0.65rem', borderRadius: 6, background: '#2A2825', border: '1px solid #3A3632', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#D4B483', marginBottom: 4 }}>Phone</label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    required
                    style={{ width: '100%', padding: '0.65rem', borderRadius: 6, background: '#2A2825', border: '1px solid #3A3632', color: '#fff' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#D4B483', marginBottom: 4 }}>Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: 6, background: '#2A2825', border: '1px solid #3A3632', color: '#fff' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#D4B483', marginBottom: 4 }}>Street Address</label>
                <input
                  type="text"
                  value={form.street}
                  onChange={(e) => setForm({ ...form, street: e.target.value })}
                  required
                  style={{ width: '100%', padding: '0.65rem', borderRadius: 6, background: '#2A2825', border: '1px solid #3A3632', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#D4B483', marginBottom: 4 }}>City</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    required
                    style={{ width: '100%', padding: '0.65rem', borderRadius: 6, background: '#2A2825', border: '1px solid #3A3632', color: '#fff' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#D4B483', marginBottom: 4 }}>State</label>
                  <input
                    type="text"
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                    required
                    style={{ width: '100%', padding: '0.65rem', borderRadius: 6, background: '#2A2825', border: '1px solid #3A3632', color: '#fff' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#D4B483', marginBottom: 4 }}>Pincode</label>
                  <input
                    type="text"
                    value={form.pincode}
                    onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                    required
                    style={{ width: '100%', padding: '0.65rem', borderRadius: 6, background: '#2A2825', border: '1px solid #3A3632', color: '#fff' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#D4B483', marginBottom: 4 }}>Services (comma separated)</label>
                <input
                  type="text"
                  value={form.services}
                  onChange={(e) => setForm({ ...form, services: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: 6, background: '#2A2825', border: '1px solid #3A3632', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{ background: '#2A2825', color: '#B8AFA8', border: '1px solid #3A3632', padding: '0.65rem 1.25rem', borderRadius: 6, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{ background: '#D4B483', color: '#1E1C19', border: 'none', padding: '0.65rem 1.75rem', borderRadius: 6, fontWeight: 700, cursor: 'pointer' }}
                >
                  {submitting ? 'Saving...' : 'Save Store'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
