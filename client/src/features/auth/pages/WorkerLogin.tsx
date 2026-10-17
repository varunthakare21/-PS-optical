import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, ShieldAlert, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';
import { authAPI } from '../../../services/api';
import { useAuth } from '../AuthContext';
import { useToast } from '../../../components/ui/Toaster';

const schema = z.object({
  email: z.string().email('Enter your registered staff email'),
  password: z.string().min(1, 'Password is required'),
});
type Form = z.infer<typeof schema>;

export default function WorkerLogin() {
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<Form>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: Form) => {
    setLoading(true);
    try {
      const res = await authAPI.workerLogin(data);
      login(res.data.user, res.data.token);
      showToast(`Welcome, ${res.data.user.name}!`, 'success');
      navigate('/worker/dashboard');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Worker login failed. Check credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const inp = {
    width: '100%', padding: '0.8rem 1rem', border: '1.5px solid #D8DED0',
    borderRadius: 7, fontFamily: 'Inter, sans-serif', fontSize: '0.9375rem',
    color: '#30251F', background: 'white', outline: 'none', boxSizing: 'border-box' as const,
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div style={{ display: 'inline-block', background: '#72785A', color: 'white', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 4, marginBottom: '0.75rem' }}>
        Optical Worker Portal
      </div>

      <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.75rem', fontWeight: 700, color: '#30251F', margin: '0 0 0.5rem' }}>
        Store Staff Sign In
      </h1>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: '#72785A', margin: '0 0 2rem' }}>
        Access your store inventory, assigned appointments, and fulfillment tasks.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4A3A33', marginBottom: '0.375rem' }}>
            Work Email / Employee Identifier
          </label>
          <input {...register('email')} type="email" placeholder="optician@psoptical.in" style={inp} />
          {errors.email && <p style={{ color: '#B65E43', fontSize: '0.75rem', margin: '4px 0 0' }}>{errors.email.message}</p>}
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#4A3A33' }}>Password</label>
            <Link to="/worker/forgot-password" style={{ fontSize: '0.78rem', color: '#72785A', textDecoration: 'none' }}>
              Forgot password?
            </Link>
          </div>
          <div style={{ position: 'relative' }}>
            <input
              {...register('password')}
              type={showPw ? 'text' : 'password'}
              placeholder="Staff password"
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

        <button
          type="submit"
          disabled={loading}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            background: loading ? '#8A9070' : '#72785A', color: 'white', padding: '0.9rem',
            borderRadius: 7, border: 'none', fontFamily: 'Inter, sans-serif', fontSize: '0.9rem',
            fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', marginTop: '0.5rem',
          }}
        >
          {loading ? 'Authenticating…' : <><LogIn size={17} /> Sign In to Store Portal</>}
        </button>
      </form>

      <div style={{ marginTop: '2.5rem', padding: '1rem', background: '#F5F6F2', borderRadius: 8, border: '1px solid #E8EAE0', fontSize: '0.78rem', color: '#5A6050', lineHeight: 1.5 }}>
        <strong>Notice:</strong> Worker accounts are provisioned exclusively by PS OPTICAL Administration. Public registration is strictly restricted.
      </div>

      <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        <Link to="/customer/login" style={{ fontSize: '0.8rem', color: '#72785A', textDecoration: 'none' }}>
          ← Customer Portal
        </Link>
      </div>
    </motion.div>
  );
}
