import { useState, useRef, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, Upload, RotateCcw, ZoomIn, ZoomOut, Move, Eye, Check, Shield, AlertTriangle } from 'lucide-react';
import { productsAPI } from '../services/api';
import { Product } from '../types';

export default function VirtualTryOnPage() {
  const [searchParams] = useSearchParams();
  const frameSlug = searchParams.get('frame');

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeColor, setActiveColor] = useState<string>('');

  // Mode: camera vs upload
  const [mode, setMode] = useState<'camera' | 'upload' | 'demo'>('demo');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  // Overlay frame adjustments
  const [scale, setScale] = useState(1);
  const [yOffset, setYOffset] = useState(0);
  const [xOffset, setXOffset] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    productsAPI.getProducts({ limit: 12 })
      .then((res) => {
        const list = res.data.data || [];
        setProducts(list);
        if (frameSlug) {
          const match = list.find((p: Product) => p.slug === frameSlug);
          if (match) {
            setSelectedProduct(match);
            setActiveColor(match.frameColor?.[0] || '');
          } else if (list.length > 0) {
            setSelectedProduct(list[0]);
            setActiveColor(list[0].frameColor?.[0] || '');
          }
        } else if (list.length > 0) {
          setSelectedProduct(list[0]);
          setActiveColor(list[0].frameColor?.[0] || '');
        }
      })
      .catch(() => {});
  }, [frameSlug]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
      setMode('camera');
    } catch (err: any) {
      setCameraError('Camera access was denied or is unavailable on this device. You can upload a photo instead.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
    setMode('demo');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      stopCamera();
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
        setMode('upload');
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const resetAdjustments = () => {
    setScale(1);
    setYOffset(0);
    setXOffset(0);
  };

  return (
    <div style={{ maxWidth: 1340, margin: '0 auto', padding: '2rem 1.5rem 5rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#B65E43', margin: '0 0 0.5rem' }}>
          Interactive Styling
        </p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 700, color: '#30251F', margin: 0 }}>
          Virtual Try-On Fitting Studio
        </h1>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', color: '#72785A', marginTop: '0.5rem' }}>
          Preview optical frames on your face in real time. Fit preview is an approximate visual style guide to help you find your aesthetic.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '3rem' }} className="grid-cols-1! lg:grid-cols-2!">
        {/* Left: Viewport */}
        <div>
          <div
            style={{
              position: 'relative', width: '100%', height: 460, borderRadius: 16,
              background: '#272522', overflow: 'hidden', display: 'flex', alignItems: 'center',
              justifyContent: 'center', boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
            }}
          >
            {/* Camera View */}
            {mode === 'camera' && (
              <video
                ref={videoRef}
                playsInline
                muted
                style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
              />
            )}

            {/* Photo Upload View */}
            {mode === 'upload' && uploadedImage && (
              <img
                src={uploadedImage}
                alt="Your photo"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            )}

            {/* Default Demo Face View */}
            {mode === 'demo' && (
              <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80&auto=format"
                  alt="Model face for try-on"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', bottom: 12, left: 12, background: 'rgba(0,0,0,0.6)', color: 'white', fontSize: '0.75rem', padding: '4px 10px', borderRadius: 4 }}>
                  Default Studio Face Mode
                </div>
              </div>
            )}

            {/* Frame Overlay */}
            {selectedProduct?.images?.[0] && (
              <motion.div
                style={{
                  position: 'absolute',
                  top: `calc(40% + ${yOffset}px)`,
                  left: `calc(50% + ${xOffset}px)`,
                  transform: `translate(-50%, -50%) scale(${scale})`,
                  pointerEvents: 'none',
                  zIndex: 20,
                  width: 220,
                  filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.3))',
                }}
              >
                <img
                  src={selectedProduct.images[0]}
                  alt=""
                  style={{ width: '100%', objectFit: 'contain' }}
                />
              </motion.div>
            )}

            {/* In-viewport Controls overlay */}
            <div style={{ position: 'absolute', bottom: 16, right: 16, display: 'flex', gap: '0.5rem', zIndex: 30 }}>
              <button
                onClick={() => setScale((s) => Math.min(1.5, s + 0.05))}
                style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.85)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                title="Enlarge frame"
              >
                <ZoomIn size={16} />
              </button>
              <button
                onClick={() => setScale((s) => Math.max(0.6, s - 0.05))}
                style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.85)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                title="Shrink frame"
              >
                <ZoomOut size={16} />
              </button>
              <button
                onClick={() => setYOffset((y) => y - 5)}
                style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.85)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                title="Move up"
              >
                ↑
              </button>
              <button
                onClick={() => setYOffset((y) => y + 5)}
                style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.85)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                title="Move down"
              >
                ↓
              </button>
              <button
                onClick={resetAdjustments}
                style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.85)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                title="Reset position"
              >
                <RotateCcw size={15} />
              </button>
            </div>
          </div>

          {/* Source toggles */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
            {!cameraActive ? (
              <button
                onClick={startCamera}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#B65E43',
                  color: 'white', border: 'none', borderRadius: 7, padding: '0.75rem 1.25rem',
                  fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                }}
              >
                <Camera size={16} /> Enable Live Camera
              </button>
            ) : (
              <button
                onClick={stopCamera}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#30251F',
                  color: 'white', border: 'none', borderRadius: 7, padding: '0.75rem 1.25rem',
                  fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                }}
              >
                Stop Camera
              </button>
            )}

            <label
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#EDE5D4',
                color: '#30251F', border: 'none', borderRadius: 7, padding: '0.75rem 1.25rem',
                fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
              }}
            >
              <Upload size={16} /> Upload Your Photo
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
            </label>
          </div>

          {cameraError && (
            <div style={{ display: 'flex', gap: '0.5rem', background: '#FFF3EE', border: '1px solid #F0DCCE', padding: '0.875rem', borderRadius: 8, marginTop: '1rem', color: '#B65E43', fontSize: '0.82rem' }}>
              <AlertTriangle size={18} style={{ flexShrink: 0 }} />
              <span>{cameraError}</span>
            </div>
          )}

          {/* Privacy Note */}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', color: '#72785A', fontSize: '0.78rem' }}>
            <Shield size={16} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>
              <strong>Privacy Guaranteed:</strong> Camera processing is performed locally in your browser. No video frames or face images are stored on our servers.
            </span>
          </div>
        </div>

        {/* Right: Frame selector & Details */}
        <div>
          {selectedProduct && (
            <div style={{ background: 'white', borderRadius: 14, padding: '1.75rem', border: '1px solid #F0EAE0', marginBottom: '2rem' }}>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', color: '#72785A', textTransform: 'uppercase', margin: 0 }}>
                Currently Trying On
              </p>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', color: '#30251F', margin: '4px 0 0.5rem' }}>
                {selectedProduct.name}
              </h3>
              <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', fontWeight: 700, color: '#B65E43', margin: '0 0 1rem' }}>
                ₹{(selectedProduct.salePrice || selectedProduct.basePrice).toLocaleString()}
              </p>

              {/* Color choices */}
              {selectedProduct.frameColor && selectedProduct.frameColor.length > 0 && (
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4A3A33', marginBottom: '0.4rem' }}>
                    Frame Colour: {activeColor}
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {selectedProduct.frameColor.map((col) => (
                      <button
                        key={col}
                        onClick={() => setActiveColor(col)}
                        style={{
                          padding: '0.4rem 0.8rem', borderRadius: 6,
                          border: activeColor === col ? '2px solid #B65E43' : '1px solid #D8CFC4',
                          background: activeColor === col ? '#FDF8F3' : 'white',
                          fontFamily: 'Inter, sans-serif', fontSize: '0.8rem',
                          color: activeColor === col ? '#B65E43' : '#4A3A33',
                          cursor: 'pointer',
                        }}
                      >
                        {col}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <Link
                to={`/products/${selectedProduct.slug}`}
                style={{
                  display: 'block', textAlign: 'center', background: '#30251F', color: '#F6F1E8',
                  textDecoration: 'none', padding: '0.85rem', borderRadius: 7, fontFamily: 'Inter, sans-serif',
                  fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase',
                }}
              >
                View Full Product &amp; Buy
              </Link>
            </div>
          )}

          {/* Frame Carousel */}
          <div>
            <h4 style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#30251F', marginBottom: '1rem' }}>
              Select Different Frames
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', maxHeight: 380, overflowY: 'auto' }}>
              {products.map((p) => {
                const isSelected = selectedProduct?._id === p._id;
                return (
                  <div
                    key={p._id}
                    onClick={() => {
                      setSelectedProduct(p);
                      setActiveColor(p.frameColor?.[0] || '');
                      resetAdjustments();
                    }}
                    style={{
                      background: 'white', borderRadius: 10, padding: '0.75rem',
                      border: isSelected ? '2px solid #B65E43' : '1px solid #F0EAE0',
                      cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center',
                    }}
                  >
                    <div style={{ width: '100%', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {p.images?.[0] && <img src={p.images[0]} alt="" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />}
                    </div>
                    <p style={{ margin: '6px 0 2px', fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', fontWeight: 600, color: '#30251F', textAlign: 'center' }}>
                      {p.name}
                    </p>
                    <p style={{ margin: 0, fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#B65E43' }}>
                      ₹{(p.salePrice || p.basePrice).toLocaleString()}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
