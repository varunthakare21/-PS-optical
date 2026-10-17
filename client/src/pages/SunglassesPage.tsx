import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { productsAPI } from '../services/api';
import { Product } from '../types';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function SunglassesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const selectedSort = searchParams.get('sort') || 'newest';

  useEffect(() => {
    setLoading(true);
    productsAPI.getProducts({ category: 'sunglasses', sort: selectedSort })
      .then((res) => {
        setProducts(res.data.data || []);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [selectedSort]);

  return (
    <div style={{ maxWidth: 1340, margin: '0 auto', padding: '2rem 1.5rem 5rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#B65E43', margin: '0 0 0.5rem' }}>
          Sunwear Studio
        </p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 700, color: '#30251F', margin: 0 }}>
          Designer Sunglasses &amp; Polarized Eyewear
        </h1>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', color: '#72785A', marginTop: '0.5rem' }}>
          UV400 high-definition sun protection meets fashion-forward silhouettes. Available with custom prescription sun lenses.
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E8E0D0', paddingBottom: '1.25rem', marginBottom: '2rem' }}>
        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: '#72785A' }}>
          Showing <strong>{products.length}</strong> styles
        </span>
        <select
          value={selectedSort}
          onChange={(e) => {
            const p = new URLSearchParams(searchParams);
            p.set('sort', e.target.value);
            setSearchParams(p);
          }}
          style={{ padding: '0.5rem 1rem', borderRadius: 6, border: '1px solid #D8CFC4', background: 'white', fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: '#30251F' }}
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="popular">Popular</option>
        </select>
      </div>

      {loading ? (
        <div style={{ padding: '6rem 0', display: 'flex', justifyContent: 'center' }}><LoadingSpinner size="md" /></div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 1rem', background: 'white', borderRadius: 12 }}>
          <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', color: '#30251F' }}>No sunglasses currently available</h3>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: '#72785A', marginTop: '0.5rem' }}>Explore our optical frames or check back shortly.</p>
          <Link to="/eyeglasses" style={{ display: 'inline-block', marginTop: '1rem', background: '#B65E43', color: 'white', textDecoration: 'none', padding: '0.75rem 1.5rem', borderRadius: 6, fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
            Shop Eyeglasses
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
          {products.map((p) => (
            <Link key={p._id} to={`/products/${p.slug}`} style={{ textDecoration: 'none' }}>
              <motion.div whileHover={{ y: -4, boxShadow: '0 12px 36px rgba(48,37,31,0.1)' }} style={{ background: 'white', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 10px rgba(48,37,31,0.05)' }}>
                <div style={{ background: '#F6F1E8', aspectRatio: '4/3', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', position: 'relative' }}>
                  {p.images?.[0] ? <img src={p.images[0]} alt={p.name} style={{ maxWidth: '100%', maxHeight: '130px', objectFit: 'contain' }} loading="lazy" /> : null}
                  <span style={{ position: 'absolute', top: 10, left: 10, background: '#30251F', color: '#D4B483', fontSize: '0.65rem', fontWeight: 700, padding: '2px 6px', borderRadius: 4, textTransform: 'uppercase' }}>
                    UV400
                  </span>
                </div>
                <div style={{ padding: '1rem 1.125rem 1.25rem' }}>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.7rem', color: '#72785A', textTransform: 'uppercase', margin: '0 0 0.25rem' }}>
                    {(p.brand as any)?.name || 'PS OPTICAL'}
                  </p>
                  <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.92rem', fontWeight: 600, color: '#30251F', margin: '0 0 0.5rem' }}>{p.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
          ))}
        </div>
      )}
    </div>
  );
}
