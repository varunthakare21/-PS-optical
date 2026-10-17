import { Link } from 'react-router-dom';
import { useState } from 'react';
import { MapPin, Phone, Mail, ArrowRight } from 'lucide-react';
import PSOpticalLogo from '../logo/PSOpticalLogo';

const InstagramIcon = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const FacebookIcon = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const TwitterIcon = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
  </svg>
);

const YoutubeIcon = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
    <path d="m10 15 5-3-5-3z"/>
  </svg>
);

const cols = [
  {
    title: 'Shop',
    links: [
      { label: 'Eyeglasses', to: '/eyeglasses' },
      { label: 'Sunglasses', to: '/sunglasses' },
      { label: 'Computer Glasses', to: '/eyeglasses?type=computer' },
      { label: 'Contact Lenses', to: '/contact-lenses' },
      { label: "Kids' Eyewear", to: '/eyeglasses?gender=kids' },
      { label: 'New Arrivals', to: '/eyeglasses?new=true' },
      { label: 'Offers', to: '/offers' },
    ],
  },
  {
    title: 'Services',
    links: [
      { label: 'Virtual Try-On', to: '/virtual-try-on' },
      { label: 'Frame Finder', to: '/frame-finder' },
      { label: 'Book Eye Test', to: '/appointment' },
      { label: 'Try at Home', to: '/try-at-home' },
      { label: 'Find a Store', to: '/store-locator' },
    ],
  },
  {
    title: 'Help',
    links: [
      { label: 'My Account', to: '/customer/dashboard' },
      { label: 'Track Order', to: '/customer/orders' },
      { label: 'Returns & Refunds', to: '/customer/returns' },
      { label: 'Contact Us', to: '/contact' },
      { label: 'Privacy Policy', to: '/privacy' },
      { label: 'Terms of Service', to: '/terms' },
    ],
  },
];

const socials = [
  { icon: InstagramIcon, href: '#', label: 'Instagram' },
  { icon: FacebookIcon, href: '#', label: 'Facebook' },
  { icon: TwitterIcon, href: '#', label: 'X / Twitter' },
  { icon: YoutubeIcon, href: '#', label: 'YouTube' },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer style={{ background: '#30251F', color: '#EDE5D4' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '3.5rem 1.5rem 2.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2.25rem' }}>
        {/* Brand */}
        <div>
          <PSOpticalLogo variant="light" width={144} />
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.83rem', color: '#A89C8C', lineHeight: 1.7, marginTop: '1.25rem', maxWidth: 240 }}>
            Premium eyewear crafted for clarity, comfort, and everyday style. Your vision deserves the very best.
          </p>
          <div style={{ display: 'flex', gap: '0.625rem', marginTop: '1.5rem' }}>
            {socials.map(({ icon: Icon, href, label }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                style={{ width: 35, height: 35, borderRadius: '50%', background: 'rgba(212,180,131,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D4B483', textDecoration: 'none', transition: 'background 0.2s, color 0.2s' }}
                onMouseEnter={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = '#D4B483'; el.style.color = '#30251F'; }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = 'rgba(212,180,131,0.1)'; el.style.color = '#D4B483'; }}>
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {cols.map((col) => (
          <div key={col.title}>
            <h4 style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase', color: '#D4B483', marginBottom: '1.25rem', marginTop: 0 }}>
              {col.title}
            </h4>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {col.links.map(({ label, to }) => (
                <li key={label}>
                  <Link to={to}
                    style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.83rem', color: '#A89C8C', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#F6F1E8'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#A89C8C'; }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Contact & newsletter */}
        <div>
          <h4 style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase', color: '#D4B483', marginBottom: '1.25rem', marginTop: 0 }}>
            Contact
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '1.5rem' }}>
            {[
              { icon: MapPin, text: 'Near Post Office, Bhandara, Maharashtra - 441904' },
              { icon: Phone, text: '+91 7184 252200 / 1800-PS-VISION' },
              { icon: Mail, text: 'bhandara@psoptical.in' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem' }}>
                <Icon size={13} style={{ color: '#D4B483', marginTop: 2, flexShrink: 0 }} />
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.81rem', color: '#A89C8C' }}>{text}</span>
              </div>
            ))}
          </div>
          {!subscribed ? (
            <form onSubmit={(e) => { e.preventDefault(); if (email) setSubscribed(true); }}>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: '#A89C8C', margin: '0 0 0.5rem' }}>Get offers &amp; eyewear news:</p>
              <div style={{ display: 'flex' }}>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  style={{ flex: 1, padding: '0.575rem 0.75rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,180,131,0.22)', borderRight: 'none', borderRadius: '6px 0 0 6px', color: '#F6F1E8', fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', outline: 'none' }}
                />
                <button type="submit" style={{ padding: '0.575rem 0.75rem', background: '#B65E43', border: 'none', borderRadius: '0 6px 6px 0', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', transition: 'background 0.2s' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#9E4E36'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#B65E43'; }}>
                  <ArrowRight size={15} />
                </button>
              </div>
            </form>
          ) : (
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: '#72785A' }}>✓ Subscribed! Thank you.</p>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(212,180,131,0.1)', padding: '1.125rem 1.5rem' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '0.875rem', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#72685A', margin: 0 }}>
            © {new Date().getFullYear()} PS OPTICAL. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            {[{ l: 'Privacy', t: '/privacy' }, { l: 'Terms', t: '/terms' }, { l: 'Sitemap', t: '/sitemap' }].map(({ l, t }) => (
              <Link key={l} to={t} style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#72685A', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#A89C8C'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#72685A'; }}>
                {l}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
