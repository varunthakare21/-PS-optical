import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { authAPI } from '../../../services/api';
import { useToast } from '../../../components/ui/Toaster';

const schema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, { message: 'Passwords do not match', path: ['confirmPassword'] });

type Form = z.infer<typeof schema>;

export default function AdminResetPassword() {
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
      showToast('Admin password updated successfully.', 'success');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Invalid or expired administrative reset link.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const inp = {
    width: '100%', padding: '0.8rem', borderRadius: 7, border: '1.5px solid #3A3632',
    background: '#272522', color: '#F0EAE0', outline: 'none', boxSizing: 'border-box' as const,
  };

  if (done) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem 0' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', color: '#F0EAE0', marginBottom: '0.5rem' }}>Admin Credentials Updated</h2>
        <p style={{ color: '#A89C8C', marginBottom: '1.5rem', fontSize: '0.85rem' }}>Your administrator password has been updated. Audit log recorded.</p>
        <Link to="/admin/login" style={{ background: '#D4B483', color: '#1E1C19', textDecoration: 'none', padding: '0.8rem 1.5rem', borderRadius: 6, fontWeight: 700 }}>
          Sign In to Admin Console
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.75rem', fontWeight: 700, color: '#F0EAE0', margin: '0 0 0.5rem' }}>
        Reset Admin Password
      </h1>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: '#A89C8C', margin: '0 0 2rem' }}>
        Establish a new high-entropy master password for executive console access.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#D4B483', marginBottom: '0.35rem' }}>New Master Password</label>
          <input {...register('password')} type="password" placeholder="At least 8 characters" style={inp} />
          {errors.password && <p style={{ color: '#E57373', fontSize: '0.75rem', margin: '4px 0 0' }}>{errors.password.message}</p>}
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#D4B483', marginBottom: '0.35rem' }}>Confirm Master Password</label>
          <input {...register('confirmPassword')} type="password" placeholder="Repeat password" style={inp} />
          {errors.confirmPassword && <p style={{ color: '#E57373', fontSize: '0.75rem', margin: '4px 0 0' }}>{errors.confirmPassword.message}</p>}
        </div>

        <button type="submit" disabled={loading} style={{ background: '#D4B483', color: '#1E1C19', border: 'none', padding: '0.85rem', borderRadius: 7, fontWeight: 700, cursor: 'pointer' }}>
          {loading ? 'Committing…' : 'Update Admin Password'}
        </button>
      </form>
    </div>
  );
}
