import axiosInstance from './axiosInstance';

export const authAPI = {
  login: (data) => axiosInstance.post('/auth/login', data),
  register: (data) => axiosInstance.post('/auth/register', data),
  logout: () => axiosInstance.post('/auth/logout'),
  getProfile: () => axiosInstance.get('/auth/profile'),
  updateProfile: (data) => axiosInstance.put('/auth/profile', data),
  changePassword: (data) => axiosInstance.post('/auth/change-password', data),
  getAddresses: () => axiosInstance.get('/auth/addresses'),
  addAddress: (data) => axiosInstance.post('/auth/addresses', data),
  deleteAddress: (id) => axiosInstance.delete(`/auth/addresses/${id}`),
};

export const productsAPI = {
  getProducts: (params) => axiosInstance.get('/products', { params }),
  getFeatured: () => axiosInstance.get('/products/featured'),
  getBySlug: (slug) => axiosInstance.get(`/products/${slug}`),
  search: (q) => axiosInstance.get('/products/search', { params: { q } }),
  adminCreate: (data) => axiosInstance.post('/products/admin', data),
  adminUpdate: (id, data) => axiosInstance.put(`/products/admin/${id}`, data),
  adminDelete: (id) => axiosInstance.delete(`/products/admin/${id}`),
};

export const categoriesAPI = {
  getAll: () => axiosInstance.get('/categories'),
  getBySlug: (slug) => axiosInstance.get(`/categories/${slug}`),
  adminCreate: (data) => axiosInstance.post('/categories/admin', data),
  adminUpdate: (id, data) => axiosInstance.put(`/categories/admin/${id}`, data),
  adminDelete: (id) => axiosInstance.delete(`/categories/admin/${id}`),
};

export const ordersAPI = {
  create: (data) => axiosInstance.post('/orders', data),
  getMyOrders: () => axiosInstance.get('/orders/my-orders'),
  getById: (id) => axiosInstance.get(`/orders/${id}`),
  track: (orderNumber) => axiosInstance.get(`/orders/track/${orderNumber}`),
  adminGetAll: (params) => axiosInstance.get('/orders/admin/all', { params }),
  adminUpdateStatus: (id, data) => axiosInstance.put(`/orders/admin/${id}/status`, data),
};

export const reviewsAPI = {
  getByProduct: (productId) => axiosInstance.get(`/reviews/product/${productId}`),
  add: (productId, data) => axiosInstance.post(`/reviews/product/${productId}`, data),
  adminGetAll: () => axiosInstance.get('/reviews/admin/all'),
  adminApprove: (id, data) => axiosInstance.put(`/reviews/admin/${id}/approve`, data),
  adminDelete: (id) => axiosInstance.delete(`/reviews/admin/${id}`),
};

export const couponsAPI = {
  validate: (code, subtotal) => axiosInstance.post('/coupons/validate', { code, subtotal }),
  adminGetAll: () => axiosInstance.get('/coupons/admin/all'),
  adminCreate: (data) => axiosInstance.post('/coupons/admin', data),
  adminDelete: (id) => axiosInstance.delete(`/coupons/admin/${id}`),
};

export const deliveryAPI = {
  getZones: () => axiosInstance.get('/delivery/zones'),
  adminGetAll: () => axiosInstance.get('/delivery/admin/all'),
  adminCreate: (data) => axiosInstance.post('/delivery/admin', data),
  adminUpdate: (id, data) => axiosInstance.put(`/delivery/admin/${id}`, data),
  adminDelete: (id) => axiosInstance.delete(`/delivery/admin/${id}`),
};

export const adminAPI = {
  getStats: () => axiosInstance.get('/admin/dashboard-stats'),
  getSalesReport: () => axiosInstance.get('/admin/reports/sales'),
  getCustomers: () => axiosInstance.get('/admin/customers'),
  getCustomerById: (id) => axiosInstance.get(`/admin/customers/${id}`),
  getSettings: () => axiosInstance.get('/admin/settings'),
  updateSettings: (data) => axiosInstance.put('/admin/settings', data),
};
