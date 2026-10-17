import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { KeyRound, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { authAPI } from '../../../services/api';
import { useToast } from '../../../components/ui/Toaster';

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
});
type Form = z.infer<typeof schema>;

export default function CustomerForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { showToast } = useToast();
  const { register, handleSubmit, formState: { errors } } = useForm<Form>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: Form) => {
    setLoading(true);
    try {
      await authAPI.customerForgotPassword(data.email);
      setSent(true);
    } catch {
      setSent(true); // Always generic response for security
    } finally {
      setLoading(false);
    }
  };

  const inp = {
    width: '100%', padding: '0.8rem 1rem', border: '1.5px solid #E8E2D9',
    borderRadius: 7, fontFamily: 'Inter, sans-serif', fontSize: '0.9375rem',
    color: '#30251F', background: 'white', outline: 'none', boxSizing: 'border-box' as const,
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Link to="/customer/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#72785A', textDecoration: 'none', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
        <ArrowLeft size={16} /> Back to Sign In
      </Link>

      <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.75rem', fontWeight: 700, color: '#30251F', margin: '0 0 0.5rem' }}>
        Reset Password
      </h1>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: '#72785A', margin: '0 0 2rem', lineHeight: 1.6 }}>
        Enter your registered email address and we'll send you an encrypted single-use link to reset your password.
      </p>

      {sent ? (
        <div style={{ background: '#F6F1E8', borderRadius: 10, padding: '1.5rem', textAlign: 'center' }}>
          <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#30251F', margin: '0 0 0.5rem' }}>
            Request Submitted
          </p>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: '#72785A', margin: '0 0 1.5rem', lineHeight: 1.6 }}>
            If an account is associated with this email, a reset link has been dispatched. Please check your inbox and spam folder.
          </p>
          <Link to="/customer/login" style={{ display: 'inline-block', background: '#B65E43', color: 'white', textDecoration: 'none', padding: '0.75rem 1.5rem', borderRadius: 6, fontWeight: 600, fontSize: '0.85rem' }}>
            Return to Login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', fontWeight: 600, color: '#4A3A33', marginBottom: '0.375rem' }}>
              Your Registered Email
            </label>
            <input {...register('email')} type="email" placeholder="you@example.com" style={inp} />
            {errors.email && <p style={{ color: '#B65E43', fontSize: '0.75rem', margin: '4px 0 0' }}>{errors.email.message}</p>}
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
            {loading ? 'Sending Link…' : <><KeyRound size={17} /> Send Reset Link</>}
          </button>
        </form>
      )}
    </motion.div>
  );
}
