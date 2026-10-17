import { useState, useEffect } from 'react';
import { Shield, Clock, User, Globe, AlertCircle, RefreshCw } from 'lucide-react';
import { adminAPI } from '../../services/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getAuditLogs(page);
      setLogs(res.data.data || []);
      if (res.data.pagination) setTotalPages(res.data.pagination.pages || 1);
    } catch {
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page]);

  return (
    <div style={{ color: '#F6F1E8' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.85rem', margin: '0 0 0.25rem', color: '#FFFFFF' }}>
            System Audit Trail &amp; Security Logs
          </h1>
          <p style={{ color: '#B8AFA8', margin: 0, fontSize: '0.85rem' }}>
            Immutable security event logs tracking logins, account updates, and catalog operations.
          </p>
        </div>
        <button
          onClick={fetchLogs}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: '#2A2825',
            border: '1px solid #3A3632',
            color: '#D4B483',
            padding: '0.6rem 1rem',
            borderRadius: 6,
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: 'pointer',
          }}
        >
          <RefreshCw size={14} /> Refresh Logs
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '4rem 0', display: 'flex', justifyContent: 'center' }}>
          <LoadingSpinner size="md" />
        </div>
      ) : logs.length === 0 ? (
        <div style={{ background: '#1E1C19', borderRadius: 12, padding: '3.5rem 2rem', textAlign: 'center', border: '1px solid #3A3632' }}>
          <Shield size={44} style={{ color: '#72785A', marginBottom: '1rem' }} />
          <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', color: '#FFFFFF' }}>No audit events recorded</h3>
        </div>
      ) : (
        <div style={{ background: '#1E1C19', borderRadius: 12, border: '1px solid #3A3632', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 700 }}>
            <thead>
              <tr style={{ background: '#2A2825', borderBottom: '1px solid #3A3632', fontSize: '0.75rem', color: '#D4B483', textTransform: 'uppercase' }}>
                <th style={{ padding: '1rem' }}>Timestamp</th>
                <th style={{ padding: '1rem' }}>Action Event</th>
                <th style={{ padding: '1rem' }}>Subject / Role</th>
                <th style={{ padding: '1rem' }}>Resource</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Client IP</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id} style={{ borderBottom: '1px solid #2A2825', fontSize: '0.85rem' }}>
                  <td style={{ padding: '1rem', color: '#B8AFA8', fontSize: '0.75rem' }}>
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: 4,
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        fontFamily: 'monospace',
                        background: log.action.includes('LOGIN') ? '#273822' : '#3D281F',
                        color: log.action.includes('LOGIN') ? '#8FC87A' : '#E88B6E',
                      }}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', color: '#FFFFFF' }}>
                    <div>{log.user?.name || log.user?.email || 'Anonymous'}</div>
                    <span style={{ fontSize: '0.7rem', color: '#D4B483', textTransform: 'uppercase' }}>
                      {log.userRole || 'Public'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', color: '#B8AFA8', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                    {log.resource}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right', color: '#72785A', fontFamily: 'monospace', fontSize: '0.75rem' }}>
                    {log.ip || '127.0.0.1'}
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
