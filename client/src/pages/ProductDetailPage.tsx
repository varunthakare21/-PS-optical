import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, Truck, Shield, RefreshCw, Heart, ShoppingBag, Camera, Check,
  ChevronRight, Info, Plus, Minus, ArrowRight, Eye, Sparkles
} from 'lucide-react';
import { productsAPI, wishlistAPI, reviewsAPI } from '../services/api';
import { Product, Review } from '../types';
import { useCart } from '../features/cart/CartContext';
import { useAuth } from '../features/auth/AuthContext';
import { useToast } from '../components/ui/Toaster';
import LoadingSpinner from '../components/ui/LoadingSpinner';

// Lens types definition
const LENS_TYPES = [
  { id: 'zero_power', name: 'Zero Power / Frame Only', price: 0, desc: 'Original protective demo lenses or frame only.' },
  { id: 'single_vision_standard', name: 'Single Vision Anti-Glare', price: 990, desc: 'For distance or reading. Scratch-resistant + anti-reflective.' },
  { id: 'blue_cut', name: 'Blue-Light Blocking Lenses', price: 1490, desc: 'Blocks digital screen glare and fatigue. Recommended for computers.' },
  { id: 'progressive_precision', name: 'Progressive Multifocal', price: 2990, desc: 'Seamless vision for distance, intermediate, and near without lines.' },
  { id: 'photochromic', name: 'Photochromic Light-Adaptive', price: 2490, desc: 'Transitions from clear indoors to dark sunglasses outdoors.' },
];

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [inWishlist, setInWishlist] = useState(false);
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState<string | null>(null);

  // Lens Wizard modal state
  const [lensWizardOpen, setLensWizardOpen] = useState(false);
  const [lensStep, setLensStep] = useState(1);
  const [selectedLensType, setSelectedLensType] = useState(LENS_TYPES[0]);
  const [prescriptionType, setPrescriptionType] = useState<'upload' | 'manual' | 'later'>('later');
  const [sphereR, setSphereR] = useState('0.00');
  const [sphereL, setSphereL] = useState('0.00');
  const [cylR, setCylR] = useState('0.00');
  const [cylL, setCylL] = useState('0.00');
  const [axisR, setAxisR] = useState('0');
  const [axisL, setAxisL] = useState('0');
  const [pd, setPd] = useState('63');

  // Review form
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewBody, setReviewBody] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const { addItem } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    productsAPI.getProduct(slug)
      .then((res) => {
        const p = res.data.data;
        setProduct(p);
        if (p.frameColor?.length) setSelectedColor(p.frameColor[0]);
        if (p.frameSize) setSelectedSize(p.frameSize);
        return reviewsAPI.getByProduct(p._id);
      })
      .then((rRes) => {
        setReviews(rRes.data.data || []);
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleToggleWishlist = async () => {
    if (!product) return;
    if (!user) {
      showToast('Please sign in to add to your wishlist.', 'info');
      navigate('/customer/login');
      return;
    }
    try {
      if (inWishlist) {
        await wishlistAPI.remove(product._id);
        setInWishlist(false);
        showToast('Removed from wishlist.', 'info');
      } else {
        await wishlistAPI.add(product._id);
        setInWishlist(true);
        showToast('Added to wishlist.', 'success');
      }
    } catch {
      showToast('Failed to update wishlist.', 'error');
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      await addItem({
        productId: product._id,
        color: selectedColor || product.frameColor?.[0] || 'Standard',
        size: selectedSize || product.frameSize || 'medium',
        quantity: 1,
        lensType: selectedLensType.name,
        unitPrice: (product.salePrice || product.basePrice) + selectedLensType.price,
      });
      showToast(`Added ${product.name} to your cart.`, 'success');
    } catch {
      showToast('Failed to add to cart.', 'error');
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate('/cart');
  };

  const checkPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length === 6 && /^\d+$/.test(pincode)) {
      if (pincode === '441904') {
        setPincodeStatus('⚡ Local Express Delivery available in Bhandara (441904) or Pick up in-store Near Post Office!');
      } else if (/^4[0-4]\d{4}$/.test(pincode)) {
        setPincodeStatus(`✓ Delivery Available! Fast courier dispatch across Maharashtra within 2–4 business days to PIN ${pincode}.`);
      } else {
        setPincodeStatus('ℹ️ We currently deliver all over Maharashtra only (PIN codes 40xxxx–44xxxx). Other states coming soon.');
      }
    } else {
      setPincodeStatus('Please enter a valid 6-digit Indian PIN code.');
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast('Please sign in to review this frame.', 'info');
      navigate('/customer/login');
      return;
    }
    if (!product) return;
    setSubmittingReview(true);
    try {
      await reviewsAPI.create({
        productId: product._id,
        rating: reviewRating,
        title: reviewTitle,
        body: reviewBody,
      });
      showToast('Review submitted! It will appear after moderation.', 'success');
      setReviewTitle('');
      setReviewBody('');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to submit review.', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '8rem 0', display: 'flex', justifyContent: 'center' }}><LoadingSpinner size="lg" /></div>;
  }

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 1.5rem' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', color: '#30251F' }}>Product Not Found</h2>
        <p style={{ color: '#72785A' }}>This frame might have been retired or does not exist.</p>
        <Link to="/eyeglasses" style={{ color: '#B65E43', fontWeight: 600 }}>Explore our catalog →</Link>
      </div>
    );
  }

  const effectivePrice = (product.salePrice || product.basePrice) + (selectedLensType?.price || 0);

  return (
    <div style={{ maxWidth: 1340, margin: '0 auto', padding: '2rem 1.5rem 5rem' }}>
      {/* Breadcrumb */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', color: '#72785A', marginBottom: '2rem' }}>
        <Link to="/" style={{ color: '#72785A', textDecoration: 'none' }}>Home</Link>
        <span>/</span>
        <Link to="/eyeglasses" style={{ color: '#72785A', textDecoration: 'none' }}>Eyeglasses</Link>
        <span>/</span>
        <span style={{ color: '#30251F', fontWeight: 500 }}>{product.name}</span>
      </nav>

      {/* Main product showcase */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '3.5rem', alignItems: 'start' }} className="grid-cols-1! lg:grid-cols-2!">
        {/* Left: Gallery */}
        <div>
          <div style={{ background: '#F6F1E8', borderRadius: 16, overflow: 'hidden', aspectRatio: '4/3', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2.5rem', position: 'relative', boxShadow: '0 4px 20px rgba(48,37,31,0.06)' }}>
            {product.images?.[selectedImage] ? (
              <motion.img
                key={selectedImage}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                src={product.images[selectedImage]}
                alt={product.name}
                style={{ maxWidth: '100%', maxHeight: '280px', objectFit: 'contain' }}
              />
            ) : (
              <span style={{ color: '#A89C8C', fontFamily: 'Georgia, serif' }}>PS OPTICAL FRAME</span>
            )}

            {/* Virtual Try-On Pill on image */}
            <Link
              to={`/virtual-try-on?frame=${product.slug}`}
              style={{
                position: 'absolute', bottom: 16, right: 16,
                background: '#30251F', color: '#D4B483', textDecoration: 'none',
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.5rem 1rem', borderRadius: 30, fontFamily: 'Inter, sans-serif',
                fontSize: '0.78rem', fontWeight: 600, boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
              }}
            >
              <Camera size={14} /> Try On Virtually
            </Link>
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  style={{
                    width: 72, height: 56, borderRadius: 8, overflow: 'hidden',
                    border: selectedImage === idx ? '2px solid #B65E43' : '1px solid #E8E0D0',
                    background: '#F6F1E8', padding: 4, cursor: 'pointer',
                  }}
                >
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </button>
              ))}
            </div>
          )}

          {/* Frame Measurements diagram */}
          <div style={{ marginTop: '2.5rem', padding: '1.5rem', background: 'white', borderRadius: 12, border: '1px solid #F0EAE0' }}>
            <h4 style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', fontWeight: 700, color: '#30251F', margin: '0 0 1rem' }}>
              Frame Specifications &amp; Fit
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', textAlign: 'center' }}>
              <div style={{ padding: '0.75rem', background: '#F6F1E8', borderRadius: 8 }}>
                <p style={{ margin: 0, fontSize: '0.72rem', color: '#72785A', textTransform: 'uppercase' }}>Lens Width</p>
                <p style={{ margin: '4px 0 0', fontFamily: 'Georgia, serif', fontSize: '1.1rem', fontWeight: 700, color: '#30251F' }}>
                  {product.lensWidth || 50} mm
                </p>
              </div>
              <div style={{ padding: '0.75rem', background: '#F6F1E8', borderRadius: 8 }}>
                <p style={{ margin: 0, fontSize: '0.72rem', color: '#72785A', textTransform: 'uppercase' }}>Bridge</p>
                <p style={{ margin: '4px 0 0', fontFamily: 'Georgia, serif', fontSize: '1.1rem', fontWeight: 700, color: '#30251F' }}>
                  {product.bridgeWidth || 18} mm
                </p>
              </div>
              <div style={{ padding: '0.75rem', background: '#F6F1E8', borderRadius: 8 }}>
                <p style={{ margin: 0, fontSize: '0.72rem', color: '#72785A', textTransform: 'uppercase' }}>Temple</p>
                <p style={{ margin: '4px 0 0', fontFamily: 'Georgia, serif', fontSize: '1.1rem', fontWeight: 700, color: '#30251F' }}>
                  {product.templeLength || 145} mm
                </p>
              </div>
            </div>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', color: '#72785A', marginTop: '1rem', lineHeight: 1.5 }}>
              Material: <strong>{product.frameMaterial}</strong> · Shape: <strong style={{ textTransform: 'capitalize' }}>{product.frameShape}</strong> · Size: <strong style={{ textTransform: 'capitalize' }}>{product.frameSize}</strong>
            </p>
          </div>
        </div>

        {/* Right: Details & Purchase actions */}
        <div>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#D4B483', margin: '0 0 0.5rem' }}>
            {(product.brand as any)?.name || 'PS OPTICAL'}
          </p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', fontWeight: 700, color: '#30251F', margin: '0 0 0.75rem', lineHeight: 1.2 }}>
            {product.name}
          </h1>

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={14} style={{ color: s <= Math.round(product.averageRating || 5) ? '#D4B483' : '#EDE5D4' }} fill={s <= Math.round(product.averageRating || 5) ? '#D4B483' : 'none'} />
              ))}
            </div>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: '#72785A' }}>
              {product.averageRating || 5.0} ({reviews.length} reviews)
            </span>
            <span style={{ color: '#D8CFC4' }}>·</span>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: '#72785A' }}>
              SKU: {product.sku}
            </span>
          </div>

          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.875rem', marginBottom: '1.5rem' }}>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', fontWeight: 700, color: '#B65E43' }}>
              ₹{effectivePrice.toLocaleString()}
            </span>
            {product.salePrice && product.salePrice < product.basePrice && (
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.1rem', color: '#A89C8C', textDecoration: 'line-through' }}>
                ₹{(product.basePrice + (selectedLensType?.price || 0)).toLocaleString()}
              </span>
            )}
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#72785A', background: '#F0EAE0', padding: '3px 8px', borderRadius: 4 }}>
              Includes standard frame + selected lens
            </span>
          </div>

          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.95rem', color: '#4A3A33', lineHeight: 1.7, marginBottom: '2rem' }}>
            {product.description}
          </p>

          {/* Colors */}
          {product.frameColor && product.frameColor.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', fontWeight: 600, color: '#30251F', marginBottom: '0.625rem' }}>
                Frame Colour: <span style={{ fontWeight: 400, color: '#72785A' }}>{selectedColor}</span>
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {product.frameColor.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    style={{
                      padding: '0.5rem 1rem', borderRadius: 6,
                      border: selectedColor === c ? '2px solid #B65E43' : '1px solid #D8CFC4',
                      background: selectedColor === c ? '#FDF8F3' : 'white',
                      fontFamily: 'Inter, sans-serif', fontSize: '0.85rem',
                      color: selectedColor === c ? '#B65E43' : '#4A3A33',
                      fontWeight: selectedColor === c ? 600 : 400, cursor: 'pointer',
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Lens configuration card */}
          <div style={{ background: '#FDF8F3', border: '1.5px solid #F0DCCE', borderRadius: 12, padding: '1.25rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={16} style={{ color: '#B65E43' }} />
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', fontWeight: 700, color: '#30251F' }}>
                  Selected Lens: {selectedLensType.name}
                </span>
              </div>
              <button
                onClick={() => setLensWizardOpen(true)}
                style={{ background: 'none', border: 'none', color: '#B65E43', fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
              >
                Change Lens Options →
              </button>
            </div>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: '#72785A', margin: 0 }}>
              {selectedLensType.desc} {selectedLensType.price > 0 ? `(+₹${selectedLensType.price})` : '(Included)'}
            </p>
          </div>

          {/* Actions: Add to Cart, Buy Now, Wishlist */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            <button
              onClick={handleAddToCart}
              style={{
                flex: 1, minWidth: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                background: '#B65E43', color: 'white', border: 'none', borderRadius: 7, padding: '0.95rem 1.5rem',
                fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.04em',
                textTransform: 'uppercase', cursor: 'pointer', transition: 'background 0.2s',
              }}
            >
              <ShoppingBag size={18} /> Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              style={{
                flex: 1, minWidth: 140, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: '#30251F', color: '#F6F1E8', border: 'none', borderRadius: 7, padding: '0.95rem 1.5rem',
                fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.04em',
                textTransform: 'uppercase', cursor: 'pointer',
              }}
            >
              Buy Now
            </button>
            <button
              onClick={handleToggleWishlist}
              style={{
                width: 48, height: 48, borderRadius: 7, border: '1.5px solid #D8CFC4',
                background: inWishlist ? '#FDF8F3' : 'white', display: 'flex', alignItems: 'center',
                justifyContent: 'center', cursor: 'pointer', color: inWishlist ? '#B65E43' : '#4A3A33',
              }}
              aria-label="Wishlist"
            >
              <Heart size={20} fill={inWishlist ? '#B65E43' : 'none'} />
            </button>
          </div>

          {/* Pin code delivery check */}
          <div style={{ padding: '1.25rem', background: '#F6F1E8', borderRadius: 10, marginBottom: '2rem' }}>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', fontWeight: 600, color: '#30251F', margin: '0 0 0.5rem' }}>
              🚚 Delivery Check · All Over Maharashtra (Hub: Bhandara 441904)
            </p>
            <form onSubmit={checkPincode} style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Enter PIN code (e.g. 441904)"
                style={{
                  flex: 1, padding: '0.55rem 0.75rem', borderRadius: 6,
                  border: '1px solid #D8CFC4', background: 'white',
                  fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', outline: 'none',
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '0.55rem 1rem', background: '#30251F', color: '#F6F1E8',
                  border: 'none', borderRadius: 6, fontFamily: 'Inter, sans-serif',
                  fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
                }}
              >
                Check
              </button>
            </form>
            {pincodeStatus && (
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: '#72785A', marginTop: '0.5rem' }}>
                {pincodeStatus}
              </p>
            )}
          </div>

          {/* Guarantees */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '1px solid #E8E0D0', paddingTop: '1.5rem' }}>
            {[
              { icon: Truck, title: 'Complimentary Pan-India Shipping', desc: 'Secure protective packaging on all orders' },
              { icon: Shield, title: '1-Year Warranty & Free Servicing', desc: 'Covers screws, nose-pad adjustments, and frame misalignment' },
              { icon: RefreshCw, title: '7-Day Return Policy', desc: 'No questions asked returns on non-customized optical frames' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <Icon size={16} style={{ color: '#B65E43', marginTop: 2, flexShrink: 0 }} />
                <div>
                  <p style={{ margin: 0, fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', fontWeight: 600, color: '#30251F' }}>{title}</p>
                  <p style={{ margin: 0, fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#72785A' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── LENS CUSTOMIZATION WIZARD MODAL (Step 1 to 6) ── */}
      <AnimatePresence>
        {lensWizardOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLensWizardOpen(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 120 }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              style={{
                position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                background: 'white', borderRadius: 16, width: '90%', maxWidth: 640,
                maxHeight: '90vh', overflowY: 'auto', zIndex: 130, padding: '2rem',
                boxShadow: '0 24px 64px rgba(0,0,0,0.25)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #F0EAE0', paddingBottom: '1rem' }}>
                <div>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#B65E43', margin: 0 }}>
                    Custom Optical Lab
                  </p>
                  <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.35rem', fontWeight: 700, color: '#30251F', margin: '4px 0 0' }}>
                    Lens Customization Wizard
                  </h3>
                </div>
                <button
                  onClick={() => setLensWizardOpen(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#72785A', fontSize: '1.5rem' }}
                >
                  ✕
                </button>
              </div>

              {/* Wizard Steps indicator */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', position: 'relative' }}>
                {['1. Lens Type', '2. Prescription', '3. Summary'].map((st, i) => (
                  <span
                    key={st}
                    style={{
                      fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', fontWeight: lensStep === i + 1 ? 700 : 400,
                      color: lensStep === i + 1 ? '#B65E43' : '#72785A',
                    }}
                  >
                    {st}
                  </span>
                ))}
              </div>

              {/* Step 1: Lens Type */}
              {lensStep === 1 && (
                <div>
                  <h4 style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#30251F', marginBottom: '1rem' }}>
                    Select Your Lens Solution
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {LENS_TYPES.map((lt) => {
                      const sel = selectedLensType.id === lt.id;
                      return (
                        <div
                          key={lt.id}
                          onClick={() => setSelectedLensType(lt)}
                          style={{
                            padding: '1rem 1.25rem', borderRadius: 10,
                            border: sel ? '2px solid #B65E43' : '1px solid #E8E0D0',
                            background: sel ? '#FDF8F3' : 'white', cursor: 'pointer',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          }}
                        >
                          <div>
                            <p style={{ margin: 0, fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', fontWeight: 600, color: '#30251F' }}>{lt.name}</p>
                            <p style={{ margin: '4px 0 0', fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: '#72785A' }}>{lt.desc}</p>
                          </div>
                          <span style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', fontWeight: 700, color: '#B65E43', whiteSpace: 'nowrap' }}>
                            {lt.price === 0 ? 'Free' : `+₹${lt.price}`}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => setLensStep(2)}
                    style={{ marginTop: '1.5rem', width: '100%', background: '#B65E43', color: 'white', padding: '0.85rem', borderRadius: 7, border: 'none', fontFamily: 'Inter, sans-serif', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Next: Prescription Details →
                  </button>
                </div>
              )}

              {/* Step 2: Prescription Input */}
              {lensStep === 2 && (
                <div>
                  <h4 style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#30251F', marginBottom: '1rem' }}>
                    How would you like to provide your prescription?
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    {[
                      { id: 'later', label: 'Provide Later', desc: 'Send via WhatsApp or email after ordering' },
                      { id: 'manual', label: 'Enter Manually', desc: 'Type SPH, CYL, Axis values' },
                      { id: 'upload', label: 'Upload Photo', desc: 'Attach prescription document' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setPrescriptionType(opt.id as any)}
                        style={{
                          padding: '0.875rem 0.5rem', borderRadius: 8,
                          border: prescriptionType === opt.id ? '2px solid #B65E43' : '1px solid #E8E0D0',
                          background: prescriptionType === opt.id ? '#FDF8F3' : 'white', cursor: 'pointer',
                          textAlign: 'center',
                        }}
                      >
                        <p style={{ margin: 0, fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', fontWeight: 600, color: '#30251F' }}>{opt.label}</p>
                        <p style={{ margin: '4px 0 0', fontFamily: 'Inter, sans-serif', fontSize: '0.7rem', color: '#72785A' }}>{opt.desc}</p>
                      </button>
                    ))}
                  </div>

                  {prescriptionType === 'manual' && (
                    <div style={{ background: '#F6F1E8', padding: '1.25rem', borderRadius: 10, marginBottom: '1.5rem' }}>
                      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', fontWeight: 600, color: '#30251F', marginBottom: '0.75rem' }}>Prescription Grid</p>
                      <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr 1fr', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Eye</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, textAlign: 'center' }}>SPH</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, textAlign: 'center' }}>CYL</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, textAlign: 'center' }}>Axis</span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr 1fr', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.8rem', color: '#30251F' }}>OD (Right)</span>
                        <input value={sphereR} onChange={(e) => setSphereR(e.target.value)} style={{ padding: '0.4rem', borderRadius: 4, border: '1px solid #D8CFC4', textAlign: 'center' }} />
                        <input value={cylR} onChange={(e) => setCylR(e.target.value)} style={{ padding: '0.4rem', borderRadius: 4, border: '1px solid #D8CFC4', textAlign: 'center' }} />
                        <input value={axisR} onChange={(e) => setAxisR(e.target.value)} style={{ padding: '0.4rem', borderRadius: 4, border: '1px solid #D8CFC4', textAlign: 'center' }} />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr 1fr', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem' }}>
                        <span style={{ fontSize: '0.8rem', color: '#30251F' }}>OS (Left)</span>
                        <input value={sphereL} onChange={(e) => setSphereL(e.target.value)} style={{ padding: '0.4rem', borderRadius: 4, border: '1px solid #D8CFC4', textAlign: 'center' }} />
                        <input value={cylL} onChange={(e) => setCylL(e.target.value)} style={{ padding: '0.4rem', borderRadius: 4, border: '1px solid #D8CFC4', textAlign: 'center' }} />
                        <input value={axisL} onChange={(e) => setAxisL(e.target.value)} style={{ padding: '0.4rem', borderRadius: 4, border: '1px solid #D8CFC4', textAlign: 'center' }} />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.75rem', color: '#4A3A33' }}>Pupillary Distance (PD in mm):</label>
                        <input value={pd} onChange={(e) => setPd(e.target.value)} style={{ width: 80, marginLeft: 8, padding: '0.4rem', borderRadius: 4, border: '1px solid #D8CFC4', textAlign: 'center' }} />
                      </div>
                    </div>
                  )}

                  {prescriptionType === 'upload' && (
                    <div style={{ border: '2px dashed #D8CFC4', padding: '2rem', textAlign: 'center', borderRadius: 10, marginBottom: '1.5rem' }}>
                      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: '#72785A', margin: 0 }}>
                        Click to upload your doctor prescription (JPG, PNG, PDF up to 10MB)
                      </p>
                      <input type="file" accept="image/*,application/pdf" style={{ marginTop: '0.75rem' }} />
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                      onClick={() => setLensStep(1)}
                      style={{ flex: 1, background: '#EDE5D4', color: '#30251F', padding: '0.85rem', borderRadius: 7, border: 'none', fontFamily: 'Inter, sans-serif', fontWeight: 600, cursor: 'pointer' }}
                    >
                      ← Back
                    </button>
                    <button
                      onClick={() => setLensStep(3)}
                      style={{ flex: 2, background: '#B65E43', color: 'white', padding: '0.85rem', borderRadius: 7, border: 'none', fontFamily: 'Inter, sans-serif', fontWeight: 600, cursor: 'pointer' }}
                    >
                      Next: Review Configuration →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Summary & Confirm */}
              {lensStep === 3 && (
                <div>
                  <h4 style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#30251F', marginBottom: '1rem' }}>
                    Review Your Custom Order
                  </h4>
                  <div style={{ background: '#F6F1E8', borderRadius: 10, padding: '1.25rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.85rem', color: '#72785A' }}>Frame:</span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#30251F' }}>{product.name} ({selectedColor})</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.85rem', color: '#72785A' }}>Lens:</span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#30251F' }}>{selectedLensType.name}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.85rem', color: '#72785A' }}>Prescription:</span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#30251F', textTransform: 'capitalize' }}>{prescriptionType}</span>
                    </div>
                    <div style={{ borderTop: '1px solid #D8CFC4', paddingTop: '0.75rem', marginTop: '0.75rem', display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#30251F' }}>Total Package:</span>
                      <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#B65E43' }}>₹{effectivePrice.toLocaleString()}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setLensWizardOpen(false);
                      showToast('Lens customized! Click Add to Cart to complete.', 'success');
                    }}
                    style={{ width: '100%', background: '#B65E43', color: 'white', padding: '0.9rem', borderRadius: 7, border: 'none', fontFamily: 'Inter, sans-serif', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Confirm Configuration
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── REVIEWS SECTION ── */}
      <section style={{ marginTop: '5rem', borderTop: '1px solid #E8E0D0', paddingTop: '3.5rem' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.75rem', fontWeight: 700, color: '#30251F', marginBottom: '1.5rem' }}>
          Customer Reviews ({reviews.length})
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }} className="grid-cols-1! lg:grid-cols-2!">
          {/* Reviews list */}
          <div>
            {reviews.length === 0 ? (
              <p style={{ color: '#72785A', fontFamily: 'Inter, sans-serif' }}>Be the first to review this frame!</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {reviews.map((rev) => (
                  <div key={rev._id} style={{ background: 'white', borderRadius: 10, padding: '1.25rem', border: '1px solid #F0EAE0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: '0.5rem' }}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={13} style={{ color: s <= rev.rating ? '#D4B483' : '#EDE5D4' }} fill={s <= rev.rating ? '#D4B483' : 'none'} />
                      ))}
                    </div>
                    {rev.title && <h4 style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', fontWeight: 600, color: '#30251F', margin: '0 0 0.35rem' }}>{rev.title}</h4>}
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: '#4A3A33', margin: '0 0 0.5rem', lineHeight: 1.6 }}>{rev.body}</p>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', color: '#72785A' }}>
                      By {rev.customer?.name || 'Verified Buyer'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add review form */}
          <div style={{ background: 'white', borderRadius: 12, padding: '1.75rem', border: '1px solid #F0EAE0', height: 'fit-content' }}>
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', color: '#30251F', margin: '0 0 1rem' }}>
              Write a Review
            </h3>
            <form onSubmit={handleSubmitReview} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4A3A33', marginBottom: '0.35rem' }}>Rating</label>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setReviewRating(s)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}
                    >
                      <Star size={20} style={{ color: s <= reviewRating ? '#D4B483' : '#D8CFC4' }} fill={s <= reviewRating ? '#D4B483' : 'none'} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4A3A33', marginBottom: '0.35rem' }}>Review Title</label>
                <input
                  type="text"
                  required
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="e.g. Elegant fit and featherlight feel"
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 6, border: '1px solid #D8CFC4', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4A3A33', marginBottom: '0.35rem' }}>Your Review</label>
                <textarea
                  required
                  rows={4}
                  value={reviewBody}
                  onChange={(e) => setReviewBody(e.target.value)}
                  placeholder="Tell us about the fit, clarity, lens quality, and compliments you received..."
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 6, border: '1px solid #D8CFC4', outline: 'none', resize: 'vertical' }}
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                style={{
                  background: submittingReview ? '#C97259' : '#B65E43', color: 'white',
                  padding: '0.8rem 1.5rem', borderRadius: 6, border: 'none',
                  fontFamily: 'Inter, sans-serif', fontWeight: 600, cursor: submittingReview ? 'not-allowed' : 'pointer',
                }}
              >
                {submittingReview ? 'Submitting…' : 'Submit Review'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
