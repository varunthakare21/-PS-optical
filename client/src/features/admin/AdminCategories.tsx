import { useState, useEffect } from 'react';
import { Tag, Plus, Edit2, X, Check } from 'lucide-react';
import { adminAPI } from '../../services/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCat, setEditingCat] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    sortOrder: 1,
    isActive: true,
  });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getCategories();
      setCategories(res.data.data || []);
    } catch {
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreate = () => {
    setEditingCat(null);
    setForm({ name: '', slug: '', description: '', sortOrder: categories.length + 1, isActive: true });
    setShowModal(true);
  };

  const openEdit = (cat: any) => {
    setEditingCat(cat);
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      sortOrder: cat.sortOrder ?? 1,
      isActive: cat.isActive ?? true,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload = {
        ...form,
        slug: form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      };
      if (editingCat) {
        await adminAPI.updateCategory(editingCat._id, payload);
      } else {
        await adminAPI.createCategory(payload);
      }
      setShowModal(false);
      await fetchCategories();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save category');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ color: '#F6F1E8' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.85rem', margin: '0 0 0.25rem', color: '#FFFFFF' }}>
            Eyewear Categories
          </h1>
          <p style={{ color: '#B8AFA8', margin: 0, fontSize: '0.85rem' }}>
            Taxonomy structure for eyeglasses, sunglasses, blue-light blockers, and lenses.
          </p>
        </div>
        <button
          onClick={openCreate}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: '#D4B483',
            color: '#1E1C19',
            border: 'none',
            padding: '0.65rem 1.25rem',
            borderRadius: 6,
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer',
          }}
        >
          <Plus size={16} /> New Category
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '4rem 0', display: 'flex', justifyContent: 'center' }}>
          <LoadingSpinner size="md" />
        </div>
      ) : categories.length === 0 ? (
        <div style={{ background: '#1E1C19', borderRadius: 12, padding: '3.5rem 2rem', textAlign: 'center', border: '1px solid #3A3632' }}>
          <Tag size={44} style={{ color: '#72785A', marginBottom: '1rem' }} />
          <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', color: '#FFFFFF' }}>No categories created</h3>
        </div>
      ) : (
        <div style={{ background: '#1E1C19', borderRadius: 12, border: '1px solid #3A3632', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 600 }}>
            <thead>
              <tr style={{ background: '#2A2825', borderBottom: '1px solid #3A3632', fontSize: '0.75rem', color: '#D4B483', textTransform: 'uppercase' }}>
                <th style={{ padding: '1rem' }}>Order</th>
                <th style={{ padding: '1rem' }}>Category Name</th>
                <th style={{ padding: '1rem' }}>Slug</th>
                <th style={{ padding: '1rem' }}>Status</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat._id} style={{ borderBottom: '1px solid #2A2825', fontSize: '0.85rem' }}>
                  <td style={{ padding: '1rem', color: '#D4B483', fontWeight: 700 }}>
                    #{cat.sortOrder}
                  </td>
                  <td style={{ padding: '1rem', fontWeight: 600, color: '#FFFFFF' }}>
                    {cat.name}
                  </td>
                  <td style={{ padding: '1rem', color: '#B8AFA8', fontFamily: 'monospace' }}>
                    /{cat.slug}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: 4,
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        background: cat.isActive ? '#273822' : '#3D281F',
                        color: cat.isActive ? '#8FC87A' : '#E88B6E',
                      }}
                    >
                      {cat.isActive ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <button
                      onClick={() => openEdit(cat)}
                      style={{
                        background: '#2A2825',
                        border: '1px solid #3A3632',
                        color: '#D4B483',
                        padding: '0.4rem 0.6rem',
                        borderRadius: 4,
                        cursor: 'pointer',
                      }}
                    >
                      <Edit2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#1E1C19', border: '1px solid #3A3632', borderRadius: 12, padding: '2rem', width: '100%', maxWidth: 480, color: '#F6F1E8' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', color: '#FFFFFF', margin: 0 }}>
                {editingCat ? 'Edit Category' : 'Create Category'}
              </h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#B8AFA8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#D4B483', marginBottom: 4 }}>Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  style={{ width: '100%', padding: '0.65rem', borderRadius: 6, background: '#2A2825', border: '1px solid #3A3632', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#D4B483', marginBottom: 4 }}>Slug (URL path)</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="e.g. computer-glasses"
                  style={{ width: '100%', padding: '0.65rem', borderRadius: 6, background: '#2A2825', border: '1px solid #3A3632', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#D4B483', marginBottom: 4 }}>Display Order</label>
                <input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 1 })}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: 6, background: '#2A2825', border: '1px solid #3A3632', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
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
                  style={{ background: '#D4B483', color: '#1E1C19', border: 'none', padding: '0.65rem 1.75rem', borderRadius: 6, fontWeight: 700, cursor: 'pointer' }}
                >
                  {submitting ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
