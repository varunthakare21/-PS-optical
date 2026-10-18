import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, Heart, ShoppingBag, Menu, X, ChevronDown } from 'lucide-react';
import PSOpticalLogo from '../logo/PSOpticalLogo';
import { useAuth } from '../../features/auth/AuthContext';
import { useCart } from '../../features/cart/CartContext';
import { productsAPI } from '../../services/api';

const NAV = [
  { label: 'Eyeglasses', href: '/eyeglasses', items: ["Men's", "Women's", 'Unisex', 'Round', 'Rectangle', 'Cat-Eye', 'Rimless', 'Full-Rim'] },
  { label: 'Sunglasses & Shades', href: '/sunglasses', items: ['Polarized', 'Aviator', 'Wayfarer', 'Oversized', 'Sports'] },
  { label: 'Computer Glasses', href: '/eyeglasses?type=computer' },
  { label: 'New Arrivals', href: '/eyeglasses?new=true' },
  { label: 'Offers', href: '/offers' },
  { label: 'Find a Store', href: '/store-locator' },
];

const ACCOUNT_LINKS = [
  { label: 'Customer Login', to: '/customer/login', bold: true },
  { label: 'Create Account', to: '/customer/register', bold: false },
  { label: 'Optical Worker Login', to: '/worker/login', bold: false },
  { label: 'Admin Login', to: '/admin/login', bold: false },
];

