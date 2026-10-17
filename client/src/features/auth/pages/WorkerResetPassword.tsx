import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock } from 'lucide-react';
import { authAPI } from '../../../services/api';
import { useToast } from '../../../components/ui/Toaster';

const schema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, { message: 'Passwords do not match', path: ['confirmPassword'] });

type Form = z.infer<typeof schema>;

export default function WorkerResetPassword() {
  const { token } = useParams<{ token: string }>();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const { showToast } = useToast();
  const { register, handleSubmit, formState: { errors } } = useForm<Form>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: Form) => {
    if (!token) return;
    setLoading(true);
    try {
      await authAPI.resetPassword(token, data.password);
      setDone(true);
      showToast('Staff password updated! Please sign in.', 'success');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Invalid or expired reset link.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem 0' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', color: '#30251F', marginBottom: '0.5rem' }}>Staff Password Reset</h2>
        <p style={{ color: '#72785A', marginBottom: '1.5rem' }}>Your credentials have been securely updated.</p>
        <Link to="/worker/login" style={{ background: '#72785A', color: 'white', textDecoration: 'none', padding: '0.8rem 1.5rem', borderRadius: 6, fontWeight: 600 }}>
          Sign In to Worker Portal
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.75rem', fontWeight: 700, color: '#30251F', margin: '0 0 0.5rem' }}>
        Reset Staff Password
      </h1>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: '#72785A', margin: '0 0 2rem' }}>
        Set a new secure password for your optical store staff account.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4A3A33', marginBottom: '0.35rem' }}>New Password</label>
          <input {...register('password')} type="password" placeholder="At least 8 characters" style={{ width: '100%', padding: '0.8rem', borderRadius: 7, border: '1.5px solid #D8DED0', outline: 'none' }} />
          {errors.password && <p style={{ color: '#B65E43', fontSize: '0.75rem', margin: '4px 0 0' }}>{errors.password.message}</p>}
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4A3A33', marginBottom: '0.35rem' }}>Confirm Password</label>
          <input {...register('confirmPassword')} type="password" placeholder="Repeat password" style={{ width: '100%', padding: '0.8rem', borderRadius: 7, border: '1.5px solid #D8DED0', outline: 'none' }} />
          {errors.confirmPassword && <p style={{ color: '#B65E43', fontSize: '0.75rem', margin: '4px 0 0' }}>{errors.confirmPassword.message}</p>}
        </div>

        <button type="submit" disabled={loading} style={{ background: '#72785A', color: 'white', border: 'none', padding: '0.85rem', borderRadius: 7, fontWeight: 600, cursor: 'pointer' }}>
          {loading ? 'Updating…' : 'Update Staff Password'}
        </button>
      </form>
    </div>
  );
}
