import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, ShoppingBag, Package, DollarSign, Clock, ArrowUpRight,
  TrendingUp, AlertCircle, Eye, CheckCircle2, ChevronRight,
  MessageSquare, Calendar, Percent, ShieldAlert, Sparkles, Building2
} from 'lucide-react';
import { adminAPI } from '../../services/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getAnalytics()
      .then((res) => setData(res.data.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '4rem 0', display: 'flex', justifyContent: 'center' }}>
        <LoadingSpinner size="md" />
      </div>
    );
  }

  const {
    totalCustomers = 0,
    totalOrders = 0,
    totalProducts = 0,
    totalRevenue = 0,
    cogs = 0,
    netProfit = 0,
    profitMargin = 64.2,
    averageOrderValue = 0,
    totalComplaints = 0,
    openComplaints = 0,
    totalBookings = 0,
    salesTrend = [],
    recentComplaints = [],
    recentTryAtHome = [],
    recentOrders = [],
  } = data || {};

  const maxSale = Math.max(...salesTrend.map((s: any) => s.sales || 0), 100000);

  return (
    <div style={{ color: '#F6F1E8' }}>
      {/* Page Title & Quick Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#D4B483', color: '#1E1C19', fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 4, marginBottom: '0.5rem' }}>
            <Building2 size={12} /> Bhandara Flagship &bull; Maharashtra Statewide Operations
          </div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '2.15rem', margin: 0, color: '#FFFFFF' }}>
            PS OPTICAL Executive Control Center
          </h1>
          <p style={{ color: '#B8AFA8', margin: '0.35rem 0 0', fontSize: '0.85rem' }}>
            Live status of sales, net optical profit, customer grievance redressal, and frame bookings.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link
            to="/admin/products"
            style={{
              background: '#D4B483',
              color: '#1E1C19',
              padding: '0.65rem 1.25rem',
              borderRadius: 6,
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '0.85rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Package size={16} /> Add / Manage Frames
          </Link>
          <Link
            to="/admin/complaints"
            style={{
              background: openComplaints > 0 ? '#4A1D1D' : '#2A2825',
              color: openComplaints > 0 ? '#FFA07A' : '#F6F1E8',
              border: `1px solid ${openComplaints > 0 ? '#FF6B6B' : '#3A3632'}`,
              padding: '0.65rem 1.25rem',
              borderRadius: 6,
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.85rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <AlertCircle size={16} /> Complaints {openComplaints > 0 && `(${openComplaints} Open)`}
          </Link>
          <Link
            to="/admin/bookings"
            style={{
              background: '#2A2825',
              color: '#F6F1E8',
              border: '1px solid #3A3632',
              padding: '0.65rem 1.25rem',
              borderRadius: 6,
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.85rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Calendar size={16} /> Frame Bookings
          </Link>
        </div>
      </div>

      {/* Primary Financial & Profit Performance Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        {/* Gross Revenue */}
        <div style={{ background: '#1E1C19', borderRadius: 12, padding: '1.5rem', border: '1px solid #3A3632' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.82rem', color: '#B8AFA8', fontWeight: 600 }}>Total Sales Revenue</span>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: '#2A2825', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D4B483' }}>
              <DollarSign size={18} />
            </div>
          </div>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: '1.9rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.4rem' }}>
            ₹{totalRevenue.toLocaleString()}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem' }}>
            <span style={{ color: '#8FC87A', fontWeight: 700 }}>+18.4%</span>
            <span style={{ color: '#8F857B' }}>across Maharashtra orders</span>
          </div>
        </div>

        {/* Net Profit */}
        <div style={{ background: '#1E1C19', borderRadius: 12, padding: '1.5rem', border: '1px solid #8FC87A33' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.82rem', color: '#8FC87A', fontWeight: 600 }}>Net Gross Profit</span>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: '#273822', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8FC87A' }}>
              <TrendingUp size={18} />
            </div>
          </div>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: '1.9rem', fontWeight: 700, color: '#8FC87A', marginBottom: '0.4rem' }}>
            ₹{netProfit.toLocaleString()}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem' }}>
            <span style={{ color: '#D4B483', fontWeight: 700 }}>{profitMargin}% margin</span>
            <span style={{ color: '#8F857B' }}>COGS: ₹{cogs.toLocaleString()}</span>
          </div>
        </div>

        {/* Customer Grievance / Complaints Status */}
        <div style={{ background: '#1E1C19', borderRadius: 12, padding: '1.5rem', border: openComplaints > 0 ? '1px solid #FF6B6B55' : '1px solid #3A3632' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.82rem', color: openComplaints > 0 ? '#FFA07A' : '#B8AFA8', fontWeight: 600 }}>Customer Complaints</span>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: openComplaints > 0 ? '#4A1D1D' : '#2A2825', display: 'flex', alignItems: 'center', justifyContent: 'center', color: openComplaints > 0 ? '#FFA07A' : '#D4B483' }}>
              <MessageSquare size={18} />
            </div>
          </div>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: '1.9rem', fontWeight: 700, color: openComplaints > 0 ? '#FFA07A' : '#FFFFFF', marginBottom: '0.4rem' }}>
            {openComplaints} <span style={{ fontSize: '1rem', color: '#B8AFA8', fontWeight: 400 }}>Open / {totalComplaints} Total</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem' }}>
            <Link to="/admin/complaints" style={{ color: '#D4B483', textDecoration: 'underline', fontWeight: 600 }}>
              Resolve Customer Grievances &rarr;
            </Link>
          </div>
        </div>

        {/* Frame Bookings Status */}
        <div style={{ background: '#1E1C19', borderRadius: 12, padding: '1.5rem', border: '1px solid #3A3632' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.82rem', color: '#B8AFA8', fontWeight: 600 }}>Frame Bookings &amp; Trials</span>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: '#2A2825', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D4B483' }}>
              <Calendar size={18} />
            </div>
          </div>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: '1.9rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.4rem' }}>
            {totalBookings}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem' }}>
            <span style={{ color: '#D4B483', fontWeight: 600 }}>Try-at-Home &amp; In-Store</span>
            <span style={{ color: '#8F857B' }}>Bhandara &amp; MH</span>
          </div>
        </div>
      </div>

      {/* Visual Comparative Trend: Sales vs Net Profit */}
      <div style={{ background: '#1E1C19', borderRadius: 12, padding: '1.75rem', border: '1px solid #3A3632', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', color: '#FFFFFF', margin: 0 }}>
              Monthly Sales vs Net Profit Performance
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#B8AFA8', margin: '0.25rem 0 0' }}>
              Realized margin progression across prescription spectacles, sunglasses, and custom lens fittings.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.8rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <div style={{ width: 12, height: 12, background: '#D4B483', borderRadius: 3 }} />
              <span style={{ color: '#F6F1E8' }}>Gross Sales</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <div style={{ width: 12, height: 12, background: '#8FC87A', borderRadius: 3 }} />
              <span style={{ color: '#F6F1E8' }}>Net Profit (~64%)</span>
            </div>
          </div>
        </div>

        {/* Visual Bar Chart */}
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${salesTrend.length || 6}, 1fr)`, gap: '1rem', alignItems: 'flex-end', height: 180, paddingTop: '1.5rem', borderBottom: '1px solid #3A3632', paddingBottom: '0.5rem' }}>
          {salesTrend.map((item: any, idx: number) => {
            const saleHeight = Math.max(Math.round((item.sales / maxSale) * 140), 16);
            const profitHeight = Math.max(Math.round((item.profit / maxSale) * 140), 10);
            return (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 140 }}>
                  {/* Sales bar */}
                  <div
                    title={`Sales: ₹${item.sales.toLocaleString()}`}
                    style={{
                      width: 24,
                      height: `${saleHeight}px`,
                      background: '#D4B483',
                      borderRadius: '4px 4px 0 0',
                      transition: 'height 0.3s ease',
                    }}
                  />
                  {/* Profit bar */}
                  <div
                    title={`Profit: ₹${item.profit.toLocaleString()}`}
                    style={{
                      width: 24,
                      height: `${profitHeight}px`,
                      background: '#8FC87A',
                      borderRadius: '4px 4px 0 0',
                      transition: 'height 0.3s ease',
                    }}
                  />
                </div>
                <span style={{ fontSize: '0.78rem', color: '#B8AFA8', fontWeight: 600 }}>{item.month}</span>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', fontSize: '0.75rem', color: '#8F857B' }}>
          <span>Average Order Value: <strong style={{ color: '#D4B483' }}>₹{averageOrderValue.toLocaleString()}</strong></span>
          <span>Boutique Optical Margin: <strong style={{ color: '#8FC87A' }}>{profitMargin}% Net</strong></span>
          <span>Fulfillment: <strong style={{ color: '#FFFFFF' }}>Flagship Bhandara &amp; Statewide MH</strong></span>
        </div>
      </div>

      {/* Split Section: Customer Complaints Table & Frame Bookings */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
        {/* Customer Complaints Section */}
        <div style={{ background: '#1E1C19', borderRadius: 12, padding: '1.75rem', border: '1px solid #3A3632' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <MessageSquare size={18} color="#D4B483" />
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.2rem', color: '#FFFFFF', margin: 0 }}>
                Customer Complaints &amp; Grievances
              </h2>
            </div>
            <Link to="/admin/complaints" style={{ color: '#D4B483', fontSize: '0.82rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 3, fontWeight: 600 }}>
              Full Desk <ChevronRight size={14} />
            </Link>
          </div>

          {recentComplaints.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', background: '#2A2825', borderRadius: 8 }}>
              <CheckCircle2 size={32} color="#8FC87A" style={{ marginBottom: 6 }} />
              <p style={{ color: '#F6F1E8', margin: 0, fontSize: '0.85rem' }}>No pending customer complaints!</p>
              <span style={{ color: '#8F857B', fontSize: '0.75rem' }}>All inquiries resolved satisfactorily.</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recentComplaints.slice(0, 4).map((ticket: any) => (
                <div
                  key={ticket._id}
                  style={{
                    padding: '0.85rem 1rem',
                    background: '#2A2825',
                    borderRadius: 8,
                    border: '1px solid #3A3632',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ minWidth: 0, flex: 1, marginRight: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                      <span style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: '#D4B483', fontWeight: 700 }}>
                        #{ticket.ticketNumber}
                      </span>
                      <span
                        style={{
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          padding: '1px 5px',
                          borderRadius: 3,
                          background: ticket.priority === 'urgent' ? '#4A1D1D' : '#3D341F',
                          color: ticket.priority === 'urgent' ? '#FF6B6B' : '#D4B483',
                        }}
                      >
                        {ticket.priority}
                      </span>
                    </div>
                    <div style={{ fontWeight: 600, color: '#FFFFFF', fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {ticket.subject}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#B8AFA8', marginTop: 2 }}>
                      {ticket.customer?.name} &bull; {ticket.category}
                    </div>
                  </div>
                  <Link
                    to="/admin/complaints"
                    style={{
                      background: '#1E1C19',
                      border: '1px solid #3A3632',
                      color: '#D4B483',
                      padding: '0.4rem 0.75rem',
                      borderRadius: 6,
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      textDecoration: 'none',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Reply
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Frame Bookings (Try-at-Home & Appointments) */}
        <div style={{ background: '#1E1C19', borderRadius: 12, padding: '1.75rem', border: '1px solid #3A3632' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Calendar size={18} color="#D4B483" />
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.2rem', color: '#FFFFFF', margin: 0 }}>
                Frame Bookings (Try-at-Home)
              </h2>
            </div>
            <Link to="/admin/bookings" style={{ color: '#D4B483', fontSize: '0.82rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 3, fontWeight: 600 }}>
              All Bookings <ChevronRight size={14} />
            </Link>
          </div>

          {recentTryAtHome.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', background: '#2A2825', borderRadius: 8 }}>
              <Package size={32} color="#D4B483" style={{ marginBottom: 6 }} />
              <p style={{ color: '#F6F1E8', margin: 0, fontSize: '0.85rem' }}>No active home trials booked.</p>
              <span style={{ color: '#8F857B', fontSize: '0.75rem' }}>Clients can book frame trials across Maharashtra.</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recentTryAtHome.slice(0, 4).map((b: any) => (
                <div
                  key={b._id}
                  style={{
                    padding: '0.85rem 1rem',
                    background: '#2A2825',
                    borderRadius: 8,
                    border: '1px solid #3A3632',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, color: '#FFFFFF', fontSize: '0.85rem' }}>
                      {b.customer?.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#D4B483', marginTop: 2 }}>
                      📍 {b.address?.city || 'Bhandara'}, Maharashtra &bull; {new Date(b.date).toLocaleDateString()} ({b.timeSlot})
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#8F857B', marginTop: 2 }}>
                      Frames requested: {b.products?.length || 1} SKUs
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      padding: '2px 7px',
                      borderRadius: 4,
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

      {/* Recent Orders & Operations Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '2rem' }}>
        {/* Recent Orders */}
        <div style={{ background: '#1E1C19', borderRadius: 12, padding: '1.75rem', border: '1px solid #3A3632' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', color: '#FFFFFF', margin: 0 }}>
              Recent Optical Orders
            </h2>
            <Link to="/admin/orders" style={{ color: '#D4B483', fontSize: '0.85rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 2 }}>
              View All <ChevronRight size={14} />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p style={{ color: '#B8AFA8', fontSize: '0.9rem', textAlign: 'center', padding: '2rem' }}>No orders recorded yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {recentOrders.map((ord: any) => (
                <div
                  key={ord._id}
                  style={{
                    padding: '1rem',
                    background: '#2A2825',
                    borderRadius: 8,
                    border: '1px solid #3A3632',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, color: '#FFFFFF', fontSize: '0.9rem' }}>
                      #{ord.orderNumber}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#B8AFA8', marginTop: 2 }}>
                      {ord.customer?.name || 'Customer'} &bull; {new Date(ord.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'Georgia, serif', fontWeight: 700, color: '#D4B483', fontSize: '1rem' }}>
                      ₹{ord.total?.toLocaleString()}
                    </div>
                    <span
                      style={{
                        display: 'inline-block',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        padding: '2px 6px',
                        borderRadius: 4,
                        background: ord.status === 'delivered' ? '#273822' : '#3D281F',
                        color: ord.status === 'delivered' ? '#8FC87A' : '#E88B6E',
                        marginTop: 4,
                      }}
                    >
                      {ord.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Omnichannel Operations */}
        <div style={{ background: '#1E1C19', borderRadius: 12, padding: '1.75rem', border: '1px solid #3A3632' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', color: '#FFFFFF', margin: '0 0 1.5rem' }}>
            Flagship &amp; Network Control
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <Link
              to="/admin/products"
              style={{
                background: '#2A2825',
                border: '1px solid #3A3632',
                borderRadius: 8,
                padding: '1.25rem',
                textDecoration: 'none',
                color: '#F6F1E8',
                display: 'block',
              }}
            >
              <Package size={22} style={{ color: '#D4B483', marginBottom: '0.5rem' }} />
              <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Manual Frame Setup</div>
              <div style={{ fontSize: '0.75rem', color: '#B8AFA8', marginTop: 4 }}>Add frames, photo gallery &amp; cost tracking</div>
            </Link>

            <Link
              to="/admin/complaints"
              style={{
                background: '#2A2825',
                border: '1px solid #3A3632',
                borderRadius: 8,
                padding: '1.25rem',
                textDecoration: 'none',
                color: '#F6F1E8',
                display: 'block',
              }}
            >
              <MessageSquare size={22} style={{ color: '#D4B483', marginBottom: '0.5rem' }} />
              <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Customer Grievances</div>
              <div style={{ fontSize: '0.75rem', color: '#B8AFA8', marginTop: 4 }}>Review complaints &amp; dispatch replies</div>
            </Link>

            <Link
              to="/admin/stores"
              style={{
                background: '#2A2825',
                border: '1px solid #3A3632',
                borderRadius: 8,
                padding: '1.25rem',
                textDecoration: 'none',
                color: '#F6F1E8',
                display: 'block',
              }}
            >
              <Building2 size={22} style={{ color: '#D4B483', marginBottom: '0.5rem' }} />
              <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Bhandara Boutique</div>
              <div style={{ fontSize: '0.75rem', color: '#B8AFA8', marginTop: 4 }}>Near Post Office, Bhandara - 441904</div>
            </Link>

            <Link
              to="/admin/audit-logs"
              style={{
                background: '#2A2825',
                border: '1px solid #3A3632',
                borderRadius: 8,
                padding: '1.25rem',
                textDecoration: 'none',
                color: '#F6F1E8',
                display: 'block',
              }}
            >
              <TrendingUp size={22} style={{ color: '#D4B483', marginBottom: '0.5rem' }} />
              <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Audit Trail</div>
              <div style={{ fontSize: '0.75rem', color: '#B8AFA8', marginTop: 4 }}>Review administrative access logs</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
