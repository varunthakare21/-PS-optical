import { useState, useEffect } from 'react';
import {
  Package, Plus, Search, Edit2, Trash2, Check, X, Eye,
  Camera, DollarSign, Calendar, TrendingUp, Layers, Sparkles, Image as ImageIcon
} from 'lucide-react';
import { adminAPI, categoriesAPI } from '../../services/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useToast } from '../../components/ui/Toaster';

// Curated world-class optical photography presets for instant preview/selection
const OPTICAL_PHOTO_PRESETS = [
  {
    label: 'Classic Havana Tortoise (Acetate)',
    front: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
    angle: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=800&q=80',
    side: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Minimalist Gold Titanium (Round)',
    front: 'https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=800&q=80',
    angle: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=800&q=80',
    side: 'https://images.unsplash.com/photo-1509695503492-413bc6d0a63a?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Matte Obsidian Black (Square)',
    front: 'https://images.unsplash.com/photo-1563903530908-afdd155d057a?auto=format&fit=crop&w=800&q=80',
    angle: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80',
    side: 'https://images.unsplash.com/photo-1582142306909-195724d33ffc?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Crystal Champagne Clear (Modern)',
    front: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=800&q=80',
    angle: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
    side: 'https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=800&q=80',
  },
];

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedFrameForBookings, setSelectedFrameForBookings] = useState<any | null>(null);
  const { showToast } = useToast();

  // Multi-photo and frame fields form
  const [form, setForm] = useState({
    name: '',
    slug: '',
    sku: '',
    description: '',
    basePrice: 3499,
    salePrice: 2999,
    costPrice: 950,
    category: '',
    brand: '',
    frameShape: 'round',
    frameType: 'full_rim',
    frameMaterial: 'Italian Acetate',
    frameColor: 'Classic Tortoise, Gold Rim',
    frameSize: 'medium',
    gender: 'unisex',
    bridgeSize: '52-19-145 mm',
    stockQuantity: 24,
    // Multi-angle photo URLs
    photoFront: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
    photoAngle: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=800&q=80',
    photoSide: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=800&q=80',
    isActive: true,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes, brandRes, bookingsRes] = await Promise.all([
        adminAPI.getProducts(),
        categoriesAPI.getAll(),
        adminAPI.getBrands().catch(() => ({ data: { data: [] } })),
        adminAPI.getBookings().catch(() => ({ data: { data: { tryAtHome: [], appointments: [] } } })),
      ]);
      setProducts(prodRes.data.data || []);
      setCategories(catRes.data.data || []);
      setBrands(brandRes.data.data || []);
      setBookings(bookingsRes.data.data?.tryAtHome || []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    setForm({
      name: '',
      slug: '',
      sku: `PSO-${randomSuffix}`,
      description: 'Handcrafted luxury optical frame with German spring hinges and ergonomic titanium nose pads.',
      basePrice: 3499,
      salePrice: 2999,
      costPrice: 950,
      category: categories[0]?._id || '',
      brand: brands[0]?._id || '',
      frameShape: 'round',
      frameType: 'full_rim',
      frameMaterial: 'Italian Acetate',
      frameColor: 'Classic Tortoise, Gold Accents',
      frameSize: 'medium',
      gender: 'unisex',
      bridgeSize: '51-19-145 mm',
      stockQuantity: 20,
      photoFront: OPTICAL_PHOTO_PRESETS[0].front,
      photoAngle: OPTICAL_PHOTO_PRESETS[0].angle,
      photoSide: OPTICAL_PHOTO_PRESETS[0].side,
      isActive: true,
    });
    setShowModal(true);
  };

  const openEditModal = (prod: any) => {
    setEditingProduct(prod);
    const images = Array.isArray(prod.images) ? prod.images : [];
    setForm({
      name: prod.name || '',
      slug: prod.slug || '',
      sku: prod.sku || '',
      description: prod.description || '',
      basePrice: prod.basePrice || 0,
      salePrice: prod.salePrice || 0,
      costPrice: prod.costPrice || Math.round((prod.salePrice || prod.basePrice || 2000) * 0.35),
      category: prod.category?._id || prod.category || '',
      brand: prod.brand?._id || prod.brand || '',
      frameShape: prod.frameShape || 'round',
      frameType: prod.frameType || 'full_rim',
      frameMaterial: prod.frameMaterial || 'Italian Acetate',
      frameColor: Array.isArray(prod.frameColor) ? prod.frameColor.join(', ') : prod.frameColor || '',
      frameSize: prod.frameSize || 'medium',
      gender: prod.gender || 'unisex',
      bridgeSize: prod.bridgeSize || '52-19-145 mm',
      stockQuantity: prod.stockQuantity ?? 15,
      photoFront: images[0] || OPTICAL_PHOTO_PRESETS[0].front,
      photoAngle: images[1] || images[0] || OPTICAL_PHOTO_PRESETS[0].angle,
      photoSide: images[2] || images[0] || OPTICAL_PHOTO_PRESETS[0].side,
      isActive: prod.isActive ?? true,
    });
    setShowModal(true);
  };

  const applyPreset = (preset: typeof OPTICAL_PHOTO_PRESETS[0]) => {
    setForm((prev) => ({
      ...prev,
      photoFront: preset.front,
      photoAngle: preset.angle,
      photoSide: preset.side,
    }));
    showToast(`Loaded ${preset.label} photography angles.`, 'info');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const imagesList = [form.photoFront, form.photoAngle, form.photoSide].filter(Boolean);
      if (imagesList.length === 0) {
        imagesList.push(OPTICAL_PHOTO_PRESETS[0].front);
      }

      const payload = {
        name: form.name,
        slug: form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        sku: form.sku,
        description: form.description,
        basePrice: Number(form.basePrice),
        salePrice: Number(form.salePrice) || Number(form.basePrice),
        costPrice: Number(form.costPrice) || Math.round(Number(form.salePrice) * 0.35),
        category: form.category || categories[0]?._id,
        brand: form.brand || brands[0]?._id,
        frameShape: form.frameShape,
        frameType: form.frameType,
        frameMaterial: form.frameMaterial,
        frameColor: form.frameColor.split(',').map((c) => c.trim()).filter(Boolean),
        frameSize: form.frameSize,
        gender: form.gender,
        images: imagesList,
        isActive: form.isActive,
      };

      if (editingProduct) {
        await adminAPI.updateProduct(editingProduct._id, payload);
        showToast('Eyewear frame updated successfully.', 'success');
      } else {
        await adminAPI.createProduct(payload);
        showToast('New handcrafted eyewear frame registered.', 'success');
      }
      setShowModal(false);
      await fetchData();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to save eyewear frame.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to deactivate this eyewear frame from the catalog?')) return;
    try {
      await adminAPI.deleteProduct(id);
      showToast('Frame status updated.', 'info');
      await fetchData();
    } catch {
      showToast('Failed to deactivate frame.', 'error');
    }
  };

  // Find bookings for a specific frame
  const getBookingsForFrame = (frameId: string) => {
    return bookings.filter((b) =>
      b.products?.some((p: any) => (p._id || p) === frameId)
    );
  };

  const filtered = products.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.name?.toLowerCase().includes(q) ||
      p.sku?.toLowerCase().includes(q) ||
      p.frameMaterial?.toLowerCase().includes(q)
    );
  });

  // Calculate live profit margin for the form
  const currentSellingPrice = Number(form.salePrice) || Number(form.basePrice) || 0;
  const currentCostPrice = Number(form.costPrice) || 0;
  const unitProfit = Math.max(0, currentSellingPrice - currentCostPrice);
  const profitMarginPct = currentSellingPrice > 0 ? Math.round((unitProfit / currentSellingPrice) * 100) : 0;

  return (
    <div style={{ color: '#F6F1E8' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.75rem', color: '#D4B483', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600 }}>
            Optical Inventory &amp; Frame Studio
          </span>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', margin: '0.25rem 0 0.5rem', color: '#FFFFFF' }}>
            Eyewear Frames Management
          </h1>
          <p style={{ color: '#B8AFA8', margin: 0, fontSize: '0.85rem' }}>
            Add frames manually with multi-angle photos, monitor unit profit margins, and track Try-at-Home bookings.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: '#D4B483',
            color: '#1E1C19',
            border: 'none',
            padding: '0.75rem 1.4rem',
            borderRadius: 7,
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(212,180,131,0.25)',
          }}
        >
          <Plus size={18} /> Add Frame Manually
        </button>
      </div>

      {/* Search Input */}
      <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
        <Search size={18} style={{ position: 'absolute', left: 14, top: 13, color: '#B8AFA8' }} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by frame model, SKU, material, or shape..."
          style={{
            width: '100%',
            padding: '0.75rem 1rem 0.75rem 2.6rem',
            borderRadius: 8,
            border: '1px solid #3A3632',
            background: '#1E1C19',
            color: '#FFFFFF',
            fontSize: '0.9rem',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {loading ? (
        <div style={{ padding: '4rem 0', display: 'flex', justifyContent: 'center' }}>
          <LoadingSpinner size="md" />
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ background: '#1E1C19', borderRadius: 12, padding: '3.5rem 2rem', textAlign: 'center', border: '1px solid #3A3632' }}>
          <Package size={44} style={{ color: '#72785A', marginBottom: '1rem' }} />
          <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', color: '#FFFFFF' }}>No Eyewear Frames Found</h3>
          <p style={{ color: '#B8AFA8', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            Click &ldquo;Add Frame Manually&rdquo; to register new optical designs and photos.
          </p>
        </div>
      ) : (
        <div style={{ background: '#1E1C19', borderRadius: 12, border: '1px solid #3A3632', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 900 }}>
            <thead>
              <tr style={{ background: '#2A2825', borderBottom: '1px solid #3A3632', fontSize: '0.75rem', color: '#D4B483', textTransform: 'uppercase' }}>
                <th style={{ padding: '1rem' }}>Frame Preview</th>
                <th style={{ padding: '1rem' }}>Model &amp; SKU</th>
                <th style={{ padding: '1rem' }}>Material &amp; Shape</th>
                <th style={{ padding: '1rem' }}>Retail Price &amp; Profit</th>
                <th style={{ padding: '1rem' }}>Home Trial Bookings</th>
                <th style={{ padding: '1rem' }}>Catalog Status</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((prod) => {
                const prodBookings = getBookingsForFrame(prod._id);
                const retailPrice = prod.salePrice || prod.basePrice || 0;
                const cost = prod.costPrice || Math.round(retailPrice * 0.35);
                const profit = retailPrice - cost;
                const margin = retailPrice > 0 ? Math.round((profit / retailPrice) * 100) : 0;
                const primaryImg = Array.isArray(prod.images) ? prod.images[0] : prod.images;

                return (
                  <tr key={prod._id} style={{ borderBottom: '1px solid #2A2825', fontSize: '0.85rem' }}>
                    {/* Frame Photo Thumbnail */}
                    <td style={{ padding: '1rem', width: 90 }}>
                      <div
                        style={{
                          width: 72,
                          height: 48,
                          borderRadius: 6,
                          overflow: 'hidden',
                          background: '#2A2825',
                          border: '1px solid #3A3632',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {primaryImg ? (
                          <img
                            src={primaryImg}
                            alt={prod.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e: any) => { e.target.src = OPTICAL_PHOTO_PRESETS[0].front; }}
                          />
                        ) : (
                          <ImageIcon size={20} color="#72785A" />
                        )}
                      </div>
                    </td>

                    {/* Model & SKU */}
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 600, color: '#FFFFFF', fontSize: '0.9rem' }}>{prod.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#D4B483', fontFamily: 'monospace', marginTop: 2 }}>
                        {prod.sku} &bull; {prod.category?.name || 'Eyewear'}
                      </div>
                    </td>

                    {/* Material & Shape */}
                    <td style={{ padding: '1rem', color: '#B8AFA8' }}>
                      <div style={{ textTransform: 'capitalize', color: '#F0EAE0', fontWeight: 500 }}>
                        {prod.frameShape} &bull; {prod.frameMaterial || 'Italian Acetate'}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#8F857B', marginTop: 2 }}>
                        {prod.gender?.toUpperCase()} &bull; {prod.frameSize?.toUpperCase()}
                      </div>
                    </td>

                    {/* Pricing & Profit */}
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontFamily: 'Georgia, serif', fontWeight: 700, color: '#D4B483', fontSize: '0.95rem' }}>
                        ₹{retailPrice.toLocaleString()}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#8FC87A', marginTop: 2 }}>
                        Profit: +₹{profit.toLocaleString()} ({margin}% net)
                      </div>
                    </td>

                    {/* Bookings Tracker */}
                    <td style={{ padding: '1rem' }}>
                      <button
                        onClick={() => setSelectedFrameForBookings({ prod, bookings: prodBookings })}
                        style={{
                          background: prodBookings.length > 0 ? '#3D341F' : '#2A2825',
                          border: `1px solid ${prodBookings.length > 0 ? '#D4B483' : '#3A3632'}`,
                          color: prodBookings.length > 0 ? '#D4B483' : '#B8AFA8',
                          padding: '0.35rem 0.75rem',
                          borderRadius: 6,
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 5,
                        }}
                      >
                        <Calendar size={13} />
                        {prodBookings.length} {prodBookings.length === 1 ? 'Booking' : 'Bookings'}
                      </button>
                    </td>

                    {/* Status */}
                    <td style={{ padding: '1rem' }}>
                      <span
                        style={{
                          padding: '2px 8px',
                          borderRadius: 4,
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          background: prod.isActive ? '#273822' : '#3D281F',
                          color: prod.isActive ? '#8FC87A' : '#E88B6E',
                        }}
                      >
                        {prod.isActive ? 'Active' : 'Archived'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => openEditModal(prod)}
                          title="Edit Frame Specifications & Photos"
                          style={{
                            background: '#2A2825',
                            border: '1px solid #3A3632',
                            color: '#D4B483',
                            padding: '0.45rem 0.65rem',
                            borderRadius: 6,
                            cursor: 'pointer',
                          }}
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(prod._id)}
                          title="Deactivate Frame"
                          style={{
                            background: '#3D281F',
                            border: 'none',
                            color: '#E88B6E',
                            padding: '0.45rem 0.65rem',
                            borderRadius: 6,
                            cursor: 'pointer',
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Frame Bookings Modal */}
      {selectedFrameForBookings && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.75)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            style={{
              background: '#1E1C19',
              border: '1px solid #3A3632',
              borderRadius: 12,
              padding: '2rem',
              width: '100%',
              maxWidth: 680,
              maxHeight: '85vh',
              overflowY: 'auto',
              color: '#F6F1E8',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', borderBottom: '1px solid #3A3632', paddingBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#D4B483', fontWeight: 700, fontFamily: 'monospace' }}>
                  SKU: {selectedFrameForBookings.prod.sku}
                </span>
                <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', color: '#FFFFFF', margin: '0.25rem 0 0' }}>
                  {selectedFrameForBookings.prod.name} &bull; Trial Reservations
                </h2>
              </div>
              <button
                onClick={() => setSelectedFrameForBookings(null)}
                style={{ background: 'none', border: 'none', color: '#B8AFA8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {selectedFrameForBookings.bookings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', background: '#2A2825', borderRadius: 8 }}>
                <Calendar size={36} color="#D4B483" style={{ marginBottom: 8 }} />
                <h4 style={{ color: '#FFFFFF', margin: 0, fontFamily: 'Georgia, serif' }}>No Doorstep Trials Booked Yet</h4>
                <p style={{ color: '#B8AFA8', fontSize: '0.85rem', marginTop: 4 }}>
                  When customers across Maharashtra select this frame for Try-at-Home, bookings will appear here.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {selectedFrameForBookings.bookings.map((b: any) => (
                  <div
                    key={b._id}
                    style={{
                      background: '#2A2825',
                      border: '1px solid #3A3632',
                      borderRadius: 8,
                      padding: '1rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, color: '#FFFFFF', fontSize: '0.9rem' }}>
                        {b.customer?.name}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#D4B483', marginTop: 2 }}>
                        📍 {b.address?.city || 'Bhandara'}, Maharashtra (PIN: {b.address?.pincode || '441904'})
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#B8AFA8', marginTop: 2 }}>
                        Scheduled for: {new Date(b.date).toLocaleDateString()} &bull; {b.timeSlot}
                      </div>
                    </div>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: 4,
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        background: b.status === 'completed' ? '#273822' : '#3D341F',
                        color: b.status === 'completed' ? '#8FC87A' : '#D4B483',
                      }}
                    >
                      {b.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Manual Frame Addition & Multi-Photo Studio Modal */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            style={{
              background: '#1E1C19',
              border: '1px solid #3A3632',
              borderRadius: 12,
              padding: '2rem',
              width: '100%',
              maxWidth: 780,
              maxHeight: '92vh',
              overflowY: 'auto',
              color: '#F6F1E8',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', borderBottom: '1px solid #3A3632', paddingBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#D4B483', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>
                  Optical Artisan Atelier
                </span>
                <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.45rem', color: '#FFFFFF', margin: '0.25rem 0 0' }}>
                  {editingProduct ? 'Edit Frame Specifications & Studio Photos' : 'Add Eyewear Frame Manually'}
                </h2>
              </div>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#B8AFA8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {/* Quick Photo Preset Selector */}
            <div style={{ background: '#2A2825', borderRadius: 8, padding: '0.85rem 1rem', border: '1px solid #3A3632', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: '0.5rem', fontSize: '0.78rem', color: '#D4B483', fontWeight: 700 }}>
                <Sparkles size={14} /> Quick-Fill Curated Optical Photography Presets:
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {OPTICAL_PHOTO_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => applyPreset(preset)}
                    style={{
                      background: '#1E1C19',
                      border: '1px solid #3A3632',
                      color: '#F6F1E8',
                      padding: '0.35rem 0.65rem',
                      borderRadius: 4,
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                    }}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              {/* Frame Name & SKU */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#D4B483', marginBottom: 4 }}>
                    Frame Model Name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    placeholder="e.g. Aurelius Classic Round Titanium"
                    style={{ width: '100%', padding: '0.7rem', borderRadius: 6, background: '#2A2825', border: '1px solid #3A3632', color: '#fff', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#D4B483', marginBottom: 4 }}>
                    Unique SKU Code
                  </label>
                  <input
                    type="text"
                    value={form.sku}
                    onChange={(e) => setForm({ ...form, sku: e.target.value })}
                    required
                    style={{ width: '100%', padding: '0.7rem', borderRadius: 6, background: '#2A2825', border: '1px solid #3A3632', color: '#fff', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* Category, Shape, Material, Size */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#D4B483', marginBottom: 4 }}>
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: 6, background: '#2A2825', border: '1px solid #3A3632', color: '#fff' }}
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#D4B483', marginBottom: 4 }}>
                    Frame Shape
                  </label>
                  <select
                    value={form.frameShape}
                    onChange={(e) => setForm({ ...form, frameShape: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: 6, background: '#2A2825', border: '1px solid #3A3632', color: '#fff' }}
                  >
                    <option value="round">Round</option>
                    <option value="square">Square</option>
                    <option value="rectangle">Rectangle</option>
                    <option value="aviator">Aviator</option>
                    <option value="cat-eye">Cat-Eye</option>
                    <option value="wayfarer">Wayfarer</option>
                    <option value="geometric">Geometric</option>
                    <option value="oval">Oval</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#D4B483', marginBottom: 4 }}>
                    Material
                  </label>
                  <select
                    value={form.frameMaterial}
                    onChange={(e) => setForm({ ...form, frameMaterial: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: 6, background: '#2A2825', border: '1px solid #3A3632', color: '#fff' }}
                  >
                    <option value="Italian Acetate">Italian Mazzucchelli Acetate</option>
                    <option value="Titanium">Aerospace Titanium</option>
                    <option value="Stainless Steel">Hypoallergenic Stainless Steel</option>
                    <option value="TR90">Ultra-Light TR90 Memory Polymer</option>
                    <option value="Mixed Metal & Acetate">Mixed Metal &amp; Acetate</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#D4B483', marginBottom: 4 }}>
                    Frame Size
                  </label>
                  <select
                    value={form.frameSize}
                    onChange={(e) => setForm({ ...form, frameSize: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: 6, background: '#2A2825', border: '1px solid #3A3632', color: '#fff' }}
                  >
                    <option value="small">Small (Narrow Face)</option>
                    <option value="medium">Medium (Standard Fit)</option>
                    <option value="large">Large (Wide Face)</option>
                  </select>
                </div>
              </div>

              {/* Financial Pricing, Cost Price & Live Profit Display */}
              <div style={{ background: '#252320', padding: '1rem', borderRadius: 8, border: '1px solid #3A3632' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#D4B483', textTransform: 'uppercase' }}>
                    Financial Economics &amp; Optical Profit Tracking
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#8FC87A', fontWeight: 700 }}>
                    Gross Profit: +₹{unitProfit.toLocaleString()} ({profitMarginPct}% Net Margin)
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: '#B8AFA8', marginBottom: 3 }}>
                      Cost of Goods Sold / Cost Price (₹)
                    </label>
                    <input
                      type="number"
                      value={form.costPrice}
                      onChange={(e) => setForm({ ...form, costPrice: parseFloat(e.target.value) || 0 })}
                      required
                      placeholder="e.g. 950"
                      style={{ width: '100%', padding: '0.6rem', borderRadius: 6, background: '#1E1C19', border: '1px solid #3A3632', color: '#fff' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: '#B8AFA8', marginBottom: 3 }}>
                      Retail MRP Base Price (₹)
                    </label>
                    <input
                      type="number"
                      value={form.basePrice}
                      onChange={(e) => setForm({ ...form, basePrice: parseFloat(e.target.value) || 0 })}
                      required
                      style={{ width: '100%', padding: '0.6rem', borderRadius: 6, background: '#1E1C19', border: '1px solid #3A3632', color: '#fff' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: '#B8AFA8', marginBottom: 3 }}>
                      Offer Selling Price (₹)
                    </label>
                    <input
                      type="number"
                      value={form.salePrice}
                      onChange={(e) => setForm({ ...form, salePrice: parseFloat(e.target.value) || 0 })}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: 6, background: '#1E1C19', border: '1px solid #3A3632', color: '#fff' }}
                    />
                  </div>
                </div>
              </div>

              {/* Multi-Angle Photography Studio */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#D4B483', textTransform: 'uppercase', marginBottom: 6 }}>
                  📸 Multi-Angle High-Definition Frame Photos
                </label>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '0.75rem' }}>
                  {/* Angle 1: Studio Front */}
                  <div>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: '#B8AFA8', marginBottom: 4 }}>
                      1. Front Shot (Straight-On)
                    </span>
                    <input
                      type="text"
                      value={form.photoFront}
                      onChange={(e) => setForm({ ...form, photoFront: e.target.value })}
                      placeholder="https://..."
                      style={{ width: '100%', padding: '0.55rem', borderRadius: 6, background: '#2A2825', border: '1px solid #3A3632', color: '#fff', fontSize: '0.75rem' }}
                    />
                    <div style={{ marginTop: 6, height: 70, borderRadius: 6, overflow: 'hidden', border: '1px solid #3A3632', background: '#16140F' }}>
                      <img src={form.photoFront} alt="Front preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e: any) => { e.target.style.display = 'none'; }} />
                    </div>
                  </div>

                  {/* Angle 2: 45 Degree Angle */}
                  <div>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: '#B8AFA8', marginBottom: 4 }}>
                      2. 45° Perspective View
                    </span>
                    <input
                      type="text"
                      value={form.photoAngle}
                      onChange={(e) => setForm({ ...form, photoAngle: e.target.value })}
                      placeholder="https://..."
                      style={{ width: '100%', padding: '0.55rem', borderRadius: 6, background: '#2A2825', border: '1px solid #3A3632', color: '#fff', fontSize: '0.75rem' }}
                    />
                    <div style={{ marginTop: 6, height: 70, borderRadius: 6, overflow: 'hidden', border: '1px solid #3A3632', background: '#16140F' }}>
                      <img src={form.photoAngle} alt="Angle preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e: any) => { e.target.style.display = 'none'; }} />
                    </div>
                  </div>

                  {/* Angle 3: Side Temple */}
                  <div>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: '#B8AFA8', marginBottom: 4 }}>
                      3. Side Temple / Hinge View
                    </span>
                    <input
                      type="text"
                      value={form.photoSide}
                      onChange={(e) => setForm({ ...form, photoSide: e.target.value })}
                      placeholder="https://..."
                      style={{ width: '100%', padding: '0.55rem', borderRadius: 6, background: '#2A2825', border: '1px solid #3A3632', color: '#fff', fontSize: '0.75rem' }}
                    />
                    <div style={{ marginTop: 6, height: 70, borderRadius: 6, overflow: 'hidden', border: '1px solid #3A3632', background: '#16140F' }}>
                      <img src={form.photoSide} alt="Side preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e: any) => { e.target.style.display = 'none'; }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#D4B483', marginBottom: 4 }}>
                  Craftsmanship &amp; Lens Fitting Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: 6, background: '#2A2825', border: '1px solid #3A3632', color: '#fff', resize: 'vertical' }}
                />
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{ background: '#2A2825', color: '#B8AFA8', border: '1px solid #3A3632', padding: '0.65rem 1.25rem', borderRadius: 6, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    background: '#D4B483',
                    color: '#1E1C19',
                    border: 'none',
                    padding: '0.65rem 1.75rem',
                    borderRadius: 6,
                    fontWeight: 700,
                    cursor: submitting ? 'not-allowed' : 'pointer',
                  }}
                >
                  {submitting ? 'Saving Frame…' : 'Save Frame into Catalog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
