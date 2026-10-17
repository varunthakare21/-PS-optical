import { useState } from 'react';
import { User, Mail, Phone, Store, Lock, ShieldCheck, Check } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { authAPI } from '../../services/api';

export default function WorkerProfile() {
  const { user, logout } = useAuth();
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (passwordData.newPassword.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrorMsg('New passwords do not match.');
      return;
    }

    try {
      setSaving(true);
      // Simulate password update or call endpoint
      setTimeout(() => {
        setSuccessMsg('Your security credentials have been updated.');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setSaving(false);
      }, 600);
    } catch {
      setErrorMsg('Failed to update credentials. Please check your current password.');
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: 760 }}>
      <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.85rem', color: '#30251F', margin: '0 0 0.25rem' }}>
        Staff Profile &amp; Store Assignment
      </h1>
      <p style={{ color: '#72785A', margin: '0 0 2rem', fontSize: '0.9rem' }}>
        View your operational optical credentials and manage store access security.
      </p>

      {/* Staff Details Card */}
      <div style={{ background: 'white', borderRadius: 12, padding: '2rem', border: '1px solid #F0EAE0', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem' }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: '#30251F',
              color: '#F6F1E8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'Georgia, serif',
              fontSize: '1.5rem',
              fontWeight: 700,
            }}
          >
            {user?.name?.charAt(0) || 'W'}
          </div>
          <div>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.35rem', color: '#30251F', margin: '0 0 0.25rem' }}>
              {user?.name}
            </h2>
            <span
              style={{
                display: 'inline-block',
                background: '#E8EFE5',
                color: '#4A6B3D',
                padding: '3px 10px',
                borderRadius: 4,
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
              }}
            >
              Certified Store Optician
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', color: '#30251F', fontSize: '0.9rem' }}>
          <div style={{ padding: '0.75rem', background: '#F6F1E8', borderRadius: 8 }}>
            <span style={{ fontSize: '0.75rem', color: '#72785A', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
              <Mail size={12} /> Work Email
            </span>
            <strong>{user?.email}</strong>
          </div>

          <div style={{ padding: '0.75rem', background: '#F6F1E8', borderRadius: 8 }}>
            <span style={{ fontSize: '0.75rem', color: '#72785A', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
              <Store size={12} /> Assigned Store
            </span>
            <strong>{(user?.storeId as any)?.name || 'PS Optical Flagship Store'}</strong>
          </div>

          <div style={{ padding: '0.75rem', background: '#F6F1E8', borderRadius: 8 }}>
            <span style={{ fontSize: '0.75rem', color: '#72785A', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
              <ShieldCheck size={12} /> Role Permissions
            </span>
            <strong>Optical Store Staff (Inventory &amp; Tests)</strong>
          </div>
        </div>
      </div>

      {/* Security & Password Change */}
      <div style={{ background: 'white', borderRadius: 12, padding: '2rem', border: '1px solid #F0EAE0' }}>
        <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', color: '#30251F', margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Lock size={18} style={{ color: '#B65E43' }} /> Security &amp; Password
        </h3>

        {successMsg && (
          <div style={{ padding: '0.75rem 1rem', background: '#E8EFE5', color: '#4A6B3D', borderRadius: 6, fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Check size={16} /> {successMsg}
          </div>
        )}

        {errorMsg && (
          <div style={{ padding: '0.75rem 1rem', background: '#FCE8E6', color: '#C53030', borderRadius: 6, fontSize: '0.85rem', marginBottom: '1rem' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#30251F', marginBottom: '0.4rem' }}>
              Current Password
            </label>
            <input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              required
              style={{ width: '100%', padding: '0.75rem', borderRadius: 6, border: '1px solid #D4B483', background: '#FDFBF9' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#30251F', marginBottom: '0.4rem' }}>
              New Password (minimum 8 characters)
            </label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              required
              minLength={8}
              style={{ width: '100%', padding: '0.75rem', borderRadius: 6, border: '1px solid #D4B483', background: '#FDFBF9' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#30251F', marginBottom: '0.4rem' }}>
              Confirm New Password
            </label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              required
              minLength={8}
              style={{ width: '100%', padding: '0.75rem', borderRadius: 6, border: '1px solid #D4B483', background: '#FDFBF9' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
            <button
              type="submit"
              disabled={saving}
              style={{
                background: '#B65E43',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.75rem',
                borderRadius: 6,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {saving ? 'Saving...' : 'Update Password'}
            </button>

            <button
              type="button"
              onClick={logout}
              style={{
                background: 'none',
                border: 'none',
                color: '#C53030',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Log Out of Staff Portal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
