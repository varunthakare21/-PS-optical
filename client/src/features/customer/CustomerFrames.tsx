import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Eye, Sparkles, Heart, SlidersHorizontal, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { productsAPI, wishlistAPI } from '../../services/api';
import { Product } from '../../types';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useToast } from '../../components/ui/Toaster';

export default function CustomerFrames() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'eyeglasses' | 'sunglasses' | 'rimless' | 'titanium'>('all');
  const [selectedGender, setSelectedGender] = useState<'all' | 'men' | 'women' | 'unisex'>('all');
  const [wishlistedIds, setWishlistedIds] = useState<Record<string, boolean>>({});
  const { showToast } = useToast();

  useEffect(() => {
    fetchFrames();
    // Load existing wishlist IDs
    wishlistAPI.getWishlist().then((res) => {
      const items: Product[] = res.data.data?.products || [];
      const map: Record<string, boolean> = {};
      items.forEach((p) => { map[p._id] = true; });
      setWishlistedIds(map);
    }).catch(() => {});
  }, []);

  const fetchFrames = async () => {
    try {
      setLoading(true);
      const res = await productsAPI.getProducts({ limit: 40 });
      setProducts(res.data.data || []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleWishlist = async (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const isSaved = !!wishlistedIds[product._id];
    try {
      if (isSaved) {
        await wishlistAPI.remove(product._id);
        setWishlistedIds((prev) => ({ ...prev, [product._id]: false }));
        showToast(`Removed "${product.name}" from your wishlist.`, 'info');
      } else {
        await wishlistAPI.add(product._id);
        setWishlistedIds((prev) => ({ ...prev, [product._id]: true }));
        showToast(`Added "${product.name}" to your saved frames!`, 'success');
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Could not update wishlist.', 'error');
    }
  };

  const filteredFrames = products.filter((p) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      p.name?.toLowerCase().includes(q) ||
      p.brand?.name?.toLowerCase().includes(q) ||
      p.frameShape?.toLowerCase().includes(q) ||
      p.frameMaterial?.toLowerCase().includes(q);

    let matchesCategory = true;
    if (activeCategory === 'eyeglasses') {
      matchesCategory = p.category?.slug?.includes('eye') || p.category?.name?.toLowerCase().includes('eye') || !p.category?.slug?.includes('sun');
    } else if (activeCategory === 'sunglasses') {
      matchesCategory = p.category?.slug?.includes('sun') || p.category?.name?.toLowerCase().includes('sun');
    } else if (activeCategory === 'rimless') {
      matchesCategory = p.frameShape?.toLowerCase().includes('rimless') || p.tags?.some((t) => t.toLowerCase().includes('rimless'));
    } else if (activeCategory === 'titanium') {
      matchesCategory = p.frameMaterial?.toLowerCase().includes('titanium') || p.tags?.some((t) => t.toLowerCase().includes('titanium'));
    }

    let matchesGender = true;
    if (selectedGender !== 'all') {
      matchesGender = p.gender?.toLowerCase() === selectedGender || p.gender?.toLowerCase() === 'unisex';
    }

    return matchesSearch && matchesCategory && matchesGender;
  });

  return (
    <div>
      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #30251F 0%, #4A3A33 100%)',
          color: '#F6F1E8',
          borderRadius: 14,
          padding: '2rem 2.5rem',
          marginBottom: '2rem',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 8px 30px rgba(48,37,31,0.12)',
        }}
      >
        <div style={{ maxWidth: 640 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#D4B483', color: '#1E1C19', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '3px 10px', borderRadius: 4, marginBottom: '0.75rem' }}>
            <Sparkles size={13} /> Optical Frame Gallery
          </div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', fontWeight: 700, margin: '0 0 0.5rem', color: '#FFFFFF' }}>
            Explore Handcrafted Designer Eyewear
          </h1>
          <p style={{ fontFamily: 'Inter, sans-serif', color: '#E8E2D9', fontSize: '0.95rem', margin: '0 0 1.5rem', lineHeight: 1.6 }}>
            Browse luxury frames crafted with Japanese titanium and Italian Mazzucchelli acetate. Try them on live via your webcam or customize with precision prescription lenses.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link
              to="/virtual-try-on"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                background: '#B65E43', color: '#FFFFFF', padding: '0.7rem 1.25rem',
                borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: '0.875rem',
              }}
            >
              <Eye size={16} /> Open 3D Virtual Try-On
            </Link>
            <Link
              to="/try-at-home"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                background: 'rgba(255,255,255,0.12)', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.25)',
                padding: '0.7rem 1.25rem', borderRadius: 8, textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem',
              }}
            >
              Try 5 Frames at Home (Free)
            </Link>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ background: '#FFFFFF', borderRadius: 12, padding: '1.25rem', border: '1px solid #F0EAE0', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', flex: '1 1 300px' }}>
            <Search size={17} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#72785A' }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search frames by name, shape (Aviator, Round), or material..."
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.6rem',
                borderRadius: 8,
                border: '1.5px solid #E8E2D9',
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.9rem',
                color: '#30251F',
                background: '#FDFCFB',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Gender Filter Buttons */}
          <div style={{ display: 'flex', gap: '0.35rem', background: '#F6F1E8', padding: 4, borderRadius: 8 }}>
            {(['all', 'men', 'women', 'unisex'] as const).map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGender(g)}
                style={{
                  background: selectedGender === g ? '#30251F' : 'transparent',
                  color: selectedGender === g ? '#FFFFFF' : '#72785A',
                  border: 'none',
                  borderRadius: 6,
                  padding: '6px 14px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  transition: 'all 0.15s',
                }}
              >
                {g === 'all' ? 'All Genders' : g}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', borderTop: '1px solid #F0EAE0', paddingTop: '0.85rem' }}>
          {[
            { id: 'all', label: 'All Collections' },
            { id: 'eyeglasses', label: '👓 Eyeglasses' },
            { id: 'sunglasses', label: '🕶️ Sunglasses' },
            { id: 'titanium', label: '✨ Titanium Frames' },
            { id: 'rimless', label: '🪶 Rimless Lightweight' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              style={{
                background: activeCategory === cat.id ? '#B65E43' : '#F6F1E8',
                color: activeCategory === cat.id ? '#FFFFFF' : '#4A3A33',
                border: 'none',
                borderRadius: 20,
                padding: '6px 14px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.825rem',
                fontWeight: activeCategory === cat.id ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {cat.label}
            </button>
          ))}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', fontSize: '0.825rem', color: '#72785A', fontWeight: 600 }}>
            Showing {filteredFrames.length} {filteredFrames.length === 1 ? 'frame' : 'frames'}
          </div>
        </div>
      </div>

      {/* Frame Cards Grid */}
      {loading ? (
        <div style={{ padding: '5rem 0', display: 'flex', justifyContent: 'center' }}>
          <LoadingSpinner size="lg" />
        </div>
      ) : filteredFrames.length === 0 ? (
        <div style={{ background: '#FFFFFF', borderRadius: 14, padding: '4rem 2rem', textAlign: 'center', border: '1px solid #F0EAE0' }}>
          <Eye size={48} style={{ color: '#D4B483', margin: '0 auto 1rem', display: 'block' }} />
          <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.35rem', color: '#30251F', margin: '0 0 0.5rem' }}>
            No frames found matching your filters
          </h3>
          <p style={{ color: '#72785A', fontSize: '0.9rem', margin: '0 0 1.5rem' }}>
            Try resetting your search or selecting a different category to view more frames.
          </p>
          <button
            onClick={() => { setSearch(''); setActiveCategory('all'); setSelectedGender('all'); }}
            style={{
              background: '#B65E43', color: '#FFFFFF', border: 'none',
              padding: '0.75rem 1.5rem', borderRadius: 7, fontWeight: 700, cursor: 'pointer',
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {filteredFrames.map((frame) => {
            const isWishlisted = !!wishlistedIds[frame._id];
            const displayPrice = frame.salePrice || frame.basePrice;
            const hasDiscount = frame.salePrice && frame.salePrice < frame.basePrice;

            return (
              <div
                key={frame._id}
                style={{
                  background: '#FFFFFF',
                  borderRadius: 14,
                  border: '1px solid #F0EAE0',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  boxShadow: '0 3px 12px rgba(48,37,31,0.05)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(48,37,31,0.09)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 3px 12px rgba(48,37,31,0.05)';
                }}
              >
                {/* Frame Image Area */}
                <div
                  style={{
                    height: 200,
                    background: '#FDFBF7',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1.25rem',
                    borderBottom: '1px solid #F4EFEA',
                  }}
                >
                  <img
                    src={frame.images?.[0] || 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80'}
                    alt={frame.name}
                    style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                  />

                  {/* Badges */}
                  <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {frame.isBestseller && (
                      <span style={{ background: '#B65E43', color: 'white', fontSize: '0.65rem', fontWeight: 700, padding: '2px 7px', borderRadius: 4, textTransform: 'uppercase' }}>
                        Bestseller
                      </span>
                    )}
                    {frame.frameMaterial && (
                      <span style={{ background: '#30251F', color: '#D4B483', fontSize: '0.65rem', fontWeight: 600, padding: '2px 7px', borderRadius: 4 }}>
                        {frame.frameMaterial}
                      </span>
                    )}
                  </div>

                  {/* Wishlist Toggle Button */}
                  <button
                    onClick={(e) => handleToggleWishlist(frame, e)}
                    title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                    style={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      background: 'white',
                      border: '1px solid #F0EAE0',
                      borderRadius: '50%',
                      width: 34,
                      height: 34,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                      transition: 'transform 0.15s',
                    }}
                  >
                    <Heart size={16} fill={isWishlisted ? '#B65E43' : 'none'} color={isWishlisted ? '#B65E43' : '#72785A'} />
                  </button>
                </div>

                {/* Content */}
                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#72785A', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {frame.brand?.name || 'PS Atelier'}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#A89C8C', textTransform: 'capitalize' }}>
                      {frame.frameShape || 'Optical Frame'}
                    </span>
                  </div>

                  <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.15rem', fontWeight: 700, color: '#30251F', margin: '0 0 0.5rem', lineHeight: 1.3 }}>
                    {frame.name}
                  </h3>

                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', color: '#72785A', margin: '0 0 1rem', lineHeight: 1.5, flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {frame.shortDescription || frame.description || 'Lightweight premium designer frame ready for single vision, bifocal or zero-power lenses.'}
                  </p>

                  {/* Price & Rating */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', paddingTop: '0.5rem', borderTop: '1px solid #F6F1E8' }}>
                    <div>
                      <span style={{ fontFamily: 'Georgia, serif', fontSize: '1.3rem', fontWeight: 700, color: '#30251F' }}>
                        ₹{displayPrice.toLocaleString()}
                      </span>
                      {hasDiscount && (
                        <span style={{ fontSize: '0.85rem', color: '#A89C8C', textDecoration: 'line-through', marginLeft: 6 }}>
                          ₹{frame.basePrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#72785A', display: 'flex', alignItems: 'center', gap: 3 }}>
                      <span style={{ color: '#D4B483', fontSize: '0.9rem' }}>★</span>
                      <strong>{frame.averageRating || '4.9'}</strong>
                      <span>({frame.reviewCount || 18})</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <Link
                      to={`/virtual-try-on?frame=${frame.slug}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.35rem',
                        background: '#F6F1E8',
                        color: '#30251F',
                        padding: '0.65rem 0.5rem',
                        borderRadius: 7,
                        textDecoration: 'none',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        border: '1px solid #E8E2D9',
                        transition: 'background 0.15s',
                      }}
                    >
                      <Eye size={14} color="#B65E43" /> Virtual Try-On
                    </Link>

                    <Link
                      to={`/products/${frame.slug}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.35rem',
                        background: '#B65E43',
                        color: '#FFFFFF',
                        padding: '0.65rem 0.5rem',
                        borderRadius: 7,
                        textDecoration: 'none',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        transition: 'background 0.15s',
                      }}
                    >
                      Customize Lenses <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
