import { useState, useEffect } from 'react';
import { Users, Mail, Phone, CheckCircle, XCircle, Search } from 'lucide-react';
import { adminAPI } from '../../services/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getCustomers(page);
      setCustomers(res.data.data || []);
      if (res.data.pagination) setTotalPages(res.data.pagination.pages || 1);
    } catch {
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [page]);

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase();
    return c.name?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q);
  });

  return (
    <div style={{ color: '#F6F1E8' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.85rem', margin: '0 0 0.25rem', color: '#FFFFFF' }}>
            Registered Clients
          </h1>
          <p style={{ color: '#B8AFA8', margin: 0, fontSize: '0.85rem' }}>
            Customer profiles, verified accounts, and optical prescription records.
          </p>
        </div>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
        <Search size={18} style={{ position: 'absolute', left: 14, top: 12, color: '#B8AFA8' }} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by client name or email..."
          style={{
            width: '100%',
            padding: '0.75rem 1rem 0.75rem 2.5rem',
            borderRadius: 8,
            border: '1px solid #3A3632',
            background: '#1E1C19',
            color: '#FFFFFF',
            fontSize: '0.9rem',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {loading ? (
        <div style={{ padding: '4rem 0', display: 'flex', justifyContent: 'center' }}>
          <LoadingSpinner size="md" />
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ background: '#1E1C19', borderRadius: 12, padding: '3.5rem 2rem', textAlign: 'center', border: '1px solid #3A3632' }}>
          <Users size={44} style={{ color: '#72785A', marginBottom: '1rem' }} />
          <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', color: '#FFFFFF' }}>No customers found</h3>
        </div>
      ) : (
        <div style={{ background: '#1E1C19', borderRadius: 12, border: '1px solid #3A3632', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 640 }}>
            <thead>
              <tr style={{ background: '#2A2825', borderBottom: '1px solid #3A3632', fontSize: '0.75rem', color: '#D4B483', textTransform: 'uppercase' }}>
                <th style={{ padding: '1rem' }}>Client Name</th>
                <th style={{ padding: '1rem' }}>Contact</th>
                <th style={{ padding: '1rem' }}>Email Verified</th>
                <th style={{ padding: '1rem' }}>Status</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Registered</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c._id} style={{ borderBottom: '1px solid #2A2825', fontSize: '0.85rem' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 600, color: '#FFFFFF' }}>{c.name}</div>
                  </td>
                  <td style={{ padding: '1rem', color: '#B8AFA8' }}>
                    <div>{c.email}</div>
                    {c.phone && <div style={{ fontSize: '0.75rem', color: '#72785A' }}>{c.phone}</div>}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {c.emailVerified ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#8FC87A', fontSize: '0.75rem', fontWeight: 600 }}>
                        <CheckCircle size={12} /> Verified
                      </span>
                    ) : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#E88B6E', fontSize: '0.75rem', fontWeight: 600 }}>
                        <XCircle size={12} /> Pending
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: 4,
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        background: c.accountStatus === 'active' ? '#273822' : '#3D281F',
                        color: c.accountStatus === 'active' ? '#8FC87A' : '#E88B6E',
                      }}
                    >
                      {c.accountStatus}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right', color: '#B8AFA8' }}>
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
