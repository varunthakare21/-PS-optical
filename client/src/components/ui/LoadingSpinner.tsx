import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function LoadingSpinner({ fullScreen, size = 'md' }: LoadingSpinnerProps) {
  const sizeMap = { sm: 28, md: 44, lg: 64 };
  const s = sizeMap[size];

  const spinner = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
      <svg width={s} height={s} viewBox="0 0 44 44" fill="none" aria-hidden="true">
        <circle cx="22" cy="22" r="18" stroke="#EDE5D4" strokeWidth="3" />
        <motion.circle
          cx="22" cy="22" r="18"
          stroke="#B65E43"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="75 38"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '22px 22px' }}
        />
      </svg>
      {fullScreen && (
        <p style={{ fontFamily: 'Inter, sans-serif', color: '#72785A', fontSize: '0.875rem', margin: 0 }}>
          Loading…
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div style={{
        minHeight: '100vh', background: '#F6F1E8',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {spinner}
      </div>
    );
  }
  return spinner;
}
