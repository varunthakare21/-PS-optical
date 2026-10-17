import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PSOpticalLogo from '../components/logo/PSOpticalLogo';

const themes = {
  customer: {
    image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=900&q=80&auto=format',
    overlay: 'rgba(48,37,31,0.72)',
    headline: 'Your Eyewear Journey Starts Here',
    sub: 'Discover premium eyewear curated for your lifestyle and vision.',
    formBg: '#FFFFFF',
    isLight: true,
  },
  worker: {
    image: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=900&q=80&auto=format',
    overlay: 'rgba(50,58,40,0.78)',
    headline: 'Optical Team Portal',
    sub: 'Access your store, manage inventory, and serve customers.',
    formBg: '#FAFAF7',
    isLight: true,
  },
  admin: {
    image: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=900&q=80&auto=format',
    overlay: 'rgba(22,20,15,0.82)',
    headline: 'Secure Admin Portal',
    sub: 'Manage your optical business with complete control.',
    formBg: '#1E1C19',
    isLight: false,
  },
};

export default function AuthLayout({ role = 'customer' }: { role?: 'customer' | 'worker' | 'admin' }) {
  const t = themes[role];
  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      {/* Left: hero image panel */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'none' }} className="lg:block!">
        <img src={t.image} alt="PS Optical" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
        <div style={{ position: 'absolute', inset: 0, background: t.overlay }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '3.5rem' }}>
          <PSOpticalLogo variant="light" width={152} />
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '2.25rem', color: 'white', lineHeight: 1.25, margin: '2rem 0 0.875rem' }}>
            {t.headline}
          </h2>
          <p style={{ fontFamily: 'Inter, sans-serif', color: 'rgba(255,255,255,0.72)', fontSize: '1.05rem', lineHeight: 1.65, maxWidth: '380px' }}>
            {t.sub}
          </p>
        </div>
      </div>

      {/* Right: form panel */}
      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          width: '100%', maxWidth: '460px', flexShrink: 0,
          background: t.formBg, display: 'flex', flexDirection: 'column',
          padding: '2.5rem 2.75rem', overflowY: 'auto',
          boxShadow: '-4px 0 40px rgba(0,0,0,0.1)',
          minHeight: '100vh',
        }}
      >
        <Link to="/" style={{ display: 'inline-flex', marginBottom: '2.5rem' }}>
          <PSOpticalLogo variant={t.isLight ? 'primary' : 'light'} width={136} />
        </Link>
        <div style={{ flex: 1 }}>
          <Outlet />
        </div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', color: t.isLight ? '#A89C8C' : '#72685A', textAlign: 'center', marginTop: '2rem', borderTop: `1px solid ${t.isLight ? '#F0EAE0' : '#2A2825'}`, paddingTop: '1.25rem' }}>
          © {new Date().getFullYear()} PS OPTICAL. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}
