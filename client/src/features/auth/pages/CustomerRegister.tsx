import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { authAPI } from '../../../services/api';
import { useToast } from '../../../components/ui/Toaster';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  terms: z.boolean().refine((v) => v, 'You must accept the terms'),
}).refine((d) => d.password === d.confirmPassword, { message: 'Passwords do not match', path: ['confirmPassword'] });

type Form = z.infer<typeof schema>;

export default function CustomerRegister() {
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<Form>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: Form) => {
    setLoading(true);
    try {
      await authAPI.customerRegister({ name: data.name, email: data.email, phone: data.phone, password: data.password });
      setDone(true);
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Registration failed. Please try again.', 'error');
    } finally { setLoading(false); }
  };

  const inp = { width: '100%', padding: '0.8rem 1rem', border: '1.5px solid #E8E2D9', borderRadius: 7, fontFamily: 'Inter, sans-serif', fontSize: '0.9375rem', color: '#30251F', background: 'white', outline: 'none', boxSizing: 'border-box' as const };

  if (done) return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '2rem 0' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✉️</div>
      <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.5rem', fontWeight: 700, color: '#30251F', margin: '0 0 0.75rem' }}>Check Your Email</h2>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.95rem', color: '#72785A', lineHeight: 1.7, margin: '0 0 2rem' }}>
        We sent a verification link to your email address. Please click it to activate your account.
      </p>
      <Link to="/customer/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#B65E43', color: 'white', padding: '0.875rem 1.75rem', borderRadius: 7, fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none' }}>
        Go to Login
      </Link>
    </motion.div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.75rem', fontWeight: 700, color: '#30251F', margin: '0 0 0.5rem' }}>Create Account</h1>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: '#72785A', margin: '0 0 2rem' }}>
        Already have an account?{' '}
        <Link to="/customer/login" style={{ color: '#B65E43', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
      </p>

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {[
          { id: 'name', label: 'Full Name', type: 'text', ph: 'Your full name', err: errors.name },
          { id: 'email', label: 'Email Address', type: 'email', ph: 'you@example.com', err: errors.email },
          { id: 'phone', label: 'Mobile Number (optional)', type: 'tel', ph: '+91 98765 43210', err: undefined },
        ].map(({ id, label, type, ph, err }) => (
          <div key={id}>
            <label style={{ display: 'block', fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', fontWeight: 600, color: '#4A3A33', marginBottom: '0.375rem' }}>{label}</label>
            <input {...register(id as any)} type={type} placeholder={ph} style={inp}
              onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = '#B65E43'; }}
              onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = '#E8E2D9'; }} />
            {err && <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#B65E43', margin: '4px 0 0' }}>{(err as any).message}</p>}
          </div>
        ))}

        <div>
          <label style={{ display: 'block', fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', fontWeight: 600, color: '#4A3A33', marginBottom: '0.375rem' }}>Password</label>
          <div style={{ position: 'relative' }}>
            <input {...register('password')} type={showPw ? 'text' : 'password'} placeholder="Minimum 8 characters"
              style={{ ...inp, paddingRight: '2.75rem' }}
              onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = '#B65E43'; }}
              onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = '#E8E2D9'; }} />
            <button type="button" onClick={() => setShowPw((s) => !s)}
              style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#A89C8C', display: 'flex' }}>
              {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
          {errors.password && <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#B65E43', margin: '4px 0 0' }}>{errors.password.message}</p>}
        </div>

        <div>
          <label style={{ display: 'block', fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', fontWeight: 600, color: '#4A3A33', marginBottom: '0.375rem' }}>Confirm Password</label>
          <input {...register('confirmPassword')} type="password" placeholder="Repeat your password" style={inp}
            onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = '#B65E43'; }}
            onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = '#E8E2D9'; }} />
          {errors.confirmPassword && <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#B65E43', margin: '4px 0 0' }}>{errors.confirmPassword.message}</p>}
        </div>

        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', cursor: 'pointer' }}>
          <input {...register('terms')} type="checkbox" style={{ marginTop: 3, flexShrink: 0 }} />
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', color: '#4A3A33', lineHeight: 1.5 }}>
            I agree to the{' '}
            <Link to="/terms" style={{ color: '#B65E43', textDecoration: 'none' }}>Terms of Service</Link> and{' '}
            <Link to="/privacy" style={{ color: '#B65E43', textDecoration: 'none' }}>Privacy Policy</Link>
          </span>
        </label>
        {errors.terms && <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#B65E43', margin: '-0.5rem 0 0' }}>{errors.terms.message}</p>}

        <button type="submit" disabled={loading}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: loading ? '#C97259' : '#B65E43', color: 'white', padding: '0.9rem', borderRadius: 7, fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', fontWeight: 600, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '0.375rem', transition: 'background 0.2s' }}>
          {loading ? 'Creating Account…' : <><UserPlus size={17} /> Create Account</>}
        </button>
      </form>
    </motion.div>
  );
}
