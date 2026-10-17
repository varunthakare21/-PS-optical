import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, ShieldCheck, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { authAPI } from '../../../services/api';
import { useAuth } from '../AuthContext';
import { useToast } from '../../../components/ui/Toaster';

const schema = z.object({
  email: z.string().email('Enter authorized administrator email'),
  password: z.string().min(1, 'Password is required'),
});
type Form = z.infer<typeof schema>;

export default function AdminLogin() {
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<Form>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: Form) => {
    setLoading(true);
    try {
      const res = await authAPI.adminLogin(data);
      login(res.data.user, res.data.token);
      showToast('Admin session authenticated.', 'success');
      navigate('/admin/dashboard');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Admin authentication failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const inp = {
    width: '100%', padding: '0.8rem 1rem', border: '1.5px solid #3A3632',
    borderRadius: 7, fontFamily: 'Inter, sans-serif', fontSize: '0.9375rem',
    color: '#F0EAE0', background: '#272522', outline: 'none', boxSizing: 'border-box' as const,
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#D4B483', color: '#1E1C19', fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 4, marginBottom: '0.75rem' }}>
        <ShieldCheck size={12} /> Executive Admin Console
      </div>

      <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.75rem', fontWeight: 700, color: '#F0EAE0', margin: '0 0 0.5rem' }}>
        Administrator Sign In
      </h1>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: '#A89C8C', margin: '0 0 2rem' }}>
        Privileged access to optical inventory, customer records, and global business analytics.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#D4B483', marginBottom: '0.375rem' }}>
            Administrator Email
          </label>
          <input {...register('email')} type="email" placeholder="admin@psoptical.in" style={inp} />
          {errors.email && <p style={{ color: '#E57373', fontSize: '0.75rem', margin: '4px 0 0' }}>{errors.email.message}</p>}
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#D4B483' }}>Master Password</label>
            <Link
              to="/admin/forgot-password"
              style={{
                fontSize: '0.8rem',
                color: '#D4B483',
                textDecoration: 'underline',
                fontWeight: 600,
              }}
            >
              Forgot Password?
            </Link>
          </div>
          <div style={{ position: 'relative' }}>
            <input
              {...register('password')}
              type={showPw ? 'text' : 'password'}
              placeholder="Admin password"
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
          {errors.password && <p style={{ color: '#E57373', fontSize: '0.75rem', margin: '4px 0 0' }}>{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            background: loading ? '#B8965E' : '#D4B483', color: '#1E1C19', padding: '0.9rem',
            borderRadius: 7, border: 'none', fontFamily: 'Inter, sans-serif', fontSize: '0.9rem',
            fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', marginTop: '0.5rem',
          }}
        >
          {loading ? 'Authenticating…' : <><Lock size={16} /> Authorize Admin Session</>}
        </button>
      </form>

      {/* Prominent Create Profile Card */}
      <div
        style={{
          marginTop: '1.75rem',
          padding: '1.25rem',
          background: '#272522',
          borderRadius: 8,
          border: '1px solid #3A3632',
          textAlign: 'center',
        }}
      >
        <p style={{ margin: '0 0 0.75rem', fontSize: '0.85rem', color: '#F0EAE0' }}>
          Need new administrator credentials or store access?
        </p>
        <Link
          to="/admin/register"
          style={{
            display: 'inline-block',
            background: 'transparent',
            color: '#D4B483',
            border: '1.5px solid #D4B483',
            padding: '0.65rem 1.25rem',
            borderRadius: 6,
            textDecoration: 'none',
            fontSize: '0.85rem',
            fontWeight: 700,
            transition: 'all 0.2s ease',
          }}
        >
          Create Administrator Profile
        </Link>
      </div>

      {/* Forgot Password Link in Footer */}
      <div style={{ marginTop: '1rem', textAlign: 'center' }}>
        <Link
          to="/admin/forgot-password"
          style={{ fontSize: '0.8rem', color: '#A89C8C', textDecoration: 'none' }}
        >
          🔑 Forgotten your administrator password? <span style={{ color: '#D4B483', textDecoration: 'underline' }}>Reset Password</span>
        </Link>
      </div>

      <div style={{ marginTop: '1.75rem', padding: '1rem', background: '#272522', borderRadius: 8, border: '1px solid #3A3632', fontSize: '0.75rem', color: '#A89C8C', lineHeight: 1.5 }}>
        🔒 <strong>Bhandara Flagship &amp; Maharashtra Hub:</strong> All actions are audited. Default admin: <code style={{ color: '#D4B483' }}>admin@psoptical.in</code> / <code style={{ color: '#D4B483' }}>Admin@123</code>
      </div>
    </motion.div>
  );
}
