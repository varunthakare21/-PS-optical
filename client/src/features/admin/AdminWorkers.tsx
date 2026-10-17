import { useState, useEffect } from 'react';
import { ShieldCheck, Plus, User, Store, Mail, Phone, X, Check } from 'lucide-react';
import { adminAPI } from '../../services/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function AdminWorkers() {
  const [workers, setWorkers] = useState<any[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    storeId: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [workersRes, storesRes] = await Promise.all([
        adminAPI.getWorkers(),
        adminAPI.getStores(),
      ]);
      setWorkers(workersRes.data.data || []);
      setStores(storesRes.data.data || []);
      if (storesRes.data.data?.length > 0) {
        setForm((prev) => ({ ...prev, storeId: storesRes.data.data[0]._id }));
      }
    } catch {
      setWorkers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.storeId) {
      alert('All fields including assigned store are required.');
      return;
    }
    try {
      setSubmitting(true);
      await adminAPI.createWorker(form);
      setShowModal(false);
      setForm({ name: '', email: '', phone: '', password: '', storeId: stores[0]?._id || '' });
      await fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create worker account');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ color: '#F6F1E8' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.85rem', margin: '0 0 0.25rem', color: '#FFFFFF' }}>
            Optical Store Staff &amp; Opticians
          </h1>
          <p style={{ color: '#B8AFA8', margin: 0, fontSize: '0.85rem' }}>
            Provision staff accounts with store-specific inventory and vision appointment access.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
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
          <Plus size={16} /> Provision Staff Account
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '4rem 0', display: 'flex', justifyContent: 'center' }}>
          <LoadingSpinner size="md" />
        </div>
      ) : workers.length === 0 ? (
        <div style={{ background: '#1E1C19', borderRadius: 12, padding: '3.5rem 2rem', textAlign: 'center', border: '1px solid #3A3632' }}>
          <ShieldCheck size={44} style={{ color: '#72785A', marginBottom: '1rem' }} />
          <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', color: '#FFFFFF' }}>No worker accounts provisioned</h3>
          <p style={{ color: '#B8AFA8', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            Create accounts for store opticians to manage local appointments and inventories.
          </p>
        </div>
      ) : (
        <div style={{ background: '#1E1C19', borderRadius: 12, border: '1px solid #3A3632', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 640 }}>
            <thead>
              <tr style={{ background: '#2A2825', borderBottom: '1px solid #3A3632', fontSize: '0.75rem', color: '#D4B483', textTransform: 'uppercase' }}>
                <th style={{ padding: '1rem' }}>Staff Member</th>
                <th style={{ padding: '1rem' }}>Assigned Store</th>
                <th style={{ padding: '1rem' }}>Contact</th>
                <th style={{ padding: '1rem' }}>Status</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Joined</th>
              </tr>
            </thead>
            <tbody>
              {workers.map((w) => (
                <tr key={w._id} style={{ borderBottom: '1px solid #2A2825', fontSize: '0.85rem' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 600, color: '#FFFFFF' }}>{w.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#D4B483' }}>Store Optician</div>
                  </td>
                  <td style={{ padding: '1rem', color: '#FFFFFF' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Store size={14} style={{ color: '#D4B483' }} />
                      <span>{w.storeId?.name || 'Unassigned'}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem', color: '#B8AFA8' }}>
                    <div>{w.email}</div>
                    {w.phone && <div style={{ fontSize: '0.75rem', color: '#72785A' }}>{w.phone}</div>}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: 4,
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        background: w.accountStatus === 'active' ? '#273822' : '#3D281F',
                        color: w.accountStatus === 'active' ? '#8FC87A' : '#E88B6E',
                      }}
                    >
                      {w.accountStatus}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right', color: '#B8AFA8' }}>
                    {new Date(w.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Provision Staff Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#1E1C19', border: '1px solid #3A3632', borderRadius: 12, padding: '2rem', width: '100%', maxWidth: 480, color: '#F6F1E8' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', color: '#FFFFFF', margin: 0 }}>
                Provision Optical Worker
              </h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#B8AFA8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#D4B483', marginBottom: 4 }}>Staff Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  placeholder="e.g. Ramesh Kumar"
                  style={{ width: '100%', padding: '0.65rem', borderRadius: 6, background: '#2A2825', border: '1px solid #3A3632', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#D4B483', marginBottom: 4 }}>Work Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  placeholder="staff@psoptical.com"
                  style={{ width: '100%', padding: '0.65rem', borderRadius: 6, background: '#2A2825', border: '1px solid #3A3632', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#D4B483', marginBottom: 4 }}>Phone</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  style={{ width: '100%', padding: '0.65rem', borderRadius: 6, background: '#2A2825', border: '1px solid #3A3632', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#D4B483', marginBottom: 4 }}>Assigned Optical Store</label>
                <select
                  value={form.storeId}
                  onChange={(e) => setForm({ ...form, storeId: e.target.value })}
                  required
                  style={{ width: '100%', padding: '0.65rem', borderRadius: 6, background: '#2A2825', border: '1px solid #3A3632', color: '#fff' }}
                >
                  {stores.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name} ({s.address?.city})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#D4B483', marginBottom: 4 }}>Temporary Password</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  minLength={8}
                  placeholder="Min 8 characters"
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
                  {submitting ? 'Creating...' : 'Provision Worker'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
