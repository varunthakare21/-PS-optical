import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, KeyRound } from 'lucide-react';
import { authAPI } from '../../../services/api';

const schema = z.object({ email: z.string().email('Enter authorized admin email') });
type Form = z.infer<typeof schema>;

export default function AdminForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<Form>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: Form) => {
    setLoading(true);
    try {
      await authAPI.adminForgotPassword(data.email);
    } catch {}
    finally {
      setSent(true);
      setLoading(false);
    }
  };

  return (
    <div>
      <Link to="/admin/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#D4B483', textDecoration: 'none', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
        <ArrowLeft size={16} /> Return to Admin Login
      </Link>
      <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.75rem', fontWeight: 700, color: '#F0EAE0', margin: '0 0 0.5rem' }}>
        Admin Access Recovery
      </h1>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: '#A89C8C', margin: '0 0 2rem' }}>
        Enter your executive administrator credentials to initiate emergency credential reset.
      </p>

      {sent ? (
        <div style={{ background: '#272522', borderRadius: 10, padding: '1.5rem', textAlign: 'center', border: '1px solid #3A3632' }}>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: '#F0EAE0' }}>
            If the account is a validated administrator, password recovery instructions have been dispatched.
          </p>
          <Link to="/admin/login" style={{ display: 'inline-block', marginTop: '1rem', background: '#D4B483', color: '#1E1C19', textDecoration: 'none', padding: '0.65rem 1.25rem', borderRadius: 6, fontWeight: 700 }}>
            Back to Sign In
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#D4B483', marginBottom: '0.35rem' }}>Administrator Email</label>
            <input {...register('email')} type="email" placeholder="admin@psoptical.in" style={{ width: '100%', padding: '0.8rem', borderRadius: 7, border: '1.5px solid #3A3632', background: '#272522', color: '#F0EAE0', outline: 'none' }} />
            {errors.email && <p style={{ color: '#E57373', fontSize: '0.75rem', margin: '4px 0 0' }}>{errors.email.message}</p>}
          </div>
          <button type="submit" disabled={loading} style={{ background: '#D4B483', color: '#1E1C19', border: 'none', padding: '0.85rem', borderRadius: 7, fontWeight: 700, cursor: 'pointer' }}>
            {loading ? 'Dispatching Token…' : 'Send Reset Instructions'}
          </button>
        </form>
      )}
    </div>
  );
}
