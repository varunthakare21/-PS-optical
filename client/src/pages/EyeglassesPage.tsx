import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, ChevronDown, Star, Search, SlidersHorizontal } from 'lucide-react';
import { productsAPI } from '../services/api';
import { Product } from '../types';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const SHAPES = ['round', 'rectangle', 'cat-eye', 'aviator', 'wayfarer', 'square', 'oval', 'geometric'];
const GENDERS = ['men', 'women', 'unisex', 'kids'];
const SIZES = ['narrow', 'medium', 'wide', 'extra-wide'];
const MATERIALS = ['Acetate', 'Titanium', 'Stainless Steel', 'TR90 Memory Plastic'];

export default function EyeglassesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filters state
  const selectedShape = searchParams.get('frameShape') || '';
  const selectedGender = searchParams.get('gender') || '';
  const selectedSize = searchParams.get('frameSize') || '';
  const selectedMaterial = searchParams.get('frameMaterial') || '';
  const selectedSort = searchParams.get('sort') || 'newest';
  const query = searchParams.get('q') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  const updateParam = (key: string, val: string) => {
    const params = new URLSearchParams(searchParams);
    if (val) params.set(key, val);
    else params.delete(key);
    params.set('page', '1');
    setSearchParams(params);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  useEffect(() => {
    setLoading(true);
    const params: any = {
      category: 'eyeglasses',
      frameShape: selectedShape || undefined,
      gender: selectedGender || undefined,
      frameSize: selectedSize || undefined,
      frameMaterial: selectedMaterial || undefined,
      sort: selectedSort,
      q: query || undefined,
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
    };
    productsAPI.getProducts(params)
      .then((res) => {
        setProducts(res.data.data || []);
      })
      .catch(() => {
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, [searchParams]);

  const activeFilterCount = [selectedShape, selectedGender, selectedSize, selectedMaterial, minPrice, maxPrice].filter(Boolean).length;

  return (
    <div style={{ maxWidth: 1340, margin: '0 auto', padding: '2rem 1.5rem 5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#B65E43', margin: '0 0 0.5rem' }}>
          Catalog &amp; Collections
        </p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 700, color: '#30251F', margin: 0 }}>
          Eyeglasses &amp; Optical Frames
        </h1>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', color: '#72785A', marginTop: '0.5rem' }}>
          Precision prescription eyewear, designed with refined proportions and premium Italian acetates.
        </p>
      </div>

      {/* Bar: Active chips + Sort + Mobile filter trigger */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', paddingBottom: '1.25rem', borderBottom: '1px solid #E8E0D0', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden!"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#30251F', color: '#F6F1E8', border: 'none', borderRadius: 6, padding: '0.5rem 1rem', fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', cursor: 'pointer' }}
          >
            <SlidersHorizontal size={15} /> Filters ({activeFilterCount})
          </button>

          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: '#72785A' }}>
            Showing <strong>{products.length}</strong> frame styles
          </span>

          {activeFilterCount > 0 && (
            <button
              onClick={clearAllFilters}
              style={{ background: 'none', border: 'none', color: '#B65E43', fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Sort dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: '#72785A' }}>Sort by:</label>
          <select
            value={selectedSort}
            onChange={(e) => updateParam('sort', e.target.value)}
            style={{
              padding: '0.5rem 1rem', borderRadius: 6, border: '1px solid #D8CFC4',
              background: 'white', fontFamily: 'Inter, sans-serif', fontSize: '0.85rem',
              color: '#30251F', outline: 'none', cursor: 'pointer',
            }}
          >
            <option value="newest">Newest Arrivals</option>
            <option value="popular">Most Popular</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '2.5rem' }}>
        {/* Desktop Sidebar Filters */}
        <aside className="hidden! lg:block!" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Frame Shape */}
          <div>
            <h4 style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', fontWeight: 700, color: '#30251F', marginBottom: '0.75rem' }}>
              Frame Shape
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {SHAPES.map((shape) => {
                const checked = selectedShape === shape;
                return (
                  <button
                    key={shape}
                    onClick={() => updateParam('frameShape', checked ? '' : shape)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '0.45rem 0.6rem', borderRadius: 6,
                      background: checked ? '#F0EAE0' : 'transparent',
                      border: 'none', cursor: 'pointer', textAlign: 'left',
                      fontFamily: 'Inter, sans-serif', fontSize: '0.85rem',
                      color: checked ? '#B65E43' : '#4A3A33', fontWeight: checked ? 600 : 400,
                      textTransform: 'capitalize',
                    }}
                  >
                    <span>{shape}</span>
                    {checked && <X size={13} style={{ color: '#B65E43' }} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Gender */}
          <div>
            <h4 style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', fontWeight: 700, color: '#30251F', marginBottom: '0.75rem' }}>
              Gender
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {GENDERS.map((g) => {
                const checked = selectedGender === g;
                return (
                  <button
                    key={g}
                    onClick={() => updateParam('gender', checked ? '' : g)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '0.45rem 0.6rem', borderRadius: 6,
                      background: checked ? '#F0EAE0' : 'transparent',
                      border: 'none', cursor: 'pointer', textAlign: 'left',
                      fontFamily: 'Inter, sans-serif', fontSize: '0.85rem',
                      color: checked ? '#B65E43' : '#4A3A33', fontWeight: checked ? 600 : 400,
                      textTransform: 'capitalize',
                    }}
                  >
                    <span>{g}</span>
                    {checked && <X size={13} style={{ color: '#B65E43' }} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Material */}
          <div>
            <h4 style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', fontWeight: 700, color: '#30251F', marginBottom: '0.75rem' }}>
              Frame Material
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {MATERIALS.map((mat) => {
                const checked = selectedMaterial === mat;
                return (
                  <button
                    key={mat}
                    onClick={() => updateParam('frameMaterial', checked ? '' : mat)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '0.45rem 0.6rem', borderRadius: 6,
                      background: checked ? '#F0EAE0' : 'transparent',
                      border: 'none', cursor: 'pointer', textAlign: 'left',
                      fontFamily: 'Inter, sans-serif', fontSize: '0.85rem',
                      color: checked ? '#B65E43' : '#4A3A33', fontWeight: checked ? 600 : 400,
                    }}
                  >
                    <span>{mat}</span>
                    {checked && <X size={13} style={{ color: '#B65E43' }} />}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main>
          {loading ? (
            <div style={{ padding: '6rem 0', display: 'flex', justifyContent: 'center' }}>
              <LoadingSpinner size="md" />
            </div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem 1rem', background: 'white', borderRadius: 12 }}>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', color: '#30251F' }}>No frames found</h3>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: '#72785A', marginTop: '0.5rem' }}>
                Try adjusting your filters or search keywords.
              </p>
              <button
                onClick={clearAllFilters}
                style={{ marginTop: '1rem', background: '#B65E43', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: 6, fontFamily: 'Inter, sans-serif', fontWeight: 600, cursor: 'pointer' }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '1.5rem' }}>
              {products.map((p) => (
                <Link key={p._id} to={`/products/${p.slug}`} style={{ textDecoration: 'none' }}>
                  <motion.div
                    whileHover={{ y: -4, boxShadow: '0 12px 36px rgba(48,37,31,0.1)' }}
                    style={{ background: 'white', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 10px rgba(48,37,31,0.05)', transition: 'box-shadow 0.25s' }}
                  >
                    <div style={{ background: '#F6F1E8', aspectRatio: '4/3', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', position: 'relative' }}>
                      {p.images?.[0] ? (
                        <img src={p.images[0]} alt={p.name} style={{ maxWidth: '100%', maxHeight: '130px', objectFit: 'contain' }} loading="lazy" />
                      ) : (
                        <span style={{ color: '#A89C8C', fontSize: '0.8rem' }}>Frame Preview</span>
                      )}
                      {p.salePrice && p.salePrice < p.basePrice && (
                        <span style={{ position: 'absolute', top: 10, left: 10, background: '#B65E43', color: 'white', fontSize: '0.65rem', fontWeight: 700, padding: '2px 6px', borderRadius: 4, textTransform: 'uppercase' }}>
                          Save ₹{p.basePrice - p.salePrice}
                        </span>
                      )}
                    </div>
                    <div style={{ padding: '1rem 1.125rem 1.25rem' }}>
                      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.7rem', color: '#72785A', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 0.25rem' }}>
                        {(p.brand as any)?.name || 'PS OPTICAL'}
                      </p>
                      <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.92rem', fontWeight: 600, color: '#30251F', margin: '0 0 0.5rem', lineHeight: 1.3 }}>
                        {p.name}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 700, color: '#B65E43' }}>
                          ₹{(p.salePrice || p.basePrice).toLocaleString()}
                        </span>
                        {p.salePrice && p.salePrice < p.basePrice && (
                          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', color: '#A89C8C', textDecoration: 'line-through' }}>
                            ₹{p.basePrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', color: '#72785A', margin: 0 }}>
                        Size: {p.frameSize} · {p.frameShape}
                      </p>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
