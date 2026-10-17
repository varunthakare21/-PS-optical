import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, ShieldCheck, UserPlus, ArrowLeft, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { authAPI } from '../../../services/api';
import { useAuth } from '../AuthContext';
import { useToast } from '../../../components/ui/Toaster';

const schema = z.object({
  name: z.string().min(2, 'Full name is required (min 2 characters)'),
  email: z.string().email('Enter valid corporate/administrator email'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter valid 10-digit Indian mobile number'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm password must match'),
  storeLocation: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type Form = z.infer<typeof schema>;

export default function AdminRegister() {
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: {
      storeLocation: 'PS Optical Flagship (Near Post Office, Bhandara - 441904)',
    },
  });

  const onSubmit = async (data: Form) => {
    setLoading(true);
    try {
      const res = await authAPI.adminRegister({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
      });
      login(res.data.user, res.data.token);
      showToast('Administrator profile registered successfully. Privileges granted.', 'success');
      navigate('/admin/dashboard');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Administrator registration failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const inp = {
    width: '100%',
    padding: '0.8rem 1rem',
    border: '1.5px solid #3A3632',
    borderRadius: 7,
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.9rem',
    color: '#F0EAE0',
    background: '#272522',
    outline: 'none',
    boxSizing: 'border-box' as const,
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Link
        to="/admin/login"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          color: '#D4B483',
          textDecoration: 'none',
          fontSize: '0.82rem',
          marginBottom: '1rem',
          fontWeight: 600,
        }}
      >
        <ArrowLeft size={15} /> Back to Sign In
      </Link>

      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          background: '#D4B483',
          color: '#1E1C19',
          fontSize: '0.65rem',
          fontWeight: 800,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          padding: '3px 8px',
          borderRadius: 4,
          marginBottom: '0.75rem',
        }}
      >
        <ShieldCheck size={12} /> Executive Onboarding
      </div>

      <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.75rem', fontWeight: 700, color: '#F0EAE0', margin: '0 0 0.5rem' }}>
        Create Administrator Profile
      </h1>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: '#A89C8C', margin: '0 0 1.75rem' }}>
        Enroll as a certified executive to manage store operations, catalog inventory, and statewide Maharashtra fulfillment.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#D4B483', marginBottom: '0.35rem' }}>
            Executive Full Name
          </label>
          <input {...register('name')} type="text" placeholder="e.g. Vikramaditya Deshmukh" style={inp} />
          {errors.name && <p style={{ color: '#E57373', fontSize: '0.75rem', margin: '4px 0 0' }}>{errors.name.message}</p>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#D4B483', marginBottom: '0.35rem' }}>
              Administrator Email
            </label>
            <input {...register('email')} type="email" placeholder="admin@psoptical.in" style={inp} />
            {errors.email && <p style={{ color: '#E57373', fontSize: '0.75rem', margin: '4px 0 0' }}>{errors.email.message}</p>}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#D4B483', marginBottom: '0.35rem' }}>
              Direct Mobile (10-digit)
            </label>
            <input {...register('phone')} type="tel" placeholder="9876543210" style={inp} />
            {errors.phone && <p style={{ color: '#E57373', fontSize: '0.75rem', margin: '4px 0 0' }}>{errors.phone.message}</p>}
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#D4B483', marginBottom: '0.35rem' }}>
            Primary Boutique Assignment
          </label>
          <div style={{ position: 'relative' }}>
            <input
              {...register('storeLocation')}
              readOnly
              style={{ ...inp, background: '#1F1E1B', color: '#B8AFA8', cursor: 'not-allowed', paddingLeft: '2.4rem' }}
            />
            <Building2 size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#D4B483' }} />
          </div>
          <span style={{ fontSize: '0.72rem', color: '#8F857B', display: 'block', marginTop: 3 }}>
            Flagship Optical Boutique (Near Post Office, Bhandara - 441904)
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#D4B483', marginBottom: '0.35rem' }}>
              Admin Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                {...register('password')}
                type={showPw ? 'text' : 'password'}
                placeholder="At least 6 chars"
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

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#D4B483', marginBottom: '0.35rem' }}>
              Confirm Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                {...register('confirmPassword')}
                type={showConfirmPw ? 'text' : 'password'}
                placeholder="Repeat password"
                style={{ ...inp, paddingRight: '2.5rem' }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPw((s) => !s)}
                style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#A89C8C', display: 'flex' }}
              >
                {showConfirmPw ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            {errors.confirmPassword && <p style={{ color: '#E57373', fontSize: '0.75rem', margin: '4px 0 0' }}>{errors.confirmPassword.message}</p>}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            background: loading ? '#B8965E' : '#D4B483',
            color: '#1E1C19',
            padding: '0.9rem',
            borderRadius: 7,
            border: 'none',
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.92rem',
            fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
            marginTop: '0.5rem',
          }}
        >
          {loading ? 'Creating Administrator Profile…' : <><UserPlus size={16} /> Register Administrator Profile</>}
        </button>
      </form>

      <div style={{ marginTop: '1.75rem', textAlign: 'center', borderTop: '1px solid #3A3632', paddingTop: '1.25rem' }}>
        <p style={{ fontSize: '0.85rem', color: '#A89C8C', margin: 0 }}>
          Already have an authorized admin profile?{' '}
          <Link to="/admin/login" style={{ color: '#D4B483', fontWeight: 600, textDecoration: 'none' }}>
            Sign In Here
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
