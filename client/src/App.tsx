import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import LoadingSpinner from './components/ui/LoadingSpinner';
import { AuthProvider } from './features/auth/AuthContext';
import { CartProvider } from './features/cart/CartContext';
import ProtectedRoute from './features/auth/ProtectedRoute';
import { Toaster } from './components/ui/Toaster';

// Public pages
const HomePage = lazy(() => import('./pages/HomePage'));
const EyeglassesPage = lazy(() => import('./pages/EyeglassesPage'));
const SunglassesPage = lazy(() => import('./pages/SunglassesPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const OrderConfirmationPage = lazy(() => import('./pages/OrderConfirmationPage'));
const StoreLocatorPage = lazy(() => import('./pages/StoreLocatorPage'));
const VirtualTryOnPage = lazy(() => import('./pages/VirtualTryOnPage'));
const AppointmentPage = lazy(() => import('./pages/AppointmentPage'));
const TryAtHomePage = lazy(() => import('./pages/TryAtHomePage'));
const FrameFinderPage = lazy(() => import('./pages/FrameFinderPage'));
const OffersPage = lazy(() => import('./pages/OffersPage'));

// Auth pages
const CustomerLogin = lazy(() => import('./features/auth/pages/CustomerLogin'));
const CustomerRegister = lazy(() => import('./features/auth/pages/CustomerRegister'));
const CustomerForgotPassword = lazy(() => import('./features/auth/pages/CustomerForgotPassword'));
const CustomerResetPassword = lazy(() => import('./features/auth/pages/CustomerResetPassword'));
const CustomerVerifyEmail = lazy(() => import('./features/auth/pages/CustomerVerifyEmail'));
const WorkerLogin = lazy(() => import('./features/auth/pages/WorkerLogin'));
const WorkerForgotPassword = lazy(() => import('./features/auth/pages/WorkerForgotPassword'));
const WorkerResetPassword = lazy(() => import('./features/auth/pages/WorkerResetPassword'));
const AdminLogin = lazy(() => import('./features/auth/pages/AdminLogin'));
const AdminRegister = lazy(() => import('./features/auth/pages/AdminRegister'));
const AdminForgotPassword = lazy(() => import('./features/auth/pages/AdminForgotPassword'));
const AdminResetPassword = lazy(() => import('./features/auth/pages/AdminResetPassword'));

// Customer dashboard
const CustomerDashboard = lazy(() => import('./features/customer/CustomerDashboard'));
const CustomerFrames = lazy(() => import('./features/customer/CustomerFrames'));
const CustomerOrders = lazy(() => import('./features/customer/CustomerOrders'));
const CustomerOrderDetail = lazy(() => import('./features/customer/CustomerOrderDetail'));
const CustomerWishlist = lazy(() => import('./features/customer/CustomerWishlist'));
const CustomerProfile = lazy(() => import('./features/customer/CustomerProfile'));
const CustomerPrescriptions = lazy(() => import('./features/customer/CustomerPrescriptions'));
const CustomerAppointments = lazy(() => import('./features/customer/CustomerAppointments'));
const CustomerReturns = lazy(() => import('./features/customer/CustomerReturns'));
const CustomerSupport = lazy(() => import('./features/customer/CustomerSupport'));

// Worker dashboard
const WorkerDashboard = lazy(() => import('./features/worker/WorkerDashboard'));
const WorkerInventory = lazy(() => import('./features/worker/WorkerInventory'));
const WorkerAppointments = lazy(() => import('./features/worker/WorkerAppointments'));
const WorkerProfile = lazy(() => import('./features/worker/WorkerProfile'));

// Admin dashboard
const AdminDashboard = lazy(() => import('./features/admin/AdminDashboard'));
const AdminProducts = lazy(() => import('./features/admin/AdminProducts'));
const AdminOrders = lazy(() => import('./features/admin/AdminOrders'));
const AdminCustomers = lazy(() => import('./features/admin/AdminCustomers'));
const AdminWorkers = lazy(() => import('./features/admin/AdminWorkers'));
const AdminStores = lazy(() => import('./features/admin/AdminStores'));
const AdminInventory = lazy(() => import('./features/admin/AdminInventory'));
const AdminAppointments = lazy(() => import('./features/admin/AdminAppointments'));
const AdminReturns = lazy(() => import('./features/admin/AdminReturns'));
const AdminReviews = lazy(() => import('./features/admin/AdminReviews'));
const AdminCoupons = lazy(() => import('./features/admin/AdminCoupons'));
const AdminAuditLogs = lazy(() => import('./features/admin/AdminAuditLogs'));
const AdminCategories = lazy(() => import('./features/admin/AdminCategories'));
const AdminComplaints = lazy(() => import('./features/admin/AdminComplaints'));
const AdminBookings = lazy(() => import('./features/admin/AdminBookings'));

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Toaster>
            <Suspense fallback={<LoadingSpinner fullScreen />}>
              <Routes>
                {/* Public */}
                <Route element={<MainLayout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/eyeglasses" element={<EyeglassesPage />} />
                  <Route path="/sunglasses" element={<SunglassesPage />} />
                  <Route path="/products/:slug" element={<ProductDetailPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/store-locator" element={<StoreLocatorPage />} />
                  <Route path="/virtual-try-on" element={<VirtualTryOnPage />} />
                  <Route path="/frame-finder" element={<FrameFinderPage />} />
                  <Route path="/offers" element={<OffersPage />} />
                  <Route path="/appointment" element={<AppointmentPage />} />
                  <Route path="/try-at-home" element={<TryAtHomePage />} />
                </Route>

                {/* Checkout - customer only */}
                <Route element={<ProtectedRoute allowedRoles={['customer']} redirectTo="/customer/login" />}>
                  <Route element={<MainLayout />}>
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/order-confirmation/:id" element={<OrderConfirmationPage />} />
                  </Route>
                </Route>

                {/* Customer Auth */}
                <Route element={<AuthLayout role="customer" />}>
                  <Route path="/customer/login" element={<CustomerLogin />} />
                  <Route path="/customer/register" element={<CustomerRegister />} />
                  <Route path="/customer/forgot-password" element={<CustomerForgotPassword />} />
                  <Route path="/customer/reset-password/:token" element={<CustomerResetPassword />} />
                  <Route path="/customer/verify-email/:token" element={<CustomerVerifyEmail />} />
                </Route>

                {/* Customer Dashboard */}
                <Route element={<ProtectedRoute allowedRoles={['customer']} redirectTo="/customer/login" />}>
                  <Route element={<DashboardLayout role="customer" />}>
                    <Route path="/customer/dashboard" element={<CustomerDashboard />} />
                    <Route path="/customer/frames" element={<CustomerFrames />} />
                    <Route path="/customer/orders" element={<CustomerOrders />} />
                    <Route path="/customer/orders/:id" element={<CustomerOrderDetail />} />
                    <Route path="/customer/wishlist" element={<CustomerWishlist />} />
                    <Route path="/customer/profile" element={<CustomerProfile />} />
                    <Route path="/customer/prescriptions" element={<CustomerPrescriptions />} />
                    <Route path="/customer/appointments" element={<CustomerAppointments />} />
                    <Route path="/customer/returns" element={<CustomerReturns />} />
                    <Route path="/customer/support" element={<CustomerSupport />} />
                  </Route>
                </Route>

                {/* Worker Auth */}
                <Route element={<AuthLayout role="worker" />}>
                  <Route path="/worker/login" element={<WorkerLogin />} />
                  <Route path="/worker/forgot-password" element={<WorkerForgotPassword />} />
                  <Route path="/worker/reset-password/:token" element={<WorkerResetPassword />} />
                </Route>

                {/* Worker Dashboard */}
                <Route element={<ProtectedRoute allowedRoles={['worker']} redirectTo="/worker/login" />}>
                  <Route element={<DashboardLayout role="worker" />}>
                    <Route path="/worker/dashboard" element={<WorkerDashboard />} />
                    <Route path="/worker/inventory" element={<WorkerInventory />} />
                    <Route path="/worker/appointments" element={<WorkerAppointments />} />
                    <Route path="/worker/profile" element={<WorkerProfile />} />
                  </Route>
                </Route>

                {/* Admin Auth */}
                <Route element={<AuthLayout role="admin" />}>
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin/register" element={<AdminRegister />} />
                  <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
                  <Route path="/admin/reset-password/:token" element={<AdminResetPassword />} />
                </Route>

                {/* Admin Dashboard */}
                <Route element={<ProtectedRoute allowedRoles={['admin']} redirectTo="/admin/login" />}>
                  <Route element={<DashboardLayout role="admin" />}>
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/products" element={<AdminProducts />} />
                    <Route path="/admin/bookings" element={<AdminBookings />} />
                    <Route path="/admin/complaints" element={<AdminComplaints />} />
                    <Route path="/admin/categories" element={<AdminCategories />} />
                    <Route path="/admin/orders" element={<AdminOrders />} />
                    <Route path="/admin/customers" element={<AdminCustomers />} />
                    <Route path="/admin/workers" element={<AdminWorkers />} />
                    <Route path="/admin/stores" element={<AdminStores />} />
                    <Route path="/admin/inventory" element={<AdminInventory />} />
                    <Route path="/admin/appointments" element={<AdminAppointments />} />
                    <Route path="/admin/returns" element={<AdminReturns />} />
                    <Route path="/admin/reviews" element={<AdminReviews />} />
                    <Route path="/admin/coupons" element={<AdminCoupons />} />
                    <Route path="/admin/audit-logs" element={<AdminAuditLogs />} />
                  </Route>
                </Route>
              </Routes>
            </Suspense>
          </Toaster>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
