import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ArrowRight, Star, ChevronRight, MapPin, Calendar, Truck, RefreshCw, Shield, Headphones } from 'lucide-react';
import { productsAPI } from '../services/api';
import { Product } from '../types';

// ── Reusable fade-in-up animation ──
const FadeUp = ({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 32 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }} className={className}>
      {children}
    </motion.div>
  );
};

// ── Section heading ──
const SectionHeading = ({ label, title, sub }: { label?: string; title: string; sub?: string }) => (
  <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
    {label && <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#D4B483', margin: '0 0 0.75rem' }}>{label}</p>}
    <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 700, color: '#30251F', margin: '0 0 0.875rem', lineHeight: 1.2 }}>{title}</h2>
    {sub && <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', color: '#72785A', maxWidth: 560, margin: '0 auto', lineHeight: 1.65 }}>{sub}</p>}
  </div>
);

// ── Product card ──
const ProductCard = ({ p }: { p: Product }) => (
  <Link to={`/products/${p.slug}`} style={{ textDecoration: 'none' }}>
    <motion.div whileHover={{ y: -4, boxShadow: '0 12px 36px rgba(48,37,31,0.12)' }}
      transition={{ duration: 0.25 }}
      style={{ background: 'white', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 12px rgba(48,37,31,0.06)' }}>
      <div style={{ background: '#F6F1E8', aspectRatio: '4/3', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', position: 'relative' }}>
        {p.isNewArrival && (
          <span style={{ position: 'absolute', top: 10, left: 10, background: '#30251F', color: '#D4B483', fontFamily: 'Inter, sans-serif', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 4 }}>New</span>
        )}
        {p.isBestseller && (
          <span style={{ position: 'absolute', top: 10, left: 10, background: '#B65E43', color: 'white', fontFamily: 'Inter, sans-serif', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 4 }}>Bestseller</span>
        )}
        {p.images?.[0] ? (
          <img src={p.images[0]} alt={p.name} style={{ maxWidth: '100%', maxHeight: '140px', objectFit: 'contain' }} loading="lazy" />
        ) : (
          <div style={{ width: 120, height: 60, background: '#EDE5D4', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: '0.7rem', color: '#A89C8C' }}>No Image</span>
          </div>
        )}
      </div>
      <div style={{ padding: '1rem 1.125rem 1.25rem' }}>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', color: '#72785A', margin: '0 0 0.3rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {(p.brand as any)?.name || 'PS Optical'}
        </p>
        <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.92rem', fontWeight: 600, color: '#30251F', margin: '0 0 0.5rem', lineHeight: 1.3 }}>{p.name}</h3>
        {p.averageRating > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: '0.5rem' }}>
            {[1,2,3,4,5].map((s) => (
              <Star key={s} size={11} style={{ color: s <= Math.round(p.averageRating) ? '#D4B483' : '#EDE5D4' }} fill={s <= Math.round(p.averageRating) ? '#D4B483' : 'none'} />
            ))}
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', color: '#A89C8C' }}>({p.reviewCount})</span>
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 700, color: '#B65E43' }}>
            ₹{(p.salePrice || p.basePrice).toLocaleString()}
          </span>
          {p.salePrice && p.salePrice < p.basePrice && (
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', color: '#A89C8C', textDecoration: 'line-through' }}>
              ₹{p.basePrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  </Link>
);

// Frame shape data
const SHAPES = [
  { name: 'Round', emoji: '○', desc: 'Softens angular features' },
  { name: 'Rectangle', emoji: '▭', desc: 'Classic and professional' },
  { name: 'Cat-Eye', emoji: '◁', desc: 'Bold and expressive' },
  { name: 'Aviator', emoji: '◇', desc: 'Timeless and versatile' },
  { name: 'Wayfarer', emoji: '⬡', desc: 'Iconic everyday style' },
  { name: 'Oval', emoji: '⬭', desc: 'Subtly sophisticated' },
  { name: 'Square', emoji: '□', desc: 'Structured and modern' },
  { name: 'Geometric', emoji: '⬠', desc: 'Bold conversation piece' },
];

const FACE_SHAPES = [
  { name: 'Oval', rec: 'Almost any frame works' },
  { name: 'Round', rec: 'Rectangle or square frames' },
  { name: 'Square', rec: 'Round or oval frames' },
  { name: 'Heart', rec: 'Bottom-heavy frames' },
  { name: 'Diamond', rec: 'Oval or rimless frames' },
];

const REVIEWS = [
  { name: 'Priya M.', rating: 5, text: 'Absolutely stunning frames! The quality is exceptional and delivery was super fast. My prescription was perfect.', location: 'Mumbai' },
  { name: 'Arjun K.', rating: 5, text: 'Virtual try-on is incredibly accurate. Found my perfect pair without visiting the store. 10/10 experience!', location: 'Bengaluru' },
  { name: 'Sneha R.', rating: 5, text: 'The lens quality is superb and the blue-light coating is noticeably effective. My eyes feel less strained all day.', location: 'Delhi' },
  { name: 'Rahul P.', rating: 5, text: 'Great customer service and very responsive support team. The frames arrived beautifully packaged.', location: 'Hyderabad' },
];

const FAQS = [
  { q: 'How do I enter my prescription online?', a: 'During checkout you can enter your prescription details manually, upload a photo of your prescription, or save it to your account for future orders.' },
  { q: 'Can I try frames before buying?', a: 'Yes! Use our Virtual Try-On feature or book a Try-at-Home session where we send up to 5 frames to your doorstep for 48 hours.' },
  { q: 'What is the return policy?', a: 'We offer a 7-day hassle-free return policy on all non-prescription frames. Prescription lenses are non-refundable but we will remake them if there is an error.' },
  { q: 'How long does delivery take?', a: 'Standard prescription eyewear takes 5–7 business days. Non-prescription frames and sunglasses ship within 2–3 business days.' },
  { q: 'Do you accept all prescriptions?', a: 'We support single vision, bifocal, and progressive prescriptions. Our team reviews every prescription before manufacturing begins.' },
];

export default function HomePage() {
  const [bestsellers, setBestsellers] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    productsAPI.getBestsellers().then((r) => setBestsellers(r.data.data || [])).catch(() => {});
    productsAPI.getNewArrivals().then((r) => setNewArrivals(r.data.data || [])).catch(() => {});
  }, []);

  const categories = [
    { label: 'Eyeglasses & Frames', href: '/eyeglasses', img: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&q=80&auto=format', color: '#F0EAE0' },
    { label: 'Sunglasses & Shades', href: '/sunglasses', img: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80&auto=format', color: '#EDE0D0' },
    { label: 'Computer Glasses', href: '/eyeglasses?type=computer', img: '/images/frames/screen-bluecut.jpg', color: '#E8E8E0' },
    { label: 'Titanium & Rimless', href: '/eyeglasses?material=titanium', img: '/images/frames/rimless-titanium.jpg', color: '#EAE0E8' },
    { label: 'Bold Statement Shades', href: '/sunglasses', img: '/images/frames/bold-black-square.jpg', color: '#E0EAE8' },
    { label: "Kids' Eyewear", href: '/eyeglasses?gender=kids', img: '/images/frames/crystal-clear.jpg', color: '#E8E4D8' },
  ];

  return (
    <div>
      {/* ── HERO ── */}
      <section ref={heroRef} style={{ position: 'relative', minHeight: '88vh', display: 'flex', alignItems: 'center', overflow: 'hidden', background: '#30251F' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <img
            src="https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=1600&q=85&auto=format"
            alt="PS Optical premium eyewear campaign"
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.45 }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, rgba(48,37,31,0.92) 0%, rgba(48,37,31,0.6) 60%, rgba(48,37,31,0.2) 100%)' }} />
        </div>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 1280, margin: '0 auto', padding: '5rem 1.5rem 4rem', width: '100%' }}>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
            style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#D4B483', marginBottom: '1.25rem' }}>
            Premium Optical Collections
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.5rem, 7vw, 5rem)', fontWeight: 700, color: '#F6F1E8', lineHeight: 1.1, margin: '0 0 1.5rem', maxWidth: 680 }}>
            See Clearly.<br />
            <span style={{ color: '#D4B483' }}>Look Unforgettable.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5 }}
            style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', color: 'rgba(246,241,232,0.78)', maxWidth: 520, lineHeight: 1.7, marginBottom: '2.5rem' }}>
            Discover eyewear that brings together your vision, your personality, and your everyday style.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.65 }}
            style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            <Link to="/eyeglasses"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#B65E43', color: 'white', padding: '0.875rem 2rem', borderRadius: 6, fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', textDecoration: 'none', transition: 'background 0.2s, transform 0.2s' }}
              onMouseEnter={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = '#9E4E36'; el.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = '#B65E43'; el.style.transform = 'none'; }}>
              Shop Eyeglasses <ArrowRight size={16} />
            </Link>
            <Link to="/sunglasses"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', color: '#F6F1E8', padding: '0.875rem 2rem', borderRadius: 6, fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', textDecoration: 'none', border: '1.5px solid rgba(246,241,232,0.4)', transition: 'border-color 0.2s, background 0.2s' }}
              onMouseEnter={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = '#D4B483'; el.style.background = 'rgba(212,180,131,0.1)'; }}
              onMouseLeave={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = 'rgba(246,241,232,0.4)'; el.style.background = 'transparent'; }}>
              Explore Sunglasses
            </Link>
            <Link to="/virtual-try-on"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(212,180,131,0.15)', color: '#D4B483', padding: '0.875rem 2rem', borderRadius: 6, fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', textDecoration: 'none', border: '1.5px solid rgba(212,180,131,0.3)', transition: 'background 0.2s' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(212,180,131,0.25)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(212,180,131,0.15)'; }}>
              Try Frames Virtually
            </Link>
          </motion.div>
          {/* Trust indicators */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85, duration: 0.6 }}
            style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', marginTop: '3.5rem' }}>
            {[
              { val: '50,000+', lab: 'Happy Customers' },
              { val: '500+', lab: 'Frame Styles' },
              { val: '15+', lab: 'Store Locations' },
              { val: '4.8★', lab: 'Average Rating' },
            ].map(({ val, lab }) => (
              <div key={lab}>
                <p style={{ margin: 0, fontFamily: 'Georgia, serif', fontSize: '1.5rem', fontWeight: 700, color: '#D4B483' }}>{val}</p>
                <p style={{ margin: '2px 0 0', fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: 'rgba(246,241,232,0.6)', letterSpacing: '0.04em' }}>{lab}</p>
              </div>
            ))}
          </motion.div>
        </div>
        {/* Scroll hint */}
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}
          style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.375rem' }}>
          <div style={{ width: 1, height: 36, background: 'rgba(212,180,131,0.4)' }} />
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.65rem', color: 'rgba(212,180,131,0.6)', letterSpacing: '0.12em', textTransform: 'uppercase', margin: 0 }}>Scroll</p>
        </motion.div>
      </section>

      {/* ── TRUST BAR ── */}
      <section style={{ background: '#30251F', padding: '1.5rem 1.5rem' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2.5rem' }}>
          {[
            { icon: Truck, text: 'Free shipping above ₹1,999' },
            { icon: RefreshCw, text: '7-day easy returns' },
            { icon: Shield, text: '1-year frame warranty' },
            { icon: Headphones, text: '24/7 customer support' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <Icon size={16} style={{ color: '#D4B483', flexShrink: 0 }} />
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: '#EDE5D4' }}>{text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── SHOP BY CATEGORY ── */}
      <section style={{ padding: '5rem 1.5rem', background: '#F6F1E8' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <FadeUp>
            <SectionHeading label="Explore" title="Shop by Category" sub="Find the perfect pair for every occasion and style." />
          </FadeUp>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1.25rem' }}>
            {categories.map((c, i) => (
              <FadeUp key={c.label} delay={i * 0.07}>
                <Link to={c.href} style={{ textDecoration: 'none', display: 'block' }}>
                  <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.22 }}
                    style={{ background: c.color, borderRadius: 14, overflow: 'hidden', aspectRatio: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', padding: '1.25rem', position: 'relative', boxShadow: '0 2px 12px rgba(48,37,31,0.06)', cursor: 'pointer' }}>
                    <img src={c.img} alt={c.label} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6, transition: 'opacity 0.3s' }} loading="lazy" />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(48,37,31,0.75) 0%, transparent 50%)' }} />
                    <p style={{ position: 'relative', fontFamily: 'Georgia, serif', fontSize: '1rem', fontWeight: 700, color: 'white', margin: 0, textAlign: 'center' }}>{c.label}</p>
                    <p style={{ position: 'relative', fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)', margin: '4px 0 0', display: 'flex', alignItems: 'center', gap: 3 }}>
                      Shop now <ChevronRight size={12} />
                    </p>
                  </motion.div>
                </Link>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── BESTSELLERS ── */}
      {bestsellers.length > 0 && (
        <section style={{ padding: '5rem 1.5rem', background: 'white' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <FadeUp>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#D4B483', margin: '0 0 0.5rem' }}>Most Loved</p>
                  <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', fontWeight: 700, color: '#30251F', margin: 0 }}>Bestselling Frames</h2>
                </div>
                <Link to="/eyeglasses?bestseller=true" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: '#B65E43', textDecoration: 'none' }}>
                  View All <ArrowRight size={15} />
                </Link>
              </div>
            </FadeUp>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
              {bestsellers.map((p, i) => (
                <FadeUp key={p._id} delay={i * 0.06}><ProductCard p={p} /></FadeUp>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FRAME SHAPES ── */}
      <section style={{ padding: '5rem 1.5rem', background: '#F6F1E8' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <FadeUp>
            <SectionHeading label="Collections" title="Shop by Frame Shape" sub="Every face is unique. Find the shape that complements yours." />
          </FadeUp>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem' }}>
            {SHAPES.map((s, i) => (
              <FadeUp key={s.name} delay={i * 0.04}>
                <Link to={`/eyeglasses?frameShape=${s.name.toLowerCase()}`} style={{ textDecoration: 'none', display: 'block' }}>
                  <motion.div whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(48,37,31,0.1)' }}
                    style={{ background: 'white', borderRadius: 12, padding: '1.5rem 1rem', textAlign: 'center', boxShadow: '0 2px 8px rgba(48,37,31,0.05)', transition: 'box-shadow 0.25s' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.625rem' }}>{s.emoji}</div>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: '#30251F', margin: '0 0 4px' }}>{s.name}</p>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', color: '#A89C8C', margin: 0 }}>{s.desc}</p>
                  </motion.div>
                </Link>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── FACE SHAPE GUIDE ── */}
      <section style={{ padding: '5rem 1.5rem', background: 'white' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <FadeUp>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#D4B483', margin: '0 0 0.875rem' }}>Frame Finder</p>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 700, color: '#30251F', margin: '0 0 1rem', lineHeight: 1.2 }}>
              Find Frames for Your Face Shape
            </h2>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', color: '#72785A', lineHeight: 1.7, margin: '0 0 2rem' }}>
              The right frame complements your natural features and enhances your best qualities. Use our face shape guide or the interactive Frame Finder tool.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {FACE_SHAPES.map((f) => (
                <Link key={f.name} to={`/frame-finder?face=${f.name.toLowerCase()}`}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1.125rem', background: '#F6F1E8', borderRadius: 10, textDecoration: 'none', transition: 'background 0.2s' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = '#EDE5D4'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = '#F6F1E8'; }}>
                  <div>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', fontWeight: 600, color: '#30251F', margin: 0 }}>{f.name} Face</p>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: '#72785A', margin: 0 }}>{f.rec}</p>
                  </div>
                  <ChevronRight size={16} style={{ color: '#B65E43', flexShrink: 0 }} />
                </Link>
              ))}
            </div>
            <div style={{ marginTop: '2rem' }}>
              <Link to="/frame-finder"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#B65E43', color: 'white', padding: '0.875rem 1.75rem', borderRadius: 6, fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', textDecoration: 'none' }}>
                Try Frame Finder <ArrowRight size={16} />
              </Link>
            </div>
          </FadeUp>
          <FadeUp delay={0.15}>
            <div style={{ aspectRatio: '4/5', borderRadius: 20, overflow: 'hidden', boxShadow: '0 20px 60px rgba(48,37,31,0.14)' }}>
              <img src="https://images.unsplash.com/photo-1483181957632-8bda974cbc91?w=700&q=80&auto=format" alt="Woman wearing eyeglasses" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── NEW ARRIVALS ── */}
      {newArrivals.length > 0 && (
        <section style={{ padding: '5rem 1.5rem', background: '#F6F1E8' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <FadeUp>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#D4B483', margin: '0 0 0.5rem' }}>Just Landed</p>
                  <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', fontWeight: 700, color: '#30251F', margin: 0 }}>New Arrivals</h2>
                </div>
                <Link to="/eyeglasses?new=true" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: '#B65E43', textDecoration: 'none' }}>
                  View All <ArrowRight size={15} />
                </Link>
              </div>
            </FadeUp>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
              {newArrivals.map((p, i) => (
                <FadeUp key={p._id} delay={i * 0.06}><ProductCard p={p} /></FadeUp>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── VIRTUAL TRY-ON PROMO ── */}
      <section style={{ padding: '5rem 1.5rem', background: '#30251F' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <FadeUp>
            <div style={{ aspectRatio: '1', borderRadius: 20, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
              <img src="https://images.unsplash.com/photo-1581803118522-7b72a50f7e9f?w=700&q=80&auto=format" alt="Virtual try-on feature" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
            </div>
          </FadeUp>
          <FadeUp delay={0.15}>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#D4B483', margin: '0 0 1rem' }}>Innovation</p>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: '#F6F1E8', lineHeight: 1.15, margin: '0 0 1.25rem' }}>
              Try Any Frame<br />Without Leaving Home
            </h2>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.05rem', color: 'rgba(246,241,232,0.72)', lineHeight: 1.7, margin: '0 0 2.5rem' }}>
              Our Virtual Try-On uses your camera to overlay frames on your face in real time. Upload a photo or use live preview to find frames that truly fit your face and style.
            </p>
            <ul style={{ listStyle: 'none', margin: '0 0 2.5rem', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {['Live camera or photo upload', 'Hundreds of frame designs', 'Switch colours instantly', 'Compare multiple frames', 'Privacy-safe — no photos saved'].map((item) => (
                <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: 'rgba(246,241,232,0.8)' }}>
                  <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(212,180,131,0.15)', border: '1px solid rgba(212,180,131,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D4B483', fontSize: '0.7rem', flexShrink: 0 }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/virtual-try-on"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#D4B483', color: '#30251F', padding: '0.875rem 2rem', borderRadius: 6, fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', textDecoration: 'none', transition: 'background 0.2s' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = '#C4A470'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = '#D4B483'; }}>
              Launch Virtual Try-On <ArrowRight size={16} />
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* ── SERVICES STRIP ── */}
      <section style={{ padding: '5rem 1.5rem', background: 'white' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <FadeUp><SectionHeading label="Our Services" title="Everything You Need for Perfect Vision" /></FadeUp>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            {[
              { icon: '👁️', title: 'Book Eye Test', desc: 'Professional eye examination at any of our stores.', href: '/appointment' },
              { icon: '📦', title: 'Try at Home', desc: 'Get 5 frames delivered and try them for 48 hours.', href: '/try-at-home' },
              { icon: '🔬', title: 'Lens Customization', desc: 'Choose from 6 lens types with premium coatings.', href: '/eyeglasses' },
              { icon: '📍', title: 'Find a Store', desc: 'Locate your nearest PS OPTICAL store.', href: '/store-locator' },
            ].map((s, i) => (
              <FadeUp key={s.title} delay={i * 0.07}>
                <Link to={s.href} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
                  <motion.div whileHover={{ y: -4 }}
                    style={{ background: '#F6F1E8', borderRadius: 14, padding: '2rem 1.5rem', height: '100%', boxSizing: 'border-box', boxShadow: '0 2px 8px rgba(48,37,31,0.04)' }}>
                    <div style={{ fontSize: '2.25rem', marginBottom: '1rem' }}>{s.icon}</div>
                    <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', fontWeight: 700, color: '#30251F', margin: '0 0 0.625rem' }}>{s.title}</h3>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: '#72785A', margin: '0 0 1.25rem', lineHeight: 1.65 }}>{s.desc}</p>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', fontWeight: 600, color: '#B65E43', display: 'flex', alignItems: 'center', gap: 4 }}>
                      Learn more <ArrowRight size={13} />
                    </span>
                  </motion.div>
                </Link>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── STORE LOCATOR CTA ── */}
      <section style={{ padding: '5rem 1.5rem', background: '#F6F1E8' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <FadeUp>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, borderRadius: '50%', background: 'rgba(182,94,67,0.1)', marginBottom: '1.5rem' }}>
              <MapPin size={28} style={{ color: '#B65E43' }} />
            </div>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 700, color: '#30251F', margin: '0 0 1rem' }}>
              Visit PS OPTICAL Boutique — Bhandara
            </h2>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.05rem', color: '#72785A', lineHeight: 1.7, margin: '0 0 2rem', maxWidth: 620, marginLeft: 'auto', marginRight: 'auto' }}>
              Experience handcrafted eyewear at our flagship boutique located <strong>Near Post Office, Bhandara - 441904</strong>. Need it delivered? We provide express insured delivery <strong>all over Maharashtra</strong>!
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
              <Link to="/store-locator"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#30251F', color: '#F6F1E8', padding: '0.875rem 1.75rem', borderRadius: 6, fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', textDecoration: 'none' }}>
                <MapPin size={16} /> View Boutique (Bhandara)
              </Link>
              <Link to="/appointment"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#B65E43', color: 'white', padding: '0.875rem 1.75rem', borderRadius: 6, fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', textDecoration: 'none' }}>
                <Calendar size={16} /> Book Eye Test at Bhandara
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <section style={{ padding: '5rem 1.5rem', background: 'white' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <FadeUp><SectionHeading label="Testimonials" title="What Our Customers Say" sub="Real reviews from real PS OPTICAL customers." /></FadeUp>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
            {REVIEWS.map((r, i) => (
              <FadeUp key={r.name} delay={i * 0.07}>
                <div style={{ background: '#F6F1E8', borderRadius: 14, padding: '1.75rem', height: '100%', boxSizing: 'border-box' }}>
                  <div style={{ display: 'flex', gap: '2px', marginBottom: '1rem' }}>
                    {[1,2,3,4,5].map((s) => (
                      <Star key={s} size={14} style={{ color: '#D4B483' }} fill="#D4B483" />
                    ))}
                  </div>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: '#30251F', lineHeight: 1.7, margin: '0 0 1.25rem', fontStyle: 'italic' }}>"{r.text}"</p>
                  <div>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: '#30251F', margin: 0 }}>{r.name}</p>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#72785A', margin: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <MapPin size={11} /> {r.location}
                    </p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: '5rem 1.5rem', background: '#F6F1E8' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <FadeUp><SectionHeading label="FAQ" title="Frequently Asked Questions" /></FadeUp>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {FAQS.map((f, i) => (
              <FadeUp key={f.q} delay={i * 0.05}>
                <div style={{ background: 'white', borderRadius: 10, overflow: 'hidden', boxShadow: '0 1px 6px rgba(48,37,31,0.04)' }}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.125rem 1.375rem', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: '1rem' }}>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', fontWeight: 600, color: '#30251F' }}>{f.q}</span>
                    <motion.span animate={{ rotate: openFaq === i ? 90 : 0 }} style={{ color: '#B65E43', flexShrink: 0 }}>
                      <ChevronRight size={18} />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {openFaq === i && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
                        style={{ overflow: 'hidden' }}>
                        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: '#72785A', lineHeight: 1.7, margin: 0, padding: '0 1.375rem 1.125rem' }}>{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── BRAND STORY ── */}
      <section style={{ padding: '5rem 1.5rem', background: '#30251F' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
          <FadeUp>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#D4B483', margin: '0 0 1rem' }}>Our Story</p>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 700, color: '#F6F1E8', margin: '0 0 1.5rem', lineHeight: 1.2 }}>
              Born from a Passion for Perfect Vision
            </h2>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.05rem', color: 'rgba(246,241,232,0.72)', lineHeight: 1.8, margin: '0 0 1.5rem' }}>
              PS OPTICAL was founded with a simple belief: that eyewear should be both a medical necessity and a personal expression. We combine expert optometry with fashion-forward design to bring you frames that work as hard as they look.
            </p>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.05rem', color: 'rgba(246,241,232,0.72)', lineHeight: 1.8, margin: '0 0 2.5rem' }}>
              From our first store to our growing network across India, our commitment remains the same — clarity, quality, and care for every customer.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.875rem' }}>
              <div style={{ height: 1, width: 48, background: 'rgba(212,180,131,0.4)' }} />
              <span style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '1.25rem', color: '#D4B483' }}>PS OPTICAL</span>
              <div style={{ height: 1, width: 48, background: 'rgba(212,180,131,0.4)' }} />
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
