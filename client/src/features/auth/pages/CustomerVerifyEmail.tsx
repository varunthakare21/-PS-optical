import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';
import { authAPI } from '../../../services/api';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';

export default function CustomerVerifyEmail() {
  const { token } = useParams<{ token: string }>();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!token) return;
    authAPI.verifyEmail(token)
      .then(() => {
        setSuccess(true);
      })
      .catch((err) => {
        setSuccess(false);
        setErrorMsg(err.response?.data?.message || 'Verification link is invalid or expired.');
      })
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return <div style={{ padding: '4rem 0', display: 'flex', justifyContent: 'center' }}><LoadingSpinner size="md" /></div>;
  }

  return (
    <div style={{ textAlign: 'center', padding: '2rem 0' }}>
      {success ? (
        <>
          <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '50%', background: '#F0EAE0', marginBottom: '1.25rem' }}>
            <CheckCircle size={44} style={{ color: '#72785A' }} />
          </div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.6rem', color: '#30251F', margin: '0 0 0.5rem' }}>
            Email Verified!
          </h2>
          <p style={{ fontFamily: 'Inter, sans-serif', color: '#72785A', margin: '0 0 2rem', lineHeight: 1.6 }}>
            Your PS OPTICAL account has been successfully verified and activated.
          </p>
          <Link
            to="/customer/login"
            style={{ display: 'inline-block', background: '#B65E43', color: 'white', textDecoration: 'none', padding: '0.85rem 2rem', borderRadius: 6, fontWeight: 600 }}
          >
            Sign In to Your Account
          </Link>
        </>
      ) : (
        <>
          <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '50%', background: '#FFF3EE', marginBottom: '1.25rem' }}>
            <XCircle size={44} style={{ color: '#B65E43' }} />
          </div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.6rem', color: '#30251F', margin: '0 0 0.5rem' }}>
            Verification Failed
          </h2>
          <p style={{ fontFamily: 'Inter, sans-serif', color: '#72785A', margin: '0 0 2rem', lineHeight: 1.6 }}>
            {errorMsg}
          </p>
          <Link
            to="/customer/login"
            style={{ display: 'inline-block', background: '#30251F', color: '#F6F1E8', textDecoration: 'none', padding: '0.85rem 2rem', borderRadius: 6, fontWeight: 600 }}
          >
            Return to Login
          </Link>
        </>
      )}
    </div>
  );
}
