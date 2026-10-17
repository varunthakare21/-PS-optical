import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../features/auth/AuthContext';
import PSOpticalLogo from '../components/logo/PSOpticalLogo';
import {
  LayoutDashboard, ShoppingBag, Heart, User, ClipboardList,
  Calendar, RotateCcw, MessageSquare, LogOut, Menu, X,
  Store, Users, FileText, Tag, Star, BarChart2, Boxes,
  ShieldCheck, Package,
} from 'lucide-react';

const navs = {
  customer: [
    { label: 'Dashboard', to: '/customer/dashboard', icon: LayoutDashboard },
    { label: 'My Orders', to: '/customer/orders', icon: ShoppingBag },
    { label: 'Wishlist', to: '/customer/wishlist', icon: Heart },
    { label: 'Prescriptions', to: '/customer/prescriptions', icon: ClipboardList },
    { label: 'Appointments', to: '/customer/appointments', icon: Calendar },
    { label: 'Returns', to: '/customer/returns', icon: RotateCcw },
    { label: 'Support', to: '/customer/support', icon: MessageSquare },
    { label: 'Profile', to: '/customer/profile', icon: User },
  ],
  worker: [
    { label: 'Dashboard', to: '/worker/dashboard', icon: LayoutDashboard },
    { label: 'Inventory', to: '/worker/inventory', icon: Boxes },
    { label: 'Appointments', to: '/worker/appointments', icon: Calendar },
    { label: 'Profile', to: '/worker/profile', icon: User },
  ],
  admin: [
    { label: 'Dashboard', to: '/admin/dashboard', icon: BarChart2 },
    { label: 'Frames & Products', to: '/admin/products', icon: Package },
    { label: 'Frame Bookings', to: '/admin/bookings', icon: Calendar },
    { label: 'Complaints', to: '/admin/complaints', icon: MessageSquare },
    { label: 'Categories', to: '/admin/categories', icon: Tag },
    { label: 'Orders', to: '/admin/orders', icon: ShoppingBag },
    { label: 'Customers', to: '/admin/customers', icon: Users },
    { label: 'Workers', to: '/admin/workers', icon: ShieldCheck },
    { label: 'Stores', to: '/admin/stores', icon: Store },
    { label: 'Inventory', to: '/admin/inventory', icon: Boxes },
    { label: 'Appointments', to: '/admin/appointments', icon: Calendar },
    { label: 'Returns', to: '/admin/returns', icon: RotateCcw },
    { label: 'Reviews', to: '/admin/reviews', icon: Star },
    { label: 'Coupons', to: '/admin/coupons', icon: Tag },
    { label: 'Audit Logs', to: '/admin/audit-logs', icon: FileText },
  ],
};

const redirects = { customer: '/customer/login', worker: '/worker/login', admin: '/admin/login' };

const themes = {
  customer: { sidebar: '#fff', text: '#4A3A33', active: '#B65E43', activeText: '#fff', hover: '#FDF8F3', border: '#F0EAE0', badge: '#B65E43', badgeText: '#fff', main: '#F6F1E8', headerBg: '#fff' },
  worker:   { sidebar: '#fff', text: '#3A4030', active: '#72785A', activeText: '#fff', hover: '#F5F6F2', border: '#E8EAE0', badge: '#72785A', badgeText: '#fff', main: '#F6F1E8', headerBg: '#fff' },
  admin:    { sidebar: '#1E1C19', text: '#B8AFA8', active: '#D4B483', activeText: '#1E1C19', hover: '#2A2825', border: '#3A3632', badge: '#D4B483', badgeText: '#1E1C19', main: '#16140F', headerBg: '#1E1C19' },
};

export default function DashboardLayout({ role }: { role: 'customer' | 'worker' | 'admin' }) {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const loc = useLocation();
  const nav = useNavigate();
  const th = themes[role];
  const links = navs[role];
  const isAdmin = role === 'admin';

  const doLogout = async () => { await logout(); nav(redirects[role]); };

  const Sidebar = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: th.sidebar }}>
      {/* Logo */}
      <div style={{ padding: '1.25rem', borderBottom: `1px solid ${th.border}` }}>
        <Link to="/" onClick={() => setOpen(false)}>
          <PSOpticalLogo variant={isAdmin ? 'light' : 'primary'} width={128} />
        </Link>
        <span style={{ display: 'inline-block', marginTop: '0.5rem', background: th.badge, color: th.badgeText, fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '2px 8px', borderRadius: '4px', fontFamily: 'Inter, sans-serif' }}>
          {role} portal
        </span>
      </div>

      {/* User */}
      {user && (
        <div style={{ padding: '1rem 1.25rem', borderBottom: `1px solid ${th.border}`, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: th.active, display: 'flex', alignItems: 'center', justifyContent: 'center', color: th.activeText, fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.875rem', flexShrink: 0 }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ margin: 0, fontFamily: 'Inter, sans-serif', fontSize: '0.825rem', fontWeight: 600, color: isAdmin ? '#F0EAE0' : '#30251F', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</p>
            <p style={{ margin: 0, fontFamily: 'Inter, sans-serif', fontSize: '0.7rem', color: th.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</p>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav style={{ flex: 1, padding: '0.625rem', overflowY: 'auto' }}>
        {links.map(({ label, to, icon: Icon }) => {
          const active = loc.pathname === to || (to !== `/${role}/dashboard` && loc.pathname.startsWith(to));
          return (
            <Link key={to} to={to} onClick={() => setOpen(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.625rem',
                padding: '0.56rem 0.875rem', borderRadius: '7px', marginBottom: '2px',
                textDecoration: 'none', fontFamily: 'Inter, sans-serif', fontSize: '0.845rem',
                fontWeight: active ? 600 : 400,
                background: active ? th.active : 'transparent',
                color: active ? th.activeText : th.text,
                transition: 'background 0.15s, color 0.15s',
              }}
              onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLAnchorElement).style.background = th.hover; }}
              onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; }}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: '0.625rem', borderTop: `1px solid ${th.border}` }}>
        <button onClick={doLogout}
          style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', width: '100%', padding: '0.56rem 0.875rem', borderRadius: '7px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: '0.845rem', color: th.text, transition: 'background 0.15s' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = th.hover; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: th.main }}>
      {/* Desktop sidebar */}
      <aside style={{ width: 228, flexShrink: 0, position: 'sticky', top: 0, height: '100vh', borderRight: `1px solid ${th.border}`, display: 'none' }} className="lg:block!">
        <Sidebar />
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 40 }} />
            <motion.aside
              initial={{ x: -228 }} animate={{ x: 0 }} exit={{ x: -228 }}
              transition={{ type: 'spring', stiffness: 420, damping: 36 }}
              style={{ position: 'fixed', left: 0, top: 0, bottom: 0, width: 228, zIndex: 50, borderRight: `1px solid ${th.border}` }}
            >
              <Sidebar />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Mobile header */}
        <header style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.875rem 1.25rem', background: th.headerBg, borderBottom: `1px solid ${th.border}` }} className="lg:hidden!">
          <button onClick={() => setOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: th.text, padding: 4, display: 'flex' }}>
            <Menu size={22} />
          </button>
          <PSOpticalLogo variant={isAdmin ? 'light' : 'primary'} width={116} />
        </header>
        <motion.main initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
          style={{ flex: 1, padding: '1.75rem', maxWidth: 1200, width: '100%', margin: '0 auto' }}>
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
}
