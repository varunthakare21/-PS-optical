import { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useToast } from '../../components/ui/Toaster';

export default function CustomerProfile() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Profile information updated successfully.', 'success');
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPw.length < 8) {
      showToast('New password must be at least 8 characters.', 'error');
      return;
    }
    showToast('Password updated successfully.', 'success');
    setCurrentPw('');
    setNewPw('');
  };

  const inp = {
    width: '100%', padding: '0.75rem 0.9rem', border: '1.5px solid #E8E2D9',
    borderRadius: 7, fontFamily: 'Inter, sans-serif', fontSize: '0.9rem',
    color: '#30251F', background: 'white', outline: 'none', boxSizing: 'border-box' as const,
  };

  return (
    <div style={{ maxWidth: 760 }}>
      <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.85rem', color: '#30251F', margin: '0 0 2rem' }}>
        Account Profile &amp; Security
      </h1>

      {/* Profile info */}
      <div style={{ background: 'white', borderRadius: 12, padding: '1.75rem', border: '1px solid #F0EAE0', marginBottom: '2rem' }}>
        <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.2rem', color: '#30251F', margin: '0 0 1.25rem' }}>
          Personal Details
        </h3>
        <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4A3A33', marginBottom: 4 }}>Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={inp} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4A3A33', marginBottom: 4 }}>Email Address</label>
            <input type="email" disabled value={user?.email || ''} style={{ ...inp, background: '#F6F1E8', color: '#72785A' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4A3A33', marginBottom: 4 }}>Mobile Number</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} style={inp} />
          </div>
          <button type="submit" style={{ width: 'fit-content', background: '#B65E43', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}>
            Save Changes
          </button>
        </form>
      </div>

      {/* Change password */}
      <div style={{ background: 'white', borderRadius: 12, padding: '1.75rem', border: '1px solid #F0EAE0' }}>
        <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.2rem', color: '#30251F', margin: '0 0 1.25rem' }}>
          Change Password
        </h3>
        <form onSubmit={handleUpdatePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4A3A33', marginBottom: 4 }}>Current Password</label>
            <input type="password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} style={inp} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4A3A33', marginBottom: 4 }}>New Password (min 8 characters)</label>
            <input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} style={inp} />
          </div>
          <button type="submit" style={{ width: 'fit-content', background: '#30251F', color: '#F6F1E8', border: 'none', padding: '0.75rem 1.5rem', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}>
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
