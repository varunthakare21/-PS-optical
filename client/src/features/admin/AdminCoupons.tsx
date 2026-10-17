import { useState, useEffect } from 'react';
import { Tag, Plus, Edit2, Check, X, Calendar } from 'lucide-react';
import { adminAPI } from '../../services/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    code: '',
    description: '',
    type: 'percentage',
    value: 15,
    minOrderAmount: 2000,
    maxDiscount: 1000,
    usageLimit: 500,
    validFrom: new Date().toISOString().split('T')[0],
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    isActive: true,
  });

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getCoupons();
      setCoupons(res.data.data || []);
    } catch {
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await adminAPI.createCoupon({
        ...form,
        code: form.code.toUpperCase().trim(),
        validFrom: new Date(form.validFrom),
        validUntil: new Date(form.validUntil),
      });
      setShowModal(false);
      setForm({
        code: '',
        description: '',
        type: 'percentage',
        value: 15,
        minOrderAmount: 2000,
        maxDiscount: 1000,
        usageLimit: 500,
        validFrom: new Date().toISOString().split('T')[0],
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        isActive: true,
      });
      await fetchCoupons();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create coupon');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ color: '#F6F1E8' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.85rem', margin: '0 0 0.25rem', color: '#FFFFFF' }}>
            Promotional Coupons &amp; Vouchers
          </h1>
          <p style={{ color: '#B8AFA8', margin: 0, fontSize: '0.85rem' }}>
            Manage discount codes, campaign vouchers, and minimum cart spending thresholds.
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
          <Plus size={16} /> New Coupon Code
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '4rem 0', display: 'flex', justifyContent: 'center' }}>
          <LoadingSpinner size="md" />
        </div>
      ) : coupons.length === 0 ? (
        <div style={{ background: '#1E1C19', borderRadius: 12, padding: '3.5rem 2rem', textAlign: 'center', border: '1px solid #3A3632' }}>
          <Tag size={44} style={{ color: '#72785A', marginBottom: '1rem' }} />
          <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', color: '#FFFFFF' }}>No coupons created</h3>
        </div>
      ) : (
        <div style={{ background: '#1E1C19', borderRadius: 12, border: '1px solid #3A3632', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 680 }}>
            <thead>
              <tr style={{ background: '#2A2825', borderBottom: '1px solid #3A3632', fontSize: '0.75rem', color: '#D4B483', textTransform: 'uppercase' }}>
                <th style={{ padding: '1rem' }}>Promo Code</th>
                <th style={{ padding: '1rem' }}>Discount</th>
                <th style={{ padding: '1rem' }}>Min Order</th>
                <th style={{ padding: '1rem' }}>Usage Count</th>
                <th style={{ padding: '1rem' }}>Valid Window</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c._id} style={{ borderBottom: '1px solid #2A2825', fontSize: '0.85rem' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 700, color: '#D4B483', fontFamily: 'monospace', fontSize: '1rem' }}>{c.code}</div>
                    <div style={{ fontSize: '0.75rem', color: '#B8AFA8' }}>{c.description}</div>
                  </td>
                  <td style={{ padding: '1rem', color: '#FFFFFF', fontWeight: 600 }}>
                    {c.type === 'percentage' ? `${c.value}% OFF` : `₹${c.value} FLAT`}
                  </td>
                  <td style={{ padding: '1rem', color: '#B8AFA8' }}>
                    ₹{c.minOrderAmount}
                  </td>
                  <td style={{ padding: '1rem', color: '#FFFFFF' }}>
                    {c.usedCount} <span style={{ color: '#72785A', fontSize: '0.75rem' }}>/ {c.usageLimit || '∞'}</span>
                  </td>
                  <td style={{ padding: '1rem', color: '#B8AFA8', fontSize: '0.75rem' }}>
                    {new Date(c.validFrom).toLocaleDateString()} &ndash; {new Date(c.validUntil).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: 4,
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        background: c.isActive ? '#273822' : '#3D281F',
                        color: c.isActive ? '#8FC87A' : '#E88B6E',
                      }}
                    >
                      {c.isActive ? 'Active' : 'Expired'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#1E1C19', border: '1px solid #3A3632', borderRadius: 12, padding: '2rem', width: '100%', maxWidth: 500, color: '#F6F1E8' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', color: '#FFFFFF', margin: 0 }}>
                Create Promotional Coupon
              </h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#B8AFA8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#D4B483', marginBottom: 4 }}>Coupon Code</label>
                <input
                  type="text"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  required
                  placeholder="e.g. SUMMER25"
                  style={{ width: '100%', padding: '0.65rem', borderRadius: 6, background: '#2A2825', border: '1px solid #3A3632', color: '#fff', fontFamily: 'monospace' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#D4B483', marginBottom: 4 }}>Description</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                  placeholder="e.g. 15% off orders over ₹2000"
                  style={{ width: '100%', padding: '0.65rem', borderRadius: 6, background: '#2A2825', border: '1px solid #3A3632', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#D4B483', marginBottom: 4 }}>Discount Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: 6, background: '#2A2825', border: '1px solid #3A3632', color: '#fff' }}
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Flat (₹)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#D4B483', marginBottom: 4 }}>Discount Value</label>
                  <input
                    type="number"
                    value={form.value}
                    onChange={(e) => setForm({ ...form, value: parseFloat(e.target.value) || 0 })}
                    required
                    style={{ width: '100%', padding: '0.65rem', borderRadius: 6, background: '#2A2825', border: '1px solid #3A3632', color: '#fff' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#D4B483', marginBottom: 4 }}>Min Order (₹)</label>
                  <input
                    type="number"
                    value={form.minOrderAmount}
                    onChange={(e) => setForm({ ...form, minOrderAmount: parseFloat(e.target.value) || 0 })}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: 6, background: '#2A2825', border: '1px solid #3A3632', color: '#fff' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#D4B483', marginBottom: 4 }}>Usage Limit</label>
                  <input
                    type="number"
                    value={form.usageLimit}
                    onChange={(e) => setForm({ ...form, usageLimit: parseInt(e.target.value) || 0 })}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: 6, background: '#2A2825', border: '1px solid #3A3632', color: '#fff' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#D4B483', marginBottom: 4 }}>Valid From</label>
                  <input
                    type="date"
                    value={form.validFrom}
                    onChange={(e) => setForm({ ...form, validFrom: e.target.value })}
                    required
                    style={{ width: '100%', padding: '0.65rem', borderRadius: 6, background: '#2A2825', border: '1px solid #3A3632', color: '#fff' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#D4B483', marginBottom: 4 }}>Valid Until</label>
                  <input
                    type="date"
                    value={form.validUntil}
                    onChange={(e) => setForm({ ...form, validUntil: e.target.value })}
                    required
                    style={{ width: '100%', padding: '0.65rem', borderRadius: 6, background: '#2A2825', border: '1px solid #3A3632', color: '#fff' }}
                  />
                </div>
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
                  {submitting ? 'Creating...' : 'Create Promo Code'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
