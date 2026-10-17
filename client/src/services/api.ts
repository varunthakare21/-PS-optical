import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ps_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('ps_token');
      localStorage.removeItem('ps_user');
      const path = window.location.pathname;
      if (path.startsWith('/admin')) window.location.href = '/admin/login';
      else if (path.startsWith('/worker')) window.location.href = '/worker/login';
      else if (path.startsWith('/customer/dashboard')) window.location.href = '/customer/login';
    }
    return Promise.reject(error);
  }
);

export default api;

export const authAPI = {
  customerRegister: (data: any) => api.post('/auth/customer/register', data),
  customerLogin: (data: any) => api.post('/auth/customer/login', data),
  workerLogin: (data: any) => api.post('/auth/worker/login', data),
  adminLogin: (data: any) => api.post('/auth/admin/login', data),
  adminRegister: (data: any) => api.post('/auth/admin/register', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  customerForgotPassword: (email: string) => api.post('/auth/customer/forgot-password', { email }),
  workerForgotPassword: (email: string) => api.post('/auth/worker/forgot-password', { email }),
  adminForgotPassword: (email: string) => api.post('/auth/admin/forgot-password', { email }),
  resetPassword: (token: string, password: string) => api.post(`/auth/reset-password/${token}`, { password }),
  verifyEmail: (token: string) => api.get(`/auth/customer/verify-email/${token}`),
};

export const productsAPI = {
  getProducts: (params?: any) => api.get('/products', { params }),
  getProduct: (slug: string) => api.get(`/products/${slug}`),
  getFeatured: () => api.get('/products/featured'),
  getBestsellers: () => api.get('/products/bestsellers'),
  getNewArrivals: () => api.get('/products/new-arrivals'),
  search: (q: string) => api.get('/products/search', { params: { q } }),
};

export const categoriesAPI = { getAll: () => api.get('/categories') };
export const cartAPI = {
  getCart: () => api.get('/cart'),
  addItem: (data: any) => api.post('/cart/items', data),
  updateItem: (itemId: string, data: any) => api.patch(`/cart/items/${itemId}`, data),
  removeItem: (itemId: string) => api.delete(`/cart/items/${itemId}`),
  clearCart: () => api.delete('/cart'),
  applyCoupon: (data: any) => api.post('/cart/coupon', data),
};
export const wishlistAPI = {
  getWishlist: () => api.get('/wishlist'),
  add: (productId: string) => api.post(`/wishlist/${productId}`),
  remove: (productId: string) => api.delete(`/wishlist/${productId}`),
};
export const ordersAPI = {
  create: (data: any) => api.post('/orders', data),
  getMyOrders: (page?: number) => api.get('/orders/my-orders', { params: { page } }),
  getOrder: (id: string) => api.get(`/orders/${id}`),
  cancel: (id: string, reason?: string) => api.patch(`/orders/${id}/cancel`, { reason }),
};
export const storesAPI = {
  getAll: (params?: any) => api.get('/stores', { params }),
  getById: (id: string) => api.get(`/stores/${id}`),
  getAvailability: (id: string, date: string) => api.get(`/stores/${id}/availability`, { params: { date } }),
};
export const appointmentsAPI = {
  book: (data: any) => api.post('/appointments', data),
  getMyAppointments: () => api.get('/appointments/my-appointments'),
  cancel: (id: string, reason?: string) => api.patch(`/appointments/${id}/cancel`, { reason }),
};
export const reviewsAPI = {
  getByProduct: (productId: string) => api.get(`/reviews/product/${productId}`),
  create: (data: any) => api.post('/reviews', data),
};
export const prescriptionsAPI = {
  getAll: () => api.get('/prescriptions'),
  create: (data: any) => api.post('/prescriptions', data),
  delete: (id: string) => api.delete(`/prescriptions/${id}`),
};
export const tryAtHomeAPI = {
  book: (data: any) => api.post('/try-at-home', data),
  getMyBookings: () => api.get('/try-at-home/my-bookings'),
};
export const returnsAPI = {
  create: (data: any) => api.post('/returns', data),
  getMyReturns: () => api.get('/returns/my-returns'),
};
export const supportAPI = {
  create: (data: any) => api.post('/support', data),
  getMyTickets: () => api.get('/support/my-tickets'),
};
export const adminAPI = {
  getAnalytics: () => api.get('/admin/analytics'),
  getCustomers: (page?: number) => api.get('/admin/customers', { params: { page } }),
  getProducts: () => api.get('/admin/products'),
  createProduct: (data: any) => api.post('/admin/products', data),
  updateProduct: (id: string, data: any) => api.patch(`/admin/products/${id}`, data),
  deleteProduct: (id: string) => api.delete(`/admin/products/${id}`),
  getCategories: () => api.get('/admin/categories'),
  createCategory: (data: any) => api.post('/admin/categories', data),
  updateCategory: (id: string, data: any) => api.patch(`/admin/categories/${id}`, data),
  getBrands: () => api.get('/admin/brands'),
  createBrand: (data: any) => api.post('/admin/brands', data),
  getOrders: (params?: any) => api.get('/admin/orders', { params }),
  updateOrderStatus: (id: string, status: string) => api.patch(`/admin/orders/${id}/status`, { status }),
  getStores: () => api.get('/admin/stores'),
  createStore: (data: any) => api.post('/admin/stores', data),
  updateStore: (id: string, data: any) => api.patch(`/admin/stores/${id}`, data),
  getWorkers: () => api.get('/worker/all'),
  createWorker: (data: any) => api.post('/worker/create', data),
  getAppointments: (storeId?: string) => api.get('/admin/appointments', { params: { store: storeId } }),
  updateAppointmentStatus: (id: string, status: string) => api.patch(`/admin/appointments/${id}/status`, { status }),
  getReturns: () => api.get('/admin/returns'),
  updateReturnStatus: (id: string, data: any) => api.patch(`/admin/returns/${id}/status`, data),
  getReviews: () => api.get('/admin/reviews'),
  approveReview: (id: string, isApproved: boolean) => api.patch(`/admin/reviews/${id}/approve`, { isApproved }),
  getCoupons: () => api.get('/admin/coupons'),
  createCoupon: (data: any) => api.post('/admin/coupons', data),
  updateCoupon: (id: string, data: any) => api.patch(`/admin/coupons/${id}`, data),
  getAuditLogs: (page?: number) => api.get('/admin/audit-logs', { params: { page } }),
  getInventory: (storeId?: string) => api.get('/admin/inventory', { params: { store: storeId } }),
  updateInventory: (id: string, data: any) => api.patch(`/admin/inventory/${id}`, data),
  getComplaints: (params?: any) => api.get('/admin/complaints', { params }),
  updateComplaintStatus: (id: string, data: any) => api.patch(`/admin/complaints/${id}`, data),
  getBookings: (params?: any) => api.get('/admin/bookings', { params }),
  updateTryAtHomeStatus: (id: string, status: string, notes?: string) => api.patch(`/admin/bookings/try-at-home/${id}`, { status, notes }),
};
export const workerAPI = {
  getDashboard: () => api.get('/worker/dashboard'),
  getInventory: () => api.get('/worker/inventory'),
  updateInventory: (id: string, data: any) => api.patch(`/worker/inventory/${id}`, data),
};
export const paymentsAPI = {
  create: (data: any) => api.post('/payments/create', data),
  confirm: (data: any) => api.post('/payments/confirm', data),
};
