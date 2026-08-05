import React from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';

// Layouts & Components
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import MobileBottomNav from './components/common/MobileBottomNav';
import AdminLayout from './components/admin/AdminLayout';

// Public Pages
import Home from './pages/public/Home';
import Shop from './pages/public/Shop';
import CategoryPage from './pages/public/CategoryPage';
import ProductDetail from './pages/public/ProductDetail';
import CartPage from './pages/public/CartPage';
import CheckoutPage from './pages/public/CheckoutPage';
import OrderConfirmationPage from './pages/public/OrderConfirmationPage';
import OrderTrackingPage from './pages/public/OrderTrackingPage';
import SearchPage from './pages/public/SearchPage';

// Static Informational Pages
import {
  AboutUs,
  ContactUs,
  FAQs,
  PaymentMethods,
  PrivacyPolicy,
  TermsAndConditions,
  ReturnsRefundPolicy,
  LegalIdentity,
  BlogListing,
  NotFound,
} from './pages/public/StaticPages';

// Account Pages
import { Login, Register, ForgotPassword } from './pages/account/AuthPages';
import CustomerDashboard from './pages/account/CustomerDashboard';
import { Orders, OrderDetail } from './pages/account/CustomerOrdersPages';
import { Wishlist, Addresses, Profile } from './pages/account/CustomerOtherPages';

// Admin Pages
import {
  AdminLogin,
  AdminCategories,
  AdminCustomers,
  AdminCoupons,
  AdminReviews,
  AdminDeliveryZones,
  AdminReports,
  AdminSettings,
} from './pages/admin/AdminSecondaryPages';
import AdminDashboard from './pages/admin/AdminDashboard';
import { AdminProducts } from './pages/admin/AdminProductsPages';
import { AdminOrders, AdminOrderDetail } from './pages/admin/AdminOrdersPages';

// Guard for Customer Protected Routes
import { useAuthStore } from './store/useAuthStore';

function CustomerLayout() {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <Header />
        <main>
          <Outlet />
        </main>
      </div>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}

function ProtectedCustomerRoute() {
  const { user } = useAuthStore();
  if (!user) return <Navigate to="/account/login" replace />;
  return <Outlet />;
}

function ProtectedAdminRoute() {
  const { user } = useAuthStore();
  if (!user || user.role === 'CUSTOMER') return <Navigate to="/admin/login" replace />;
  return <Outlet />;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <CustomerLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'shop', element: <Shop /> },
      { path: 'category/:slug', element: <CategoryPage /> },
      { path: 'category/:parentSlug/:childSlug', element: <CategoryPage /> },
      { path: 'product/:slug', element: <ProductDetail /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'checkout', element: <CheckoutPage /> },
      { path: 'order-confirmation/:orderId', element: <OrderConfirmationPage /> },
      { path: 'order-tracking', element: <OrderTrackingPage /> },
      { path: 'search', element: <SearchPage /> },

      // Informational & Legal
      { path: 'about-us', element: <AboutUs /> },
      { path: 'contact-us', element: <ContactUs /> },
      { path: 'faqs', element: <FAQs /> },
      { path: 'payment-methods', element: <PaymentMethods /> },
      { path: 'privacy-policy', element: <PrivacyPolicy /> },
      { path: 'terms-and-conditions', element: <TermsAndConditions /> },
      { path: 'returns-refund-policy', element: <ReturnsRefundPolicy /> },
      { path: 'legal-identity', element: <LegalIdentity /> },
      { path: 'blog', element: <BlogListing /> },
      { path: 'blog/:slug', element: <BlogListing /> },

      // Auth Public
      { path: 'account/login', element: <Login /> },
      { path: 'account/register', element: <Register /> },
      { path: 'account/forgot-password', element: <ForgotPassword /> },

      // Customer Protected
      {
        path: 'account',
        element: <ProtectedCustomerRoute />,
        children: [
          { path: 'dashboard', element: <CustomerDashboard /> },
          { path: 'orders', element: <Orders /> },
          { path: 'orders/:id', element: <OrderDetail /> },
          { path: 'wishlist', element: <Wishlist /> },
          { path: 'addresses', element: <Addresses /> },
          { path: 'profile', element: <Profile /> },
        ],
      },

      { path: '*', element: <NotFound /> },
    ],
  },

  // Admin Routes
  { path: '/admin/login', element: <AdminLogin /> },
  {
    path: '/admin',
    element: <ProtectedAdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: 'dashboard', element: <AdminDashboard /> },
          { path: 'products', element: <AdminProducts /> },
          { path: 'categories', element: <AdminCategories /> },
          { path: 'orders', element: <AdminOrders /> },
          { path: 'orders/:id', element: <AdminOrderDetail /> },
          { path: 'customers', element: <AdminCustomers /> },
          { path: 'coupons', element: <AdminCoupons /> },
          { path: 'reviews', element: <AdminReviews /> },
          { path: 'delivery-zones', element: <AdminDeliveryZones /> },
          { path: 'reports', element: <AdminReports /> },
          { path: 'settings', element: <AdminSettings /> },
        ],
      },
    ],
  },
]);
