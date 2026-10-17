import { useState, useEffect } from 'react';
import {
  AlertCircle, CheckCircle2, Clock, MessageSquare, Search,
  Filter, ChevronRight, User, Phone, Mail, Send, X, ShieldAlert
} from 'lucide-react';
import { adminAPI } from '../../services/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useToast } from '../../components/ui/Toaster';

export default function AdminComplaints() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [replyText, setReplyText] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [updating, setUpdating] = useState(false);
  const { showToast } = useToast();

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getComplaints();
      setTickets(res.data.data || []);
    } catch {
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const openTicketDetail = (ticket: any) => {
    setSelectedTicket(ticket);
    setNewStatus(ticket.status);
    setReplyText('');
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket) return;
    try {
      setUpdating(true);
      const payload: any = { status: newStatus };
      if (replyText.trim()) {
        payload.replyMessage = replyText.trim();
      }
      const res = await adminAPI.updateComplaintStatus(selectedTicket._id, payload);
      showToast('Complaint ticket status updated successfully.', 'success');
      setSelectedTicket(res.data.data);
      setReplyText('');
      await fetchComplaints();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to update ticket.', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const filteredTickets = tickets.filter((t) => {
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      t.ticketNumber?.toLowerCase().includes(q) ||
      t.subject?.toLowerCase().includes(q) ||
      t.customer?.name?.toLowerCase().includes(q) ||
      t.customer?.email?.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const counts = {
    all: tickets.length,
    open: tickets.filter((t) => t.status === 'open').length,
    in_progress: tickets.filter((t) => t.status === 'in_progress').length,
    resolved: tickets.filter((t) => t.status === 'resolved').length,
  };

  const priorityColor = (p: string) => {
    switch (p) {
      case 'urgent': return { bg: '#4A1D1D', text: '#FF6B6B' };
      case 'high': return { bg: '#42281D', text: '#FFA07A' };
      case 'medium': return { bg: '#3D341F', text: '#D4B483' };
      default: return { bg: '#252B28', text: '#8FC87A' };
    }
  };

  const statusBadge = (s: string) => {
    switch (s) {
      case 'open': return { bg: '#42281D', text: '#FFA07A', label: 'Open Ticket' };
      case 'in_progress': return { bg: '#3D341F', text: '#D4B483', label: 'In Progress' };
      case 'resolved': return { bg: '#273822', text: '#8FC87A', label: 'Resolved' };
      case 'closed': return { bg: '#2A2825', text: '#B8AFA8', label: 'Closed' };
      default: return { bg: '#2A2825', text: '#B8AFA8', label: s };
    }
  };

  return (
    <div style={{ color: '#F6F1E8' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.75rem', color: '#D4B483', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600 }}>
            Customer Experience &amp; Redressal
          </span>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', margin: '0.25rem 0 0.5rem', color: '#FFFFFF' }}>
            Customer Complaints &amp; Grievances
          </h1>
          <p style={{ color: '#B8AFA8', margin: 0, fontSize: '0.85rem' }}>
            Comprehensive ticket management for Bhandara boutique inquiries, prescription fittings, and Maharashtra deliveries.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: '#1E1C19', border: '1px solid #3A3632', borderRadius: 10, padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#B8AFA8', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
            <span>Total Grievances</span>
            <MessageSquare size={16} color="#D4B483" />
          </div>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: '1.75rem', fontWeight: 700, color: '#FFFFFF' }}>
            {counts.all}
          </div>
        </div>

        <div style={{ background: '#1E1C19', border: '1px solid #3A3632', borderRadius: 10, padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#FFA07A', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
            <span>Open (Needs Action)</span>
            <AlertCircle size={16} color="#FFA07A" />
          </div>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: '1.75rem', fontWeight: 700, color: '#FFA07A' }}>
            {counts.open}
          </div>
        </div>

        <div style={{ background: '#1E1C19', border: '1px solid #3A3632', borderRadius: 10, padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#D4B483', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
            <span>Under Investigation</span>
            <Clock size={16} color="#D4B483" />
          </div>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: '1.75rem', fontWeight: 700, color: '#D4B483' }}>
            {counts.in_progress}
          </div>
        </div>

        <div style={{ background: '#1E1C19', border: '1px solid #3A3632', borderRadius: 10, padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#8FC87A', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
            <span>Resolved Cases</span>
            <CheckCircle2 size={16} color="#8FC87A" />
          </div>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: '1.75rem', fontWeight: 700, color: '#8FC87A' }}>
            {counts.resolved}
          </div>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: `All (${counts.all})` },
            { id: 'open', label: `Open (${counts.open})` },
            { id: 'in_progress', label: `In Progress (${counts.in_progress})` },
            { id: 'resolved', label: `Resolved (${counts.resolved})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              style={{
                background: statusFilter === tab.id ? '#D4B483' : '#2A2825',
                color: statusFilter === tab.id ? '#1E1C19' : '#B8AFA8',
                border: '1px solid #3A3632',
                padding: '0.5rem 1rem',
                borderRadius: 6,
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', minWidth: 260 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#B8AFA8' }} />
          <input
            type="text"
            placeholder="Search ticket #, customer, issue…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '0.55rem 1rem 0.55rem 2.2rem',
              borderRadius: 6,
              background: '#1E1C19',
              border: '1px solid #3A3632',
              color: '#FFF',
              fontSize: '0.85rem',
              boxSizing: 'border-box',
            }}
          />
        </div>
      </div>

      {/* Complaints Table */}
      {loading ? (
        <div style={{ padding: '4rem 0', display: 'flex', justifyContent: 'center' }}>
          <LoadingSpinner size="md" />
        </div>
      ) : filteredTickets.length === 0 ? (
        <div style={{ background: '#1E1C19', borderRadius: 12, padding: '3.5rem 2rem', textAlign: 'center', border: '1px solid #3A3632' }}>
          <CheckCircle2 size={44} style={{ color: '#8FC87A', marginBottom: '1rem' }} />
          <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', color: '#FFFFFF' }}>No Customer Grievances Found</h3>
          <p style={{ color: '#B8AFA8', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            All customer inquiries and feedback are in good standing.
          </p>
        </div>
      ) : (
        <div style={{ background: '#1E1C19', borderRadius: 12, border: '1px solid #3A3632', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 800 }}>
            <thead>
              <tr style={{ background: '#2A2825', borderBottom: '1px solid #3A3632', fontSize: '0.75rem', color: '#D4B483', textTransform: 'uppercase' }}>
                <th style={{ padding: '1rem' }}>Ticket # &amp; Date</th>
                <th style={{ padding: '1rem' }}>Customer Profile</th>
                <th style={{ padding: '1rem' }}>Category &amp; Priority</th>
                <th style={{ padding: '1rem' }}>Issue Subject</th>
                <th style={{ padding: '1rem' }}>Status</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((ticket) => {
                const pri = priorityColor(ticket.priority);
                const sta = statusBadge(ticket.status);
                return (
                  <tr key={ticket._id} style={{ borderBottom: '1px solid #2A2825', fontSize: '0.85rem' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 600, color: '#FFFFFF', fontFamily: 'monospace' }}>
                        #{ticket.ticketNumber}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#B8AFA8', marginTop: 2 }}>
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 600, color: '#F6F1E8' }}>{ticket.customer?.name || 'Customer'}</div>
                      <div style={{ fontSize: '0.75rem', color: '#B8AFA8' }}>{ticket.customer?.email}</div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ textTransform: 'capitalize', color: '#E0D8CC', fontWeight: 500 }}>
                        {ticket.category}
                      </div>
                      <span
                        style={{
                          display: 'inline-block',
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          padding: '1px 6px',
                          borderRadius: 4,
                          background: pri.bg,
                          color: pri.text,
                          marginTop: 3,
                        }}
                      >
                        {ticket.priority} priority
                      </span>
                    </td>
                    <td style={{ padding: '1rem', maxWidth: 300 }}>
                      <div style={{ fontWeight: 600, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {ticket.subject}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#B8AFA8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {ticket.description}
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          padding: '3px 8px',
                          borderRadius: 4,
                          background: sta.bg,
                          color: sta.text,
                        }}
                      >
                        {sta.label}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <button
                        onClick={() => openTicketDetail(ticket)}
                        style={{
                          background: '#2A2825',
                          border: '1px solid #3A3632',
                          color: '#D4B483',
                          padding: '0.45rem 0.85rem',
                          borderRadius: 6,
                          fontWeight: 600,
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        Review &amp; Reply <ChevronRight size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Ticket Details & Redressal Modal */}
      {selectedTicket && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.75)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            style={{
              background: '#1E1C19',
              border: '1px solid #3A3632',
              borderRadius: 12,
              padding: '2rem',
              width: '100%',
              maxWidth: 720,
              maxHeight: '92vh',
              overflowY: 'auto',
              color: '#F6F1E8',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', borderBottom: '1px solid #3A3632', paddingBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#D4B483', fontWeight: 700, fontFamily: 'monospace' }}>
                  #{selectedTicket.ticketNumber} &bull; {selectedTicket.category.toUpperCase()}
                </span>
                <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', color: '#FFFFFF', margin: '0.25rem 0 0' }}>
                  {selectedTicket.subject}
                </h2>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                style={{ background: 'none', border: 'none', color: '#B8AFA8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Customer Information Card */}
            <div style={{ background: '#2A2825', padding: '1rem', borderRadius: 8, border: '1px solid #3A3632', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem', fontSize: '0.82rem' }}>
              <div>
                <span style={{ color: '#B8AFA8', display: 'block', fontSize: '0.72rem' }}>Client Name</span>
                <strong style={{ color: '#FFFFFF' }}>{selectedTicket.customer?.name}</strong>
              </div>
              <div>
                <span style={{ color: '#B8AFA8', display: 'block', fontSize: '0.72rem' }}>Email Address</span>
                <span style={{ color: '#D4B483' }}>{selectedTicket.customer?.email}</span>
              </div>
              {selectedTicket.order && (
                <div>
                  <span style={{ color: '#B8AFA8', display: 'block', fontSize: '0.72rem' }}>Linked Order</span>
                  <span style={{ color: '#FFFFFF', fontFamily: 'monospace' }}>#{selectedTicket.order?.orderNumber || 'Optical Order'}</span>
                </div>
              )}
              <div>
                <span style={{ color: '#B8AFA8', display: 'block', fontSize: '0.72rem' }}>Lodged On</span>
                <span style={{ color: '#FFFFFF' }}>{new Date(selectedTicket.createdAt).toLocaleString()}</span>
              </div>
            </div>

            {/* Complaint Narrative */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#D4B483', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Customer Issue Statement
              </label>
              <div style={{ background: '#16140F', border: '1px solid #3A3632', borderRadius: 8, padding: '1rem', color: '#F0EAE0', fontSize: '0.9rem', lineHeight: 1.6 }}>
                {selectedTicket.description}
              </div>
            </div>

            {/* Message Thread History */}
            {selectedTicket.messages && selectedTicket.messages.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#D4B483', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  Resolution Communication Trail
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {selectedTicket.messages.map((m: any, idx: number) => {
                    const isAdmin = m.senderRole === 'admin';
                    return (
                      <div
                        key={idx}
                        style={{
                          background: isAdmin ? '#2A2825' : '#1A1815',
                          border: `1px solid ${isAdmin ? '#D4B483' : '#3A3632'}`,
                          borderRadius: 8,
                          padding: '0.85rem',
                          marginLeft: isAdmin ? '2rem' : 0,
                          marginRight: isAdmin ? 0 : '2rem',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: '0.75rem' }}>
                          <strong style={{ color: isAdmin ? '#D4B483' : '#FFFFFF' }}>
                            {isAdmin ? '🛡️ PS Optical Executive' : '👤 Customer'}
                          </strong>
                          <span style={{ color: '#8F857B' }}>{new Date(m.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#F0EAE0', lineHeight: 1.5 }}>{m.content}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Resolution Form */}
            <form onSubmit={handleUpdate} style={{ borderTop: '1px solid #3A3632', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#D4B483', marginBottom: 4 }}>
                  Update Grievance Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem',
                    borderRadius: 6,
                    background: '#2A2825',
                    border: '1px solid #3A3632',
                    color: '#FFF',
                    fontSize: '0.85rem',
                  }}
                >
                  <option value="open">Open (Awaiting Executive Action)</option>
                  <option value="in_progress">In Progress (Reviewing Prescription/Frame in Bhandara)</option>
                  <option value="resolved">Resolved (Customer Satisfaction Confirmed)</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#D4B483', marginBottom: 4 }}>
                  Executive Reply to Customer
                </label>
                <textarea
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type official response regarding frame replacement, prescription verification, or delivery status across Maharashtra…"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: 6,
                    background: '#2A2825',
                    border: '1px solid #3A3632',
                    color: '#FFF',
                    fontSize: '0.85rem',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setSelectedTicket(null)}
                  style={{
                    background: '#2A2825',
                    color: '#B8AFA8',
                    border: '1px solid #3A3632',
                    padding: '0.65rem 1.25rem',
                    borderRadius: 6,
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                  }}
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  style={{
                    background: '#D4B483',
                    color: '#1E1C19',
                    border: 'none',
                    padding: '0.65rem 1.5rem',
                    borderRadius: 6,
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: updating ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  {updating ? 'Saving…' : <><Send size={15} /> Submit Redressal Update</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
