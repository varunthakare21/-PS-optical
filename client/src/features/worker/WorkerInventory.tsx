import { useState, useEffect } from 'react';
import { Package, Search, Plus, Minus, AlertTriangle, Check, RefreshCw } from 'lucide-react';
import { workerAPI } from '../../services/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function WorkerInventory() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await workerAPI.getInventory();
      setInventory(res.data.data || []);
    } catch {
      setInventory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleAdjustStock = async (item: any, delta: number) => {
    const newQty = Math.max(0, item.quantityAvailable + delta);
    try {
      setUpdatingId(item._id);
      await workerAPI.updateInventory(item._id, {
        quantityAvailable: newQty,
        quantityTotal: Math.max(newQty, item.quantityTotal + delta),
      });
      setInventory((prev) =>
        prev.map((i) => (i._id === item._id ? { ...i, quantityAvailable: newQty } : i))
      );
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update stock');
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = inventory.filter((item) => {
    const name = item.product?.name?.toLowerCase() || '';
    const sku = item.sku?.toLowerCase() || '';
    const q = search.toLowerCase();
    return name.includes(q) || sku.includes(q);
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.85rem', color: '#30251F', margin: '0 0 0.25rem' }}>
            Store Inventory Management
          </h1>
          <p style={{ color: '#72785A', margin: 0, fontSize: '0.9rem' }}>
            Live stock counts for optical frames, prescription lenses, and display models.
          </p>
        </div>
        <button
          onClick={fetchInventory}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'white',
            border: '1px solid #D4B483',
            color: '#30251F',
            padding: '0.6rem 1rem',
            borderRadius: 6,
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: 'pointer',
          }}
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
        <Search size={18} style={{ position: 'absolute', left: 14, top: 12, color: '#A89C8C' }} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by SKU, frame name, or variant..."
          style={{
            width: '100%',
            padding: '0.75rem 1rem 0.75rem 2.5rem',
            borderRadius: 8,
            border: '1px solid #D4B483',
            background: 'white',
            fontSize: '0.95rem',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {loading ? (
        <div style={{ padding: '4rem 0', display: 'flex', justifyContent: 'center' }}>
          <LoadingSpinner size="md" />
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ background: 'white', borderRadius: 12, padding: '3.5rem 2rem', textAlign: 'center', border: '1px solid #F0EAE0' }}>
          <Package size={44} style={{ color: '#A89C8C', marginBottom: '1rem' }} />
          <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', color: '#30251F' }}>No inventory items found</h3>
          <p style={{ color: '#72785A', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            No stock entries match your query or your store has not been populated with inventory yet.
          </p>
        </div>
      ) : (
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #F0EAE0', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 640 }}>
            <thead>
              <tr style={{ background: '#F6F1E8', borderBottom: '1px solid #E8E2D8', fontSize: '0.8rem', color: '#72785A', textTransform: 'uppercase' }}>
                <th style={{ padding: '1rem' }}>Product / SKU</th>
                <th style={{ padding: '1rem' }}>Variant</th>
                <th style={{ padding: '1rem' }}>Base Price</th>
                <th style={{ padding: '1rem' }}>Available Stock</th>
                <th style={{ padding: '1rem' }}>Status</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Quick Adjust</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item._id} style={{ borderBottom: '1px solid #F0EAE0', fontSize: '0.9rem' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 600, color: '#30251F' }}>
                      {item.product?.name || 'Frame'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#72785A', fontFamily: 'monospace' }}>
                      {item.sku}
                    </div>
                  </td>
                  <td style={{ padding: '1rem', color: '#30251F' }}>
                    <span style={{ textTransform: 'capitalize' }}>{item.color}</span> / <span style={{ textTransform: 'capitalize' }}>{item.size}</span>
                  </td>
                  <td style={{ padding: '1rem', fontFamily: 'Georgia, serif', fontWeight: 600, color: '#30251F' }}>
                    ₹{item.product?.basePrice ? item.product.basePrice.toLocaleString() : 'N/A'}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 700, color: item.quantityAvailable <= item.lowStockThreshold ? '#B65E43' : '#30251F' }}>
                      {item.quantityAvailable}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#72785A', marginLeft: 4 }}>
                      / {item.quantityTotal}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {item.quantityAvailable <= item.lowStockThreshold ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#FFF3EE', color: '#B65E43', padding: '3px 8px', borderRadius: 4, fontSize: '0.75rem', fontWeight: 700 }}>
                        <AlertTriangle size={12} /> Low Stock
                      </span>
                    ) : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#E8EFE5', color: '#4A6B3D', padding: '3px 8px', borderRadius: 4, fontSize: '0.75rem', fontWeight: 700 }}>
                        <Check size={12} /> In Stock
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleAdjustStock(item, -1)}
                        disabled={updatingId === item._id || item.quantityAvailable <= 0}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 4,
                          border: '1px solid #D4B483',
                          background: 'white',
                          color: '#30251F',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Minus size={14} />
                      </button>
                      <button
                        onClick={() => handleAdjustStock(item, 1)}
                        disabled={updatingId === item._id}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 4,
                          border: '1px solid #B65E43',
                          background: '#B65E43',
                          color: 'white',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Plus size={14} />
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
