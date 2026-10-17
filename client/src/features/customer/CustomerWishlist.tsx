import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ArrowRight } from 'lucide-react';
import { wishlistAPI } from '../../services/api';
import { Product } from '../../types';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useToast } from '../../components/ui/Toaster';

export default function CustomerWishlist() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    wishlistAPI.getWishlist()
      .then((res) => setProducts(res.data.data?.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = async (id: string) => {
    try {
      await wishlistAPI.remove(id);
      setProducts(products.filter((p) => p._id !== id));
      showToast('Frame removed from wishlist.', 'info');
    } catch {
      showToast('Failed to remove frame.', 'error');
    }
  };

  if (loading) {
    return <div style={{ padding: '4rem 0', display: 'flex', justifyContent: 'center' }}><LoadingSpinner size="md" /></div>;
  }

  return (
    <div>
      <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.85rem', color: '#30251F', margin: '0 0 1.5rem' }}>
        Saved Frames &amp; Wishlist ({products.length})
      </h1>

      {products.length === 0 ? (
        <div style={{ background: 'white', borderRadius: 12, padding: '3rem', textAlign: 'center', border: '1px solid #F0EAE0' }}>
          <Heart size={40} style={{ color: '#D4B483', marginBottom: '1rem' }} />
          <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', color: '#30251F' }}>Your wishlist is empty</h3>
          <p style={{ color: '#72785A', fontSize: '0.9rem', marginTop: '0.5rem' }}>Save your favorite frame designs to compare or purchase later.</p>
          <Link to="/eyeglasses" style={{ display: 'inline-block', marginTop: '1rem', background: '#B65E43', color: 'white', textDecoration: 'none', padding: '0.75rem 1.5rem', borderRadius: 6, fontWeight: 600 }}>
            Discover Optical Frames
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '1.5rem' }}>
          {products.map((p) => (
            <div key={p._id} style={{ background: 'white', borderRadius: 12, overflow: 'hidden', border: '1px solid #F0EAE0', boxShadow: '0 2px 10px rgba(48,37,31,0.04)' }}>
              <div style={{ background: '#F6F1E8', height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', position: 'relative' }}>
                {p.images?.[0] && <img src={p.images[0]} alt="" style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }} />}
                <button
                  onClick={() => handleRemove(p._id)}
                  style={{ position: 'absolute', top: 8, right: 8, background: 'white', border: 'none', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#B65E43' }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div style={{ padding: '1rem' }}>
                <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', fontWeight: 600, color: '#30251F', margin: '0 0 0.5rem' }}>{p.name}</h3>
                <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.05rem', fontWeight: 700, color: '#B65E43', margin: '0 0 0.75rem' }}>
                  ₹{(p.salePrice || p.basePrice).toLocaleString()}
                </p>
                <Link
                  to={`/products/${p.slug}`}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, width: '100%', padding: '0.6rem', background: '#30251F', color: '#F6F1E8', textDecoration: 'none', borderRadius: 6, fontSize: '0.8rem', fontWeight: 600 }}
                >
                  View &amp; Configure Lenses <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
