import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Tag, Copy, Check, ArrowRight, Gift } from 'lucide-react';
import { useToast } from '../components/ui/Toaster';

const OFFERS = [
  {
    code: 'WELCOME15',
    title: '15% Off Your First Purchase',
    description: 'Welcome to PS OPTICAL. Enjoy 15% discount across all prescription frames and sunglasses.',
    minOrder: '₹1,999',
    validTill: 'December 31, 2026',
    category: 'First Time Shopper',
  },
  {
    code: 'PSO500',
    title: 'Flat ₹500 Instant Discount',
    description: 'Get ₹500 off instantly on all orders of designer Italian acetate & titanium frames.',
    minOrder: '₹2,999',
    validTill: 'December 31, 2026',
    category: 'Site-wide',
  },
  {
    code: 'BLUELIGHT20',
    title: 'Complimentary Blue-Light Lens Upgrade',
    description: 'Get free digital blue-cut lens coating upgrade when you buy any optical frame.',
    minOrder: '₹2,499',
    validTill: 'Limited Time Offer',
    category: 'Computer Glasses',
  },
];

export default function OffersPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { showToast } = useToast();

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast(`Coupon code ${code} copied to clipboard!`, 'success');
    setTimeout(() => setCopiedCode(null), 3000);
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1.5rem 5rem' }}>
      <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#B65E43', margin: '0 0 0.5rem' }}>
          Exclusive Perks
        </p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 700, color: '#30251F', margin: 0 }}>
          Featured Offers &amp; Promo Coupons
        </h1>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', color: '#72785A', marginTop: '0.5rem' }}>
          Apply these verified coupon codes during checkout to enjoy special discounts on your eyewear.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.75rem' }}>
        {OFFERS.map((off) => (
          <div
            key={off.code}
            style={{
              background: 'white', borderRadius: 14, padding: '1.75rem',
              border: '1.5px dashed #D4B483', position: 'relative',
              boxShadow: '0 4px 16px rgba(48,37,31,0.04)', display: 'flex', flexDirection: 'column',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ background: 'rgba(212,180,131,0.2)', color: '#30251F', fontSize: '0.72rem', fontWeight: 600, padding: '3px 8px', borderRadius: 4, textTransform: 'uppercase' }}>
                {off.category}
              </span>
              <Gift size={18} style={{ color: '#D4B483' }} />
            </div>

            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.3rem', color: '#30251F', margin: '0 0 0.5rem' }}>
              {off.title}
            </h3>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: '#72785A', margin: '0 0 1.25rem', lineHeight: 1.6, flex: 1 }}>
              {off.description}
            </p>

            <div style={{ background: '#F6F1E8', borderRadius: 8, padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <p style={{ margin: 0, fontSize: '0.65rem', textTransform: 'uppercase', color: '#72785A' }}>Coupon Code</p>
                <p style={{ margin: '2px 0 0', fontFamily: 'Inter, sans-serif', fontSize: '1.1rem', fontWeight: 700, color: '#B65E43', letterSpacing: '0.08em' }}>
                  {off.code}
                </p>
              </div>
              <button
                onClick={() => handleCopy(off.code)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.35rem', background: '#30251F',
                  color: '#F6F1E8', border: 'none', borderRadius: 6, padding: '0.5rem 0.85rem',
                  fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
                }}
              >
                {copiedCode === off.code ? <><Check size={13} /> Copied</> : <><Copy size={13} /> Copy</>}
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#A89C8C' }}>
              <span>Min. Order: {off.minOrder}</span>
              <span>Valid till: {off.validTill}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
        <Link
          to="/eyeglasses"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: '#B65E43', color: 'white', textDecoration: 'none',
            padding: '0.9rem 2rem', borderRadius: 6, fontFamily: 'Inter, sans-serif',
            fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase',
          }}
        >
          Explore Eyewear &amp; Redeem <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
