import { useState, useEffect } from 'react';
import { RotateCcw, CheckCircle, XCircle, Clock, DollarSign, Eye } from 'lucide-react';
import { adminAPI } from '../../services/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function AdminReturns() {
  const [returns, setReturns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReturn, setSelectedReturn] = useState<any | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchReturns = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getReturns();
      setReturns(res.data.data || []);
    } catch {
      setReturns([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturns();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      setUpdatingId(id);
      await adminAPI.updateReturnStatus(id, { status: newStatus });
      setReturns((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: newStatus } : r))
      );
    } catch {
      alert('Failed to update return status');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div style={{ color: '#F6F1E8' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.85rem', margin: '0 0 0.25rem', color: '#FFFFFF' }}>
            Returns &amp; 14-Day Refund Claims
          </h1>
          <p style={{ color: '#B8AFA8', margin: 0, fontSize: '0.85rem' }}>
            Inspect customer return requests, authorize reverse courier pick-ups, and issue refunds.
          </p>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '4rem 0', display: 'flex', justifyContent: 'center' }}>
          <LoadingSpinner size="md" />
        </div>
      ) : returns.length === 0 ? (
        <div style={{ background: '#1E1C19', borderRadius: 12, padding: '3.5rem 2rem', textAlign: 'center', border: '1px solid #3A3632' }}>
          <RotateCcw size={44} style={{ color: '#72785A', marginBottom: '1rem' }} />
          <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', color: '#FFFFFF' }}>No return claims</h3>
          <p style={{ color: '#B8AFA8', fontSize: '0.9rem', marginTop: '0.5rem' }}>Customer return claims will appear here for review and refund processing.</p>
        </div>
      ) : (
        <div style={{ background: '#1E1C19', borderRadius: 12, border: '1px solid #3A3632', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 700 }}>
            <thead>
              <tr style={{ background: '#2A2825', borderBottom: '1px solid #3A3632', fontSize: '0.75rem', color: '#D4B483', textTransform: 'uppercase' }}>
                <th style={{ padding: '1rem' }}>Order / Date</th>
                <th style={{ padding: '1rem' }}>Customer</th>
                <th style={{ padding: '1rem' }}>Reason</th>
                <th style={{ padding: '1rem' }}>Current Status</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {returns.map((ret) => (
                <tr key={ret._id} style={{ borderBottom: '1px solid #2A2825', fontSize: '0.85rem' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 600, color: '#FFFFFF' }}>
                      #{ret.order?.orderNumber || 'PSO-ORDER'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#B8AFA8' }}>
                      {new Date(ret.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td style={{ padding: '1rem', color: '#FFFFFF' }}>
                    {ret.customer?.name || 'Customer'}
                    <div style={{ fontSize: '0.75rem', color: '#B8AFA8' }}>{ret.customer?.email}</div>
                  </td>
                  <td style={{ padding: '1rem', color: '#B8AFA8' }}>
                    <div style={{ fontWeight: 600, color: '#F6F1E8' }}>{ret.reason}</div>
                    {ret.description && <div style={{ fontSize: '0.75rem', color: '#72785A' }}>{ret.description}</div>}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <select
                      value={ret.status}
                      disabled={updatingId === ret._id}
                      onChange={(e) => handleStatusChange(ret._id, e.target.value)}
                      style={{
                        padding: '0.35rem 0.65rem',
                        borderRadius: 4,
                        background: '#2A2825',
                        border: '1px solid #3A3632',
                        color: '#F6F1E8',
                        fontSize: '0.8rem',
                      }}
                    >
                      <option value="requested">Requested</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                      <option value="picked_up">Picked Up</option>
                      <option value="received">Received at Lab</option>
                      <option value="refund_initiated">Refund Initiated</option>
                      <option value="refunded">Refund Completed</option>
                    </select>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <button
                      onClick={() => setSelectedReturn(ret)}
                      style={{
                        background: '#2A2825',
                        border: '1px solid #3A3632',
                        color: '#D4B483',
                        padding: '0.4rem 0.75rem',
                        borderRadius: 4,
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                      }}
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Return detail inspect modal */}
      {selectedReturn && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#1E1C19', border: '1px solid #3A3632', borderRadius: 12, padding: '2rem', width: '100%', maxWidth: 500, color: '#F6F1E8' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', color: '#FFFFFF', margin: 0 }}>
                Return Claim Review
              </h2>
              <button onClick={() => setSelectedReturn(null)} style={{ background: 'none', border: 'none', color: '#B8AFA8', cursor: 'pointer', fontSize: '1.25rem' }}>&times;</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              <div><strong>Order:</strong> #{selectedReturn.order?.orderNumber}</div>
              <div><strong>Customer:</strong> {selectedReturn.customer?.name} ({selectedReturn.customer?.email})</div>
              <div><strong>Reason:</strong> {selectedReturn.reason}</div>
              {selectedReturn.description && (
                <div style={{ padding: '0.75rem', background: '#2A2825', borderRadius: 6, color: '#B8AFA8' }}>
                  &ldquo;{selectedReturn.description}&rdquo;
                </div>
              )}
              <div><strong>Status:</strong> <span style={{ color: '#D4B483', textTransform: 'uppercase' }}>{selectedReturn.status}</span></div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                onClick={() => { handleStatusChange(selectedReturn._id, 'rejected'); setSelectedReturn(null); }}
                style={{ background: '#3D281F', color: '#E88B6E', border: 'none', padding: '0.65rem 1.25rem', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}
              >
                Reject Claim
              </button>
              <button
                onClick={() => { handleStatusChange(selectedReturn._id, 'approved'); setSelectedReturn(null); }}
                style={{ background: '#D4B483', color: '#1E1C19', border: 'none', padding: '0.65rem 1.25rem', borderRadius: 6, fontWeight: 700, cursor: 'pointer' }}
              >
                Approve Return
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
