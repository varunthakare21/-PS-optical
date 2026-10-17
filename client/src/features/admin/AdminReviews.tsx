import { useState, useEffect } from 'react';
import { Star, Check, X, MessageSquare, AlertCircle } from 'lucide-react';
import { adminAPI } from '../../services/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function AdminReviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getReviews();
      setReviews(res.data.data || []);
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleApprove = async (id: string, isApproved: boolean) => {
    try {
      setUpdatingId(id);
      await adminAPI.approveReview(id, isApproved);
      setReviews((prev) =>
        prev.map((r) => (r._id === id ? { ...r, isApproved } : r))
      );
    } catch {
      alert('Failed to update review approval');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div style={{ color: '#F6F1E8' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.85rem', margin: '0 0 0.25rem', color: '#FFFFFF' }}>
            Product Reviews &amp; Moderation
          </h1>
          <p style={{ color: '#B8AFA8', margin: 0, fontSize: '0.85rem' }}>
            Review customer testimonials, optical fit evaluations, and verified purchase ratings.
          </p>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '4rem 0', display: 'flex', justifyContent: 'center' }}>
          <LoadingSpinner size="md" />
        </div>
      ) : reviews.length === 0 ? (
        <div style={{ background: '#1E1C19', borderRadius: 12, padding: '3.5rem 2rem', textAlign: 'center', border: '1px solid #3A3632' }}>
          <Star size={44} style={{ color: '#72785A', marginBottom: '1rem' }} />
          <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', color: '#FFFFFF' }}>No reviews submitted</h3>
          <p style={{ color: '#B8AFA8', fontSize: '0.9rem', marginTop: '0.5rem' }}>Customer frame evaluations will appear here for editorial moderation.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {reviews.map((rev) => (
            <div
              key={rev._id}
              style={{
                background: '#1E1C19',
                borderRadius: 12,
                padding: '1.5rem',
                border: '1px solid #3A3632',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div style={{ flex: 1, minWidth: 280 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', color: '#D4B483' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        fill={i < rev.rating ? '#D4B483' : 'none'}
                        stroke={i < rev.rating ? '#D4B483' : '#72785A'}
                      />
                    ))}
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFFFFF' }}>
                    {rev.title || 'Review'}
                  </span>
                  <span
                    style={{
                      padding: '2px 6px',
                      borderRadius: 4,
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      background: rev.isApproved ? '#273822' : '#3D281F',
                      color: rev.isApproved ? '#8FC87A' : '#E88B6E',
                    }}
                  >
                    {rev.isApproved ? 'Approved' : 'Pending'}
                  </span>
                </div>

                <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', color: '#B8AFA8', lineHeight: 1.5 }}>
                  {rev.body}
                </p>

                <div style={{ fontSize: '0.75rem', color: '#72785A' }}>
                  By <strong>{rev.customer?.name || 'Customer'}</strong> for <strong>{rev.product?.name || 'Eyewear Frame'}</strong> &bull; {new Date(rev.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {!rev.isApproved ? (
                  <button
                    onClick={() => handleApprove(rev._id, true)}
                    disabled={updatingId === rev._id}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      background: '#D4B483',
                      color: '#1E1C19',
                      border: 'none',
                      padding: '0.45rem 0.85rem',
                      borderRadius: 6,
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    <Check size={14} /> Approve
                  </button>
                ) : (
                  <button
                    onClick={() => handleApprove(rev._id, false)}
                    disabled={updatingId === rev._id}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      background: '#3D281F',
                      color: '#E88B6E',
                      border: 'none',
                      padding: '0.45rem 0.85rem',
                      borderRadius: 6,
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    <X size={14} /> Hide
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
