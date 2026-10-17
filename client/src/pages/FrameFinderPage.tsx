import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Check } from 'lucide-react';

const FACE_SHAPES_DATA = [
  {
    id: 'oval',
    title: 'Oval Face',
    description: 'Proportions are naturally balanced with slightly rounded jaw and forehead.',
    recommended: ['Rectangle', 'Geometric', 'Aviator', 'Cat-Eye'],
    avoid: 'Oversized frames that overwhelm subtle features',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&q=80',
  },
  {
    id: 'round',
    title: 'Round Face',
    description: 'Soft curves with similar width and length, fuller cheeks, and a rounded chin.',
    recommended: ['Rectangle', 'Square', 'Wayfarer', 'Geometric'],
    avoid: 'Small round frames that exaggerate roundness',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&q=80',
  },
  {
    id: 'square',
    title: 'Square Face',
    description: 'Strong, defined jawline with balanced forehead width and angular cheeks.',
    recommended: ['Round', 'Oval', 'Cat-Eye', 'Rimless'],
    avoid: 'Thick, sharp rectangular frames',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&q=80',
  },
  {
    id: 'heart',
    title: 'Heart Face',
    description: 'Broad forehead tapering down to a pointed, delicate chin and high cheekbones.',
    recommended: ['Aviator', 'Oval', 'Round', 'Light Cat-Eye'],
    avoid: 'Top-heavy designs with ornate browlines',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&q=80',
  },
  {
    id: 'diamond',
    title: 'Diamond Face',
    description: 'Narrow forehead and jawline with striking, wide cheekbones.',
    recommended: ['Cat-Eye', 'Oval', 'Rimless', 'Browline'],
    avoid: 'Narrow frames that make cheekbones look disproportionate',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80',
  },
];

export default function FrameFinderPage() {
  const [selectedShape, setSelectedShape] = useState(FACE_SHAPES_DATA[0]);

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '2rem 1.5rem 5rem' }}>
      <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#B65E43', margin: '0 0 0.5rem' }}>
          Personalized Styling
        </p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 700, color: '#30251F', margin: 0 }}>
          Frame Finder &amp; Face Shape Guide
        </h1>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', color: '#72785A', marginTop: '0.5rem', maxWidth: 640, margin: '0.5rem auto 0' }}>
          Discover which frame geometries harmonise best with your facial architecture. Note: recommendations are aesthetic style guidelines rather than clinical measurements.
        </p>
      </div>

      {/* Face Shape Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
        {FACE_SHAPES_DATA.map((fs) => {
          const active = selectedShape.id === fs.id;
          return (
            <button
              key={fs.id}
              onClick={() => setSelectedShape(fs)}
              style={{
                padding: '0.65rem 1.25rem', borderRadius: 30,
                border: active ? '2px solid #B65E43' : '1px solid #D8CFC4',
                background: active ? '#B65E43' : 'white',
                color: active ? 'white' : '#30251F',
                fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              {fs.title}
            </button>
          );
        })}
      </div>

      {/* Detailed Guide for Selected Shape */}
      <div style={{ background: 'white', borderRadius: 16, overflow: 'hidden', border: '1px solid #F0EAE0', display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 0, boxShadow: '0 8px 32px rgba(48,37,31,0.06)' }} className="grid-cols-1! md:grid-cols-2!">
        <div style={{ height: '100%', minHeight: 340 }}>
          <img src={selectedShape.image} alt={selectedShape.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>

        <div style={{ padding: '2.5rem' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.75rem', color: '#30251F', margin: '0 0 0.75rem' }}>
            {selectedShape.title}
          </h2>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', color: '#72785A', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            {selectedShape.description}
          </p>

          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', textTransform: 'uppercase', color: '#B65E43', margin: '0 0 0.75rem' }}>
              ✓ Recommended Frame Shapes:
            </h4>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {selectedShape.recommended.map((rec) => (
                <Link
                  key={rec}
                  to={`/eyeglasses?frameShape=${rec.toLowerCase()}`}
                  style={{
                    background: '#FDF8F3', border: '1px solid #F0DCCE', color: '#B65E43',
                    padding: '0.4rem 0.85rem', borderRadius: 6, fontSize: '0.82rem',
                    textDecoration: 'none', fontWeight: 600,
                  }}
                >
                  {rec} Frames →
                </Link>
              ))}
            </div>
          </div>

          <div style={{ padding: '1rem', background: '#F6F1E8', borderRadius: 8, marginBottom: '2rem' }}>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#4A3A33' }}>
              <strong>Style Tip:</strong> {selectedShape.avoid}.
            </p>
          </div>

          <Link
            to={`/eyeglasses?frameShape=${selectedShape.recommended[0].toLowerCase()}`}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: '#30251F', color: '#F6F1E8', textDecoration: 'none',
              padding: '0.85rem 1.75rem', borderRadius: 6, fontFamily: 'Inter, sans-serif',
              fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase',
            }}
          >
            Shop Recommended Frames <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
