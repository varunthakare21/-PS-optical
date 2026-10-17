import { useState, useEffect } from 'react';
import { ShoppingBag, Eye, Truck, CheckCircle2, Clock, AlertCircle, ChevronDown, Filter } from 'lucide-react';
import { adminAPI } from '../../services/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params: any = { page };
      if (statusFilter) params.status = statusFilter;
      const res = await adminAPI.getOrders(params);
      setOrders(res.data.data || []);
      if (res.data.pagination) setTotalPages(res.data.pagination.pages || 1);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter]);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      setUpdatingId(id);
      await adminAPI.updateOrderStatus(id, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, status: newStatus } : o))
      );
      if (selectedOrder && selectedOrder._id === id) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch {
      alert('Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div style={{ color: '#F6F1E8' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.85rem', margin: '0 0 0.25rem', color: '#FFFFFF' }}>
            Customer Orders &amp; Fulfillment
          </h1>
          <p style={{ color: '#B8AFA8', margin: 0, fontSize: '0.85rem' }}>
            Order processing, lens lab grinding progress, and dispatch tracking.
          </p>
        </div>

        {/* Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={16} style={{ color: '#D4B483' }} />
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 6,
              background: '#1E1C19',
              border: '1px solid #3A3632',
              color: '#F6F1E8',
              fontSize: '0.85rem',
            }}
          >
            <option value="">All Statuses</option>
            <option value="pending_payment">Pending Payment</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing in Lab</option>
            <option value="ready_for_dispatch">Ready for Dispatch</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '4rem 0', display: 'flex', justifyContent: 'center' }}>
          <LoadingSpinner size="md" />
        </div>
      ) : orders.length === 0 ? (
        <div style={{ background: '#1E1C19', borderRadius: 12, padding: '3.5rem 2rem', textAlign: 'center', border: '1px solid #3A3632' }}>
          <ShoppingBag size={44} style={{ color: '#72785A', marginBottom: '1rem' }} />
          <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', color: '#FFFFFF' }}>No orders found</h3>
        </div>
      ) : (
        <div style={{ background: '#1E1C19', borderRadius: 12, border: '1px solid #3A3632', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 720 }}>
            <thead>
              <tr style={{ background: '#2A2825', borderBottom: '1px solid #3A3632', fontSize: '0.75rem', color: '#D4B483', textTransform: 'uppercase' }}>
                <th style={{ padding: '1rem' }}>Order #</th>
                <th style={{ padding: '1rem' }}>Customer</th>
                <th style={{ padding: '1rem' }}>Total</th>
                <th style={{ padding: '1rem' }}>Payment</th>
                <th style={{ padding: '1rem' }}>Fulfillment Status</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Details</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((ord) => (
                <tr key={ord._id} style={{ borderBottom: '1px solid #2A2825', fontSize: '0.85rem' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 600, color: '#FFFFFF' }}>#{ord.orderNumber}</div>
                    <div style={{ fontSize: '0.75rem', color: '#B8AFA8' }}>{new Date(ord.createdAt).toLocaleDateString()}</div>
                  </td>
                  <td style={{ padding: '1rem', color: '#FFFFFF' }}>
                    {ord.customer?.name || ord.shippingAddress?.name || 'Customer'}
                    <div style={{ fontSize: '0.75rem', color: '#B8AFA8' }}>{ord.shippingAddress?.city}</div>
                  </td>
                  <td style={{ padding: '1rem', fontFamily: 'Georgia, serif', fontWeight: 700, color: '#D4B483' }}>
                    ₹{ord.total?.toLocaleString()}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span
                      style={{
                        padding: '2px 6px',
                        borderRadius: 4,
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        background: ord.paymentStatus === 'paid' ? '#273822' : '#3D281F',
                        color: ord.paymentStatus === 'paid' ? '#8FC87A' : '#E88B6E',
                      }}
                    >
                      {ord.paymentStatus}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <select
                      value={ord.status}
                      disabled={updatingId === ord._id}
                      onChange={(e) => handleStatusUpdate(ord._id, e.target.value)}
                      style={{
                        padding: '0.35rem 0.65rem',
                        borderRadius: 4,
                        background: '#2A2825',
                        border: '1px solid #3A3632',
                        color: '#F6F1E8',
                        fontSize: '0.8rem',
                      }}
                    >
                      <option value="pending_payment">Pending Payment</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing in Lab</option>
                      <option value="ready_for_dispatch">Ready for Dispatch</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <button
                      onClick={() => setSelectedOrder(ord)}
                      style={{
                        background: '#2A2825',
                        border: '1px solid #3A3632',
                        color: '#D4B483',
                        padding: '0.4rem 0.75rem',
                        borderRadius: 4,
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <Eye size={12} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#1E1C19', border: '1px solid #3A3632', borderRadius: 12, padding: '2rem', width: '100%', maxWidth: 560, color: '#F6F1E8', maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #3A3632', paddingBottom: '0.75rem' }}>
              <div>
                <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', color: '#FFFFFF', margin: 0 }}>
                  Order #{selectedOrder.orderNumber}
                </h2>
                <span style={{ fontSize: '0.75rem', color: '#B8AFA8' }}>{new Date(selectedOrder.createdAt).toLocaleString()}</span>
              </div>
              <button onClick={() => setSelectedOrder(null)} style={{ background: 'none', border: 'none', color: '#B8AFA8', cursor: 'pointer', fontSize: '1.25rem' }}>&times;</button>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <h4 style={{ color: '#D4B483', margin: '0 0 0.5rem', fontSize: '0.85rem', textTransform: 'uppercase' }}>Items Ordered</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {selectedOrder.items?.map((item: any, i: number) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: '#2A2825', borderRadius: 6, fontSize: '0.85rem' }}>
                    <div>
                      <strong>{item.name || 'Frame'}</strong> ({item.color} / {item.size})
                      {item.lensType && <div style={{ fontSize: '0.75rem', color: '#D4B483' }}>Lens: {item.lensType}</div>}
                    </div>
                    <div>{item.quantity} &times; ₹{item.unitPrice}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <h4 style={{ color: '#D4B483', margin: '0 0 0.5rem', fontSize: '0.85rem', textTransform: 'uppercase' }}>Delivery Address</h4>
              <div style={{ padding: '0.75rem', background: '#2A2825', borderRadius: 6, fontSize: '0.85rem', color: '#B8AFA8' }}>
                <div><strong>{selectedOrder.shippingAddress?.name}</strong></div>
                <div>{selectedOrder.shippingAddress?.street}</div>
                <div>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.pincode}</div>
                <div>Phone: {selectedOrder.shippingAddress?.phone}</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #3A3632', paddingTop: '1rem' }}>
              <span style={{ fontWeight: 600 }}>Total Order Value:</span>
              <span style={{ fontFamily: 'Georgia, serif', fontSize: '1.35rem', fontWeight: 700, color: '#D4B483' }}>
                ₹{selectedOrder.total?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
