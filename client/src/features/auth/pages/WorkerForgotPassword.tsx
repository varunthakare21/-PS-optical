import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, KeyRound } from 'lucide-react';
import { authAPI } from '../../../services/api';

const schema = z.object({ email: z.string().email('Enter valid work email') });
type Form = z.infer<typeof schema>;

export default function WorkerForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<Form>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: Form) => {
    setLoading(true);
    try {
      await authAPI.workerForgotPassword(data.email);
    } catch {}
    finally {
      setSent(true);
      setLoading(false);
    }
  };

  return (
    <div>
      <Link to="/worker/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#72785A', textDecoration: 'none', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
        <ArrowLeft size={16} /> Back to Worker Sign In
      </Link>
      <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.75rem', fontWeight: 700, color: '#30251F', margin: '0 0 0.5rem' }}>
        Worker Password Recovery
      </h1>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: '#72785A', margin: '0 0 2rem' }}>
        Submit your registered optical team work email for a secure password reset token.
      </p>

      {sent ? (
        <div style={{ background: '#F5F6F2', borderRadius: 10, padding: '1.5rem', textAlign: 'center' }}>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: '#30251F' }}>
            If this work email is registered, a password recovery link has been dispatched to your inbox.
          </p>
          <Link to="/worker/login" style={{ display: 'inline-block', marginTop: '1rem', background: '#72785A', color: 'white', textDecoration: 'none', padding: '0.65rem 1.25rem', borderRadius: 6 }}>
            Return to Sign In
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4A3A33', marginBottom: '0.35rem' }}>Registered Work Email</label>
            <input {...register('email')} type="email" placeholder="staff@psoptical.in" style={{ width: '100%', padding: '0.8rem', borderRadius: 7, border: '1.5px solid #D8DED0', outline: 'none' }} />
            {errors.email && <p style={{ color: '#B65E43', fontSize: '0.75rem', margin: '4px 0 0' }}>{errors.email.message}</p>}
          </div>
          <button type="submit" disabled={loading} style={{ background: '#72785A', color: 'white', border: 'none', padding: '0.85rem', borderRadius: 7, fontWeight: 600, cursor: 'pointer' }}>
            {loading ? 'Dispatching…' : 'Send Recovery Link'}
          </button>
        </form>
      )}
    </div>
  );
}
