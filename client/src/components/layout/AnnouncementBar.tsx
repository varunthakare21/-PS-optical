import { useState } from 'react';
import { X, Truck, Percent, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const items = [
  { icon: Truck, text: 'Free delivery all over Maharashtra on orders above ₹1,999 · Direct dispatch from Bhandara' },
  { icon: Percent, text: 'New customer offer: 15% off your first luxury frame with code WELCOME15' },
  { icon: Phone, text: 'Flagship Boutique: Near Post Office, Bhandara (441904) · Free Eye Exams' },
];

export default function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);
  const [idx, setIdx] = useState(0);
  const { icon: Icon, text } = items[idx];

  if (dismissed) return null;

  return (
    <AnimatePresence initial={false}>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        style={{ background: '#30251F', color: '#EDE5D4', position: 'relative', zIndex: 50, overflow: 'hidden' }}
      >
        <div style={{ maxWidth: 1340, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.625rem', padding: '0.44rem 3rem', position: 'relative' }}>
          <Icon size={12} style={{ flexShrink: 0, color: '#D4B483' }} />
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', letterSpacing: '0.025em', margin: 0, textAlign: 'center', color: '#EDE5D4', lineHeight: 1.5 }}>
            {text}
          </p>
          <div style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            {items.map((_, i) => (
              <button key={i} onClick={() => setIdx(i)}
                style={{ width: 5, height: 5, borderRadius: '50%', border: 'none', cursor: 'pointer', padding: 0, background: i === idx ? '#D4B483' : 'rgba(212,180,131,0.35)', transition: 'background 0.2s' }}
                aria-label={`Show announcement ${i + 1}`}
              />
            ))}
            <button onClick={() => setDismissed(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#72685A', padding: '0 0 0 4px', lineHeight: 1, display: 'flex' }}
              aria-label="Dismiss">
              <X size={12} />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
