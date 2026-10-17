import { useState, useEffect } from 'react';
import { HelpCircle, MessageSquare, Send, Plus, CheckCircle, Clock } from 'lucide-react';
import { supportAPI } from '../../services/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function CustomerSupport() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    category: 'general',
    message: '',
  });

  const fetchTickets = async () => {
    try {
      const res = await supportAPI.getMyTickets();
      setTickets(res.data.data || []);
    } catch {
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject || !formData.message) return;
    try {
      setSubmitting(true);
      await supportAPI.create(formData);
      setShowCreate(false);
      setFormData({ subject: '', category: 'general', message: '' });
      await fetchTickets();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to submit ticket');
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
            Customer Concierge &amp; Support
          </h1>
          <p style={{ color: '#72785A', margin: 0, fontSize: '0.9rem' }}>
            Direct assistance with prescription verifications, frame adjustments, order logistics, and warranties.
          </p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: showCreate ? '#30251F' : '#B65E43',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.25rem',
            borderRadius: 6,
            fontWeight: 600,
            fontSize: '0.9rem',
            cursor: 'pointer',
          }}
        >
          {showCreate ? 'Close Form' : <><Plus size={16} /> Open New Ticket</>}
        </button>
      </div>

      {showCreate && (
        <div style={{ background: 'white', borderRadius: 12, padding: '2rem', border: '1px solid #D4B483', marginBottom: '2rem' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', color: '#30251F', margin: '0 0 1rem' }}>
            Open a Support Request
          </h2>
          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#30251F', marginBottom: '0.4rem' }}>
                Subject / Issue Summary
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="e.g., Question about my progressive prescription order"
                required
                style={{ width: '100%', padding: '0.75rem', borderRadius: 6, border: '1px solid #D4B483', background: '#FDFBF9' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#30251F', marginBottom: '0.4rem' }}>
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 6, border: '1px solid #D4B483', background: '#FDFBF9' }}
              >
                <option value="general">General Inquiry</option>
                <option value="order">Order Tracking &amp; Delivery</option>
                <option value="prescription">Prescription Clarification</option>
                <option value="product">Frame Sizing &amp; Materials</option>
                <option value="payment">Billing &amp; Refunds</option>
                <option value="return">Return &amp; Exchange</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#30251F', marginBottom: '0.4rem' }}>
                Message
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Please describe your query in detail so our optical specialists can help you promptly."
                rows={4}
                required
                style={{ width: '100%', padding: '0.75rem', borderRadius: 6, border: '1px solid #D4B483', background: '#FDFBF9', resize: 'vertical' }}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                alignSelf: 'flex-start',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: '#B65E43',
                color: 'white',
                border: 'none',
                padding: '0.85rem 2rem',
                borderRadius: 6,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <Send size={16} /> {submitting ? 'Submitting...' : 'Send to Optical Team'}
            </button>
          </form>
        </div>
      )}

      {tickets.length === 0 ? (
        <div style={{ background: 'white', borderRadius: 12, padding: '3.5rem 2rem', textAlign: 'center', border: '1px solid #F0EAE0' }}>
          <HelpCircle size={44} style={{ color: '#A89C8C', marginBottom: '1rem' }} />
          <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', color: '#30251F' }}>No open support tickets</h3>
          <p style={{ color: '#72785A', fontSize: '0.9rem', marginTop: '0.5rem', maxWidth: 480, margin: '0.5rem auto 0' }}>
            Need help choosing high-index lenses or inquiring about order transit? Our certified optical concierge is ready.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {tickets.map((t) => (
            <div
              key={t._id}
              style={{
                background: 'white',
                borderRadius: 12,
                padding: '1.5rem',
                border: '1px solid #F0EAE0',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: 4,
                      textTransform: 'uppercase',
                      background: t.status === 'resolved' || t.status === 'closed' ? '#E8EFE5' : '#FFF3EE',
                      color: t.status === 'resolved' || t.status === 'closed' ? '#4A6B3D' : '#B65E43',
                    }}
                  >
                    {t.status.replace('_', ' ')}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#72785A', textTransform: 'capitalize' }}>
                    Category: {t.category}
                  </span>
                </div>
                <span style={{ fontSize: '0.8rem', color: '#A89C8C' }}>
                  {new Date(t.createdAt).toLocaleString()}
                </span>
              </div>

              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.15rem', color: '#30251F', margin: '0 0 1rem' }}>
                {t.subject}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', background: '#F6F1E8', borderRadius: 8, padding: '1rem' }}>
                {t.messages?.map((msg: any, i: number) => (
                  <div
                    key={i}
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: 6,
                      background: msg.senderRole === 'customer' ? 'white' : '#FFF9F0',
                      border: msg.senderRole === 'customer' ? '1px solid #E8E2D8' : '1px solid #D4B483',
                      alignSelf: msg.senderRole === 'customer' ? 'flex-start' : 'flex-end',
                      maxWidth: '85%',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: msg.senderRole === 'customer' ? '#72785A' : '#B65E43' }}>
                        {msg.senderRole === 'customer' ? 'You' : 'PS Optical Specialist'}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: '#A89C8C' }}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#30251F', lineHeight: 1.5 }}>
                      {msg.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
