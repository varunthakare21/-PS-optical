import { useState, useEffect } from 'react';
import { Boxes, Search, AlertTriangle, Plus, Minus, Filter, Store } from 'lucide-react';
import { adminAPI } from '../../services/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function AdminInventory() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [selectedStore, setSelectedStore] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [invRes, storeRes] = await Promise.all([
        adminAPI.getInventory(selectedStore || undefined),
        adminAPI.getStores(),
      ]);
      setInventory(invRes.data.data || []);
      setStores(storeRes.data.data || []);
    } catch {
      setInventory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedStore]);

  const handleAdjust = async (item: any, delta: number) => {
    const newQty = Math.max(0, item.quantityAvailable + delta);
    try {
      setUpdatingId(item._id);
      await adminAPI.updateInventory(item._id, {
        quantityAvailable: newQty,
        quantityTotal: Math.max(newQty, item.quantityTotal + delta),
      });
      setInventory((prev) =>
        prev.map((i) => (i._id === item._id ? { ...i, quantityAvailable: newQty } : i))
      );
    } catch {
      alert('Failed to update stock');
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = inventory.filter((item) => {
    const q = search.toLowerCase();
    const name = item.product?.name?.toLowerCase() || '';
    const sku = item.sku?.toLowerCase() || '';
    return name.includes(q) || sku.includes(q);
  });

  return (
    <div style={{ color: '#F6F1E8' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.85rem', margin: '0 0 0.25rem', color: '#FFFFFF' }}>
            Multi-Store Inventory &amp; Stock
          </h1>
          <p style={{ color: '#B8AFA8', margin: 0, fontSize: '0.85rem' }}>
            Global network stock counts across physical optical boutiques and central fulfillment.
          </p>
        </div>

        {/* Store Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Store size={16} style={{ color: '#D4B483' }} />
          <select
            value={selectedStore}
            onChange={(e) => setSelectedStore(e.target.value)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 6,
              background: '#1E1C19',
              border: '1px solid #3A3632',
              color: '#F6F1E8',
              fontSize: '0.85rem',
            }}
          >
            <option value="">All Boutique Locations</option>
            {stores.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
        <Search size={18} style={{ position: 'absolute', left: 14, top: 12, color: '#B8AFA8' }} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by SKU or frame name..."
          style={{
            width: '100%',
            padding: '0.75rem 1rem 0.75rem 2.5rem',
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
          <Boxes size={44} style={{ color: '#72785A', marginBottom: '1rem' }} />
          <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', color: '#FFFFFF' }}>No stock items found</h3>
        </div>
      ) : (
        <div style={{ background: '#1E1C19', borderRadius: 12, border: '1px solid #3A3632', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 700 }}>
            <thead>
              <tr style={{ background: '#2A2825', borderBottom: '1px solid #3A3632', fontSize: '0.75rem', color: '#D4B483', textTransform: 'uppercase' }}>
                <th style={{ padding: '1rem' }}>SKU / Product</th>
                <th style={{ padding: '1rem' }}>Boutique Location</th>
                <th style={{ padding: '1rem' }}>Variant</th>
                <th style={{ padding: '1rem' }}>Available Stock</th>
                <th style={{ padding: '1rem' }}>Reserved</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Adjustment</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item._id} style={{ borderBottom: '1px solid #2A2825', fontSize: '0.85rem' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 600, color: '#FFFFFF' }}>{item.product?.name || 'Frame'}</div>
                    <div style={{ fontSize: '0.75rem', color: '#D4B483', fontFamily: 'monospace' }}>{item.sku}</div>
                  </td>
                  <td style={{ padding: '1rem', color: '#B8AFA8' }}>
                    {item.store?.name || 'Flagship Store'}
                  </td>
                  <td style={{ padding: '1rem', color: '#B8AFA8' }}>
                    <span style={{ textTransform: 'capitalize' }}>{item.color}</span> / <span style={{ textTransform: 'capitalize' }}>{item.size}</span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', fontWeight: 700, color: item.quantityAvailable <= item.lowStockThreshold ? '#E88B6E' : '#FFFFFF' }}>
                      {item.quantityAvailable}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#72785A', marginLeft: 4 }}>
                      / {item.quantityTotal}
                    </span>
                    {item.quantityAvailable <= item.lowStockThreshold && (
                      <span style={{ marginLeft: 6, fontSize: '0.7rem', color: '#E88B6E', fontWeight: 600 }}>
                        (Low)
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '1rem', color: '#B8AFA8' }}>
                    {item.quantityReserved || 0}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                      <button
                        onClick={() => handleAdjust(item, -1)}
                        disabled={updatingId === item._id || item.quantityAvailable <= 0}
                        style={{ width: 26, height: 26, borderRadius: 4, background: '#2A2825', border: '1px solid #3A3632', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Minus size={12} />
                      </button>
                      <button
                        onClick={() => handleAdjust(item, 1)}
                        disabled={updatingId === item._id}
                        style={{ width: 26, height: 26, borderRadius: 4, background: '#D4B483', border: 'none', color: '#1E1C19', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
