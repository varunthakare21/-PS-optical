import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { authAPI } from '../../../services/api';
import { useToast } from '../../../components/ui/Toaster';

const schema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type Form = z.infer<typeof schema>;

export default function CustomerResetPassword() {
  const { token } = useParams<{ token: string }>();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<Form>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: Form) => {
    if (!token) return;
    setLoading(true);
    try {
      await authAPI.resetPassword(token, data.password);
      setSuccess(true);
      showToast('Password reset successfully! Please sign in.', 'success');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Invalid or expired password reset link.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const inp = {
    width: '100%', padding: '0.8rem 1rem', border: '1.5px solid #E8E2D9',
    borderRadius: 7, fontFamily: 'Inter, sans-serif', fontSize: '0.9375rem',
    color: '#30251F', background: 'white', outline: 'none', boxSizing: 'border-box' as const,
  };

  if (success) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem 0' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', color: '#30251F', fontSize: '1.5rem', marginBottom: '0.75rem' }}>
          Password Reset Complete
        </h2>
        <p style={{ fontFamily: 'Inter, sans-serif', color: '#72785A', marginBottom: '2rem' }}>
          Your password has been securely updated. You can now sign in with your new credentials.
        </p>
        <Link
          to="/customer/login"
          style={{ background: '#B65E43', color: 'white', textDecoration: 'none', padding: '0.85rem 1.75rem', borderRadius: 6, fontWeight: 600 }}
        >
          Proceed to Login
        </Link>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.75rem', fontWeight: 700, color: '#30251F', margin: '0 0 0.5rem' }}>
        Create New Password
      </h1>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: '#72785A', margin: '0 0 2rem' }}>
        Choose a secure password of at least 8 characters.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4A3A33', marginBottom: '0.375rem' }}>
            New Password
          </label>
          <div style={{ position: 'relative' }}>
            <input
              {...register('password')}
              type={showPw ? 'text' : 'password'}
              placeholder="Minimum 8 characters"
              style={{ ...inp, paddingRight: '2.5rem' }}
            />
            <button
              type="button"
              onClick={() => setShowPw((s) => !s)}
              style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#A89C8C', display: 'flex' }}
            >
              {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
          {errors.password && <p style={{ color: '#B65E43', fontSize: '0.75rem', margin: '4px 0 0' }}>{errors.password.message}</p>}
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4A3A33', marginBottom: '0.375rem' }}>
            Confirm New Password
          </label>
          <input
            {...register('confirmPassword')}
            type="password"
            placeholder="Repeat password"
            style={inp}
          />
          {errors.confirmPassword && <p style={{ color: '#B65E43', fontSize: '0.75rem', margin: '4px 0 0' }}>{errors.confirmPassword.message}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            background: loading ? '#C97259' : '#B65E43', color: 'white', padding: '0.9rem',
            borderRadius: 7, border: 'none', fontFamily: 'Inter, sans-serif', fontSize: '0.9rem',
            fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          <Lock size={16} /> {loading ? 'Updating…' : 'Update Password'}
        </button>
      </form>
    </motion.div>
  );
}