const dashMap: Record<string, string> = {
  customer: '/customer/dashboard',
  worker: '/worker/dashboard',
  admin: '/admin/dashboard',
};

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaActive, setMegaActive] = useState<string | null>(null);
  const [accOpen, setAccOpen] = useState(false);
  const [srchOpen, setSrchOpen] = useState(false);
  const [q, setQ] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const accRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) { setSrchOpen(false); setResults([]); }
      if (accRef.current && !accRef.current.contains(e.target as Node)) setAccOpen(false);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  useEffect(() => {
    if (!q.trim() || q.length < 2) { setResults([]); return; }
    const t = setTimeout(async () => {
      try { setSearching(true); const r = await productsAPI.search(q); setResults(r.data.data?.slice(0, 6) || []); }
      catch { setResults([]); } finally { setSearching(false); }
    }, 320);
    return () => clearTimeout(t);
  }, [q]);

  const doLogout = async () => { await logout(); setAccOpen(false); navigate('/'); };

  const dropStyle = {
    position: 'absolute' as const, top: 'calc(100% + 8px)', right: 0,
    background: 'white', borderRadius: '12px',
    boxShadow: '0 16px 48px rgba(48,37,31,0.13)', border: '1px solid #F0EAE0',
    zIndex: 200,
  };

  return (
    <>
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: scrolled ? 'rgba(246,241,232,0.97)' : '#F6F1E8',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid #E8E0D0' : '1px solid transparent',
        boxShadow: scrolled ? '0 4px 24px rgba(48,37,31,0.06)' : 'none',
        transition: 'all 0.3s ease',
      }}>
        <div style={{ maxWidth: 1340, margin: '0 auto', padding: '0 1.5rem', height: 68, display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {/* Logo */}
          <Link to="/" style={{ flexShrink: 0, textDecoration: 'none' }}>
            <PSOpticalLogo variant="primary" width={148} height={44} />
          </Link>

          {/* Desktop nav */}
          <nav style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.125rem' }} className="hidden! lg:flex!">
            {NAV.map((link) => (
              <div key={link.label} style={{ position: 'relative' }}
                onMouseEnter={() => link.items ? setMegaActive(link.label) : setMegaActive(null)}
                onMouseLeave={() => setMegaActive(null)}>
                <Link to={link.href} style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '0.45rem 0.7rem', fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', fontWeight: 500, color: '#30251F', textDecoration: 'none', borderRadius: 6, whiteSpace: 'nowrap', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#B65E43'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#30251F'; }}>
                  {link.label}
                  {link.items && <ChevronDown size={11} style={{ opacity: 0.55 }} />}
                </Link>
                <AnimatePresence>
                  {link.items && megaActive === link.label && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.16 }}
                      style={{ ...dropStyle, left: '50%', transform: 'translateX(-50%)', right: 'auto', minWidth: 200, padding: '0.875rem' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px' }}>
                        {link.items.map((item) => (
                          <Link key={item} to={`${link.href}?q=${encodeURIComponent(item)}`}
                            onClick={() => setMegaActive(null)}
                            style={{ display: 'block', padding: '0.5rem 0.75rem', fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', color: '#4A3A33', textDecoration: 'none', borderRadius: 6, whiteSpace: 'nowrap', transition: 'background 0.15s' }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = '#FDF8F3'; (e.currentTarget as HTMLAnchorElement).style.color = '#B65E43'; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; (e.currentTarget as HTMLAnchorElement).style.color = '#4A3A33'; }}>
                            {item}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.125rem', flexShrink: 0 }}>
            {/* Search */}
            <div ref={searchRef} style={{ position: 'relative' }}>
              <button onClick={() => setSrchOpen((o) => !o)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, color: '#30251F', borderRadius: 8, display: 'flex' }} aria-label="Search">
                <Search size={20} />
              </button>
              <AnimatePresence>
                {srchOpen && (
                  <motion.div initial={{ opacity: 0, scale: 0.95, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 8 }}
                    style={{ ...dropStyle, width: 320 }}>
                    <div style={{ padding: '0.625rem', borderBottom: '1px solid #F0EAE0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#F6F1E8', borderRadius: 7, padding: '0.5rem 0.75rem' }}>
                        <Search size={15} style={{ color: '#A89C8C' }} />
                        <input autoFocus value={q} onChange={(e) => setQ(e.target.value)}
                          placeholder="Search frames, brands…"
                          style={{ border: 'none', background: 'none', outline: 'none', fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: '#30251F', width: '100%' }}
                          onKeyDown={(e) => { if (e.key === 'Enter' && q) { navigate(`/eyeglasses?q=${q}`); setSrchOpen(false); }}}
                        />
                      </div>
                    </div>
                    {searching && <div style={{ padding: '1rem', textAlign: 'center', fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', color: '#A89C8C' }}>Searching…</div>}
                    {results.map((p) => (
                      <Link key={p._id} to={`/products/${p.slug}`}
                        onClick={() => { setSrchOpen(false); setQ(''); }}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', textDecoration: 'none', borderBottom: '1px solid #F8F4EE', transition: 'background 0.15s' }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = '#FDF8F3'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; }}>
                        {p.images?.[0] && <img src={p.images[0]} alt={p.name} style={{ width: 44, height: 32, objectFit: 'contain', borderRadius: 4, background: '#F0EAE0' }} />}
                        <div>
                          <p style={{ margin: 0, fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', fontWeight: 500, color: '#30251F' }}>{p.name}</p>
                          <p style={{ margin: 0, fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', color: '#B65E43' }}>₹{(p.salePrice || p.basePrice).toLocaleString()}</p>
                        </div>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Account */}
            <div ref={accRef} style={{ position: 'relative' }}>
              <button onClick={() => setAccOpen((o) => !o)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, color: '#30251F', borderRadius: 8, display: 'flex' }} aria-label="Account">
                <User size={20} />
              </button>
              <AnimatePresence>
                {accOpen && (
                  <motion.div initial={{ opacity: 0, scale: 0.95, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 8 }}
                    style={{ ...dropStyle, minWidth: 224, overflow: 'hidden' }}>
                    {user ? (
                      <>
                        <div style={{ padding: '0.875rem 1rem', background: '#FDF8F3', borderBottom: '1px solid #F0EAE0' }}>
                          <p style={{ margin: 0, fontFamily: 'Inter, sans-serif', fontSize: '0.825rem', fontWeight: 600, color: '#30251F' }}>{user.name}</p>
                          <p style={{ margin: '2px 0 0', fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', color: '#72785A' }}>{user.email}</p>
                        </div>
                        {dashMap[user.role] && (
                          <Link to={dashMap[user.role]} onClick={() => setAccOpen(false)}
                            style={{ display: 'block', padding: '0.625rem 1rem', fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: '#4A3A33', textDecoration: 'none', transition: 'background 0.15s' }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = '#FDF8F3'; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; }}>
                            My Dashboard
                          </Link>
                        )}
                        <button onClick={doLogout}
                          style={{ display: 'block', width: '100%', textAlign: 'left', padding: '0.625rem 1rem', fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: '#B65E43', background: 'none', border: 'none', borderTop: '1px solid #F0EAE0', cursor: 'pointer', transition: 'background 0.15s' }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#FDF8F3'; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}>
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <div style={{ padding: '0.5rem' }}>
                        {ACCOUNT_LINKS.map(({ label, to, bold }) => (
                          <Link key={to} to={to} onClick={() => setAccOpen(false)}
                            style={{ display: 'block', padding: '0.6rem 0.875rem', fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', fontWeight: bold ? 600 : 400, color: bold ? '#B65E43' : '#4A3A33', textDecoration: 'none', borderRadius: 7, transition: 'background 0.15s' }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = '#FDF8F3'; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; }}>
                            {label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Wishlist */}
            <Link to="/customer/wishlist" style={{ padding: 8, color: '#30251F', display: 'flex', textDecoration: 'none', borderRadius: 8, transition: 'color 0.2s' }} aria-label="Wishlist"
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#B65E43'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#30251F'; }}>
              <Heart size={20} />
            </Link>

            {/* Cart */}
            <Link to="/cart" style={{ position: 'relative', padding: 8, color: '#30251F', display: 'flex', textDecoration: 'none', borderRadius: 8, transition: 'color 0.2s' }} aria-label={`Cart, ${itemCount} items`}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#B65E43'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#30251F'; }}>
              <ShoppingBag size={20} />
              {itemCount > 0 && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                  style={{ position: 'absolute', top: 4, right: 4, background: '#B65E43', color: 'white', borderRadius: '50%', width: 17, height: 17, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif', fontSize: '0.6rem', fontWeight: 700 }}>
                  {itemCount > 9 ? '9+' : itemCount}
                </motion.span>
              )}
            </Link>

            {/* Mobile menu */}
            <button onClick={() => setMobileOpen((o) => !o)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, color: '#30251F', borderRadius: 8, display: 'flex' }} className="lg:hidden!" aria-label="Menu">
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.42)', zIndex: 90 }} />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 420, damping: 36 }}
              style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 280, background: '#F6F1E8', zIndex: 100, overflowY: 'auto', padding: '1.5rem', boxShadow: '-8px 0 48px rgba(48,37,31,0.15)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
                <PSOpticalLogo variant="primary" width={120} />
                <button onClick={() => setMobileOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#30251F', padding: 4 }}><X size={22} /></button>
              </div>
              {NAV.map((link) => (
                <Link key={link.label} to={link.href} onClick={() => setMobileOpen(false)}
                  style={{ display: 'block', padding: '0.75rem 1rem', fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', fontWeight: 500, color: '#30251F', textDecoration: 'none', borderRadius: 8, marginBottom: 2, transition: 'background 0.15s' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = '#EDE5D4'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; }}>
                  {link.label}
                </Link>
              ))}
              <div style={{ borderTop: '1px solid #E8E0D0', marginTop: '1.25rem', paddingTop: '1.25rem' }}>
                {user ? (
                  <>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: '#72785A', margin: '0 0 0.5rem', padding: '0 1rem' }}>Hi, {user.name}</p>
                    {dashMap[user.role] && (
                      <Link to={dashMap[user.role]} onClick={() => setMobileOpen(false)}
                        style={{ display: 'block', padding: '0.75rem 1rem', fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: '#B65E43', textDecoration: 'none', borderRadius: 8 }}>
                        My Dashboard
                      </Link>
                    )}
                    <button onClick={doLogout} style={{ display: 'block', textAlign: 'left', padding: '0.75rem 1rem', fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: '#30251F', background: 'none', border: 'none', cursor: 'pointer', borderRadius: 8, width: '100%' }}>Sign Out</button>
                  </>
                ) : ACCOUNT_LINKS.map(({ label, to }) => (
                  <Link key={to} to={to} onClick={() => setMobileOpen(false)}
                    style={{ display: 'block', padding: '0.75rem 1rem', fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: '#30251F', textDecoration: 'none', borderRadius: 8, marginBottom: 2 }}>
                    {label}
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
