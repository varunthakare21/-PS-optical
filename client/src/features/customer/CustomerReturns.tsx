import { useState, useEffect } from 'react';
import { RotateCcw, Package, Clock, CheckCircle2, XCircle, AlertCircle, Plus } from 'lucide-react';
import { returnsAPI, ordersAPI } from '../../services/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function CustomerReturns() {
  const [returns, setReturns] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    orderId: '',
    reason: 'Size / Fit issue',
    description: '',
  });

  const fetchData = async () => {
    try {
      const [returnsRes, ordersRes] = await Promise.all([
        returnsAPI.getMyReturns(),
        ordersAPI.getMyOrders(),
      ]);
      setReturns(returnsRes.data.data || []);
      // Filter orders that are delivered or confirmed for return eligibility
      setOrders(ordersRes.data.data || []);
    } catch {
      setReturns([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.orderId) {
      alert('Please select an order to return');
      return;
    }
    try {
      setSubmitting(true);
      await returnsAPI.create(formData);
      setShowForm(false);
      setFormData({ orderId: '', reason: 'Size / Fit issue', description: '' });
      await fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to request return');
    } finally {
      setSubmitting(false);
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
            Returns &amp; 14-Day Guarantee
          </h1>
          <p style={{ color: '#72785A', margin: 0, fontSize: '0.9rem' }}>
            Hassle-free returns and exchanges backed by our 14-day zero-questions guarantee.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: showForm ? '#30251F' : '#B65E43',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.25rem',
            borderRadius: 6,
            fontWeight: 600,
            fontSize: '0.9rem',
            cursor: 'pointer',
          }}
        >
          {showForm ? 'Cancel Request' : <><Plus size={16} /> Request Return</>}
        </button>
      </div>

      {showForm && (
        <div style={{ background: 'white', borderRadius: 12, padding: '2rem', border: '1px solid #D4B483', marginBottom: '2rem' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', color: '#30251F', margin: '0 0 1rem' }}>
            Initiate a Return / Exchange
          </h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#30251F', marginBottom: '0.4rem' }}>
                Select Order
              </label>
              <select
                value={formData.orderId}
                onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                required
                style={{ width: '100%', padding: '0.75rem', borderRadius: 6, border: '1px solid #D4B483', background: '#FDFBF9' }}
              >
                <option value="">-- Choose an order --</option>
                {orders.map((ord) => (
                  <option key={ord._id} value={ord._id}>
                    Order #{ord.orderNumber} — ₹{ord.total} ({ord.status})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#30251F', marginBottom: '0.4rem' }}>
                Reason for Return
              </label>
              <select
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 6, border: '1px solid #D4B483', background: '#FDFBF9' }}
              >
                <option value="Size / Fit issue">Size / Fit issue (Too tight or too loose)</option>
                <option value="Prescription mismatch">Prescription mismatch or vision blur</option>
                <option value="Style / Color not as expected">Style / Color not as expected</option>
                <option value="Damaged in transit">Damaged in transit / Defective frame</option>
                <option value="Ordered by mistake">Ordered by mistake</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#30251F', marginBottom: '0.4rem' }}>
                Additional Details (Optional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Let us know how we can resolve this or whether you'd prefer an exchange."
                rows={3}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 6, border: '1px solid #D4B483', background: '#FDFBF9', resize: 'vertical' }}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                alignSelf: 'flex-start',
                background: '#B65E43',
                color: 'white',
                border: 'none',
                padding: '0.85rem 2rem',
                borderRadius: 6,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {submitting ? 'Submitting...' : 'Submit Return Request'}
            </button>
          </form>
        </div>
      )}

      {returns.length === 0 ? (
        <div style={{ background: 'white', borderRadius: 12, padding: '3.5rem 2rem', textAlign: 'center', border: '1px solid #F0EAE0' }}>
          <RotateCcw size={44} style={{ color: '#A89C8C', marginBottom: '1rem' }} />
          <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', color: '#30251F' }}>No active returns</h3>
          <p style={{ color: '#72785A', fontSize: '0.9rem', marginTop: '0.5rem', maxWidth: 480, margin: '0.5rem auto 0' }}>
            All eligible purchases come with a 14-day replacement or full refund guarantee. Any active claims will show up here.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {returns.map((ret) => (
            <div
              key={ret._id}
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
                        ret.status === 'refunded' || ret.status === 'approved'
                          ? '#E8EFE5'
                          : ret.status === 'rejected'
                          ? '#FCE8E6'
                          : '#FFF3EE',
                      color:
                        ret.status === 'refunded' || ret.status === 'approved'
                          ? '#4A6B3D'
                          : ret.status === 'rejected'
                          ? '#C53030'
                          : '#B65E43',
                    }}
                  >
                    {ret.status.replace('_', ' ')}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: '#72785A' }}>
                    Requested on {new Date(ret.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#30251F', margin: '0 0 0.35rem' }}>
                  Order #{ret.order?.orderNumber || 'PSO-ORDER'}
                </h3>
                <p style={{ margin: '0 0 0.25rem', fontSize: '0.9rem', color: '#30251F' }}>
                  <strong>Reason:</strong> {ret.reason}
                </p>
                {ret.description && (
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#72785A' }}>
                    &ldquo;{ret.description}&rdquo;
                  </p>
                )}
                {ret.adminNotes && (
                  <div style={{ marginTop: '0.5rem', padding: '0.5rem 0.75rem', background: '#F6F1E8', borderRadius: 6, fontSize: '0.85rem', color: '#30251F' }}>
                    <strong>Update:</strong> {ret.adminNotes}
                  </div>
                )}
              </div>

              <div>
                <span style={{ fontSize: '1.15rem', fontFamily: 'Georgia, serif', fontWeight: 700, color: '#B65E43' }}>
                  {ret.order?.total ? `₹${ret.order.total.toLocaleString()}` : ''}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
