import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { authAPI } from '../../../services/api';
import { useAuth } from '../AuthContext';
import { useToast } from '../../../components/ui/Toaster';
import { motion } from 'framer-motion';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});
type Form = z.infer<typeof schema>;

export default function CustomerLogin() {
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: 'customer@psoptical.com',
      password: 'Customer@123',
    },
  });

  const onSubmit = async (data: Form) => {
    setLoading(true);
    try {
      const res = await authAPI.customerLogin(data);
      login(res.data.user, res.data.token);
      showToast(`Welcome back, ${res.data.user.name}!`, 'success');
      navigate('/customer/dashboard');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Login failed. Please try again.', 'error');
    } finally { setLoading(false); }
  };

  const handleQuickDemoLogin = (email: string, pw: string) => {
    setValue('email', email, { shouldValidate: true });
    setValue('password', pw, { shouldValidate: true });
    onSubmit({ email, password: pw });
  };

  const inputStyle = {
    width: '100%', padding: '0.8rem 1rem', border: '1.5px solid #E8E2D9', borderRadius: 7,
    fontFamily: 'Inter, sans-serif', fontSize: '0.9375rem', color: '#30251F',
    background: 'white', outline: 'none', boxSizing: 'border-box' as const,
    transition: 'border-color 0.2s',
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.75rem', fontWeight: 700, color: '#30251F', margin: '0 0 0.5rem' }}>
        Welcome Back
      </h1>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: '#72785A', margin: '0 0 2rem' }}>
        Sign in to your PS OPTICAL account.{' '}
        <Link to="/customer/register" style={{ color: '#B65E43', fontWeight: 600, textDecoration: 'none' }}>Create account</Link>
      </p>

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
        <div>
          <label style={{ display: 'block', fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', fontWeight: 600, color: '#4A3A33', marginBottom: '0.375rem' }}>
            Email Address
          </label>
          <input {...register('email')} type="email" placeholder="you@example.com" style={inputStyle}
            onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = '#B65E43'; }}
            onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = errors.email ? '#B65E43' : '#E8E2D9'; }}
          />
          {errors.email && <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#B65E43', margin: '4px 0 0' }}>{errors.email.message}</p>}
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
            <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', fontWeight: 600, color: '#4A3A33' }}>Password</label>
            <Link to="/customer/forgot-password" style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: '#B65E43', textDecoration: 'none' }}>Forgot password?</Link>
          </div>
          <div style={{ position: 'relative' }}>
            <input {...register('password')} type={showPw ? 'text' : 'password'} placeholder="Your password"
              style={{ ...inputStyle, paddingRight: '2.75rem' }}
              onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = '#B65E43'; }}
              onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = errors.password ? '#B65E43' : '#E8E2D9'; }}
            />
            <button type="button" onClick={() => setShowPw((s) => !s)}
              style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#A89C8C', display: 'flex' }}>
              {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#B65E43', margin: '4px 0 0' }}>{errors.password.message}</p>}
        </div>

        {/* 1-Click Demo Customer Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.25rem' }}>
          <button
            type="button"
            onClick={() => handleQuickDemoLogin('customer@psoptical.com', 'Customer@123')}
            style={{
              padding: '0.65rem 0.5rem',
              borderRadius: 6,
              background: '#FDF8F3',
              border: '1.5px solid #B65E43',
              color: '#B65E43',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              textAlign: 'center',
            }}
          >
            ⚡ Demo Customer (.com)
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemoLogin('customer@psoptical.in', 'Customer@12345')}
            style={{
              padding: '0.65rem 0.5rem',
              borderRadius: 6,
              background: '#FDF8F3',
              border: '1.5px solid #B65E43',
              color: '#B65E43',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              textAlign: 'center',
            }}
          >
            ⚡ Demo Customer (.in)
          </button>
        </div>

        <button type="submit" disabled={loading}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: loading ? '#C97259' : '#B65E43', color: 'white', padding: '0.9rem 1.75rem', borderRadius: 7, fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', fontWeight: 600, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '0.25rem', transition: 'background 0.2s' }}
          onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = '#9E4E36'; }}
          onMouseLeave={(e) => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = '#B65E43'; }}>
          {loading ? 'Signing in…' : <><LogIn size={17} /> Sign In</>}
        </button>
      </form>

      <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #F0EAE0' }}>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', color: '#A89C8C', textAlign: 'center', marginBottom: '0.75rem' }}>
          Other portals
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
          <Link to="/worker/login" style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: '#72785A', textDecoration: 'none', padding: '0.5rem 0.75rem', borderRadius: 6, transition: 'background 0.15s', textAlign: 'center' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = '#F6F1E8'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; }}>
            Optical Worker Login →
          </Link>
          <Link to="/admin/login" style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: '#72785A', textDecoration: 'none', padding: '0.5rem 0.75rem', borderRadius: 6, transition: 'background 0.15s', textAlign: 'center' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = '#F6F1E8'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; }}>
            Admin Login →
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
