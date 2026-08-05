import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Users,
  Tag,
  MessageSquare,
  Truck,
  BarChart3,
  Settings,
  LogOut,
  Gift,
  ExternalLink,
  Menu,
  X,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Products', path: '/admin/products', icon: Package },
    { label: 'Categories', path: '/admin/categories', icon: FolderTree },
    { label: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Customers', path: '/admin/customers', icon: Users },
    { label: 'Coupons', path: '/admin/coupons', icon: Tag },
    { label: 'Reviews', path: '/admin/reviews', icon: MessageSquare },
    { label: 'Delivery Zones', path: '/admin/delivery-zones', icon: Truck },
    { label: 'Reports & Analytics', path: '/admin/reports', icon: BarChart3 },
    { label: 'Site Settings', path: '/admin/settings', icon: Settings },
  ];

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full p-4 text-gray-300">
      <div className="space-y-6">
        {/* Brand */}
        <div className="flex justify-between items-center px-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl gradient-coral flex items-center justify-center text-white font-bold">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <span className="font-display font-bold text-white text-lg block leading-none">GIFTO</span>
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Admin Portal</span>
            </div>
          </Link>
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="md:hidden text-gray-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setMobileSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-teal-700 text-white shadow-md'
                    : 'hover:bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer info & Logout */}
      <div className="space-y-3 border-t border-gray-800 pt-4">
        <Link
          to="/"
          target="_blank"
          className="flex items-center gap-2 text-xs font-medium text-amber-400 hover:underline px-2"
        >
          <ExternalLink className="w-3.5 h-3.5" /> View Live Storefront
        </Link>

        <div className="flex items-center justify-between px-2 pt-2">
          <div className="text-xs">
            <p className="font-bold text-white leading-tight">{user?.name || 'Admin'}</p>
            <p className="text-[10px] text-gray-400">{user?.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-gray-400 hover:text-rose-400 transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Top Navbar Bar (< md) */}
      <header className="md:hidden bg-charcoal text-white px-4 py-3 flex justify-between items-center sticky top-0 z-40 shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800"
            aria-label="Open Admin Menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl gradient-coral flex items-center justify-center text-white font-bold">
              <Gift className="w-4 h-4" />
            </div>
            <span className="font-display font-bold text-white text-base">GIFTO Admin</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold bg-amber-500 text-gray-900 px-2 py-0.5 rounded-full">
            {user?.role || 'ADMIN'}
          </span>
        </div>
      </header>

      {/* Desktop Fixed Sidebar (>= md) */}
      <aside className="hidden md:flex w-64 bg-charcoal text-gray-300 fixed top-0 bottom-0 left-0 z-30 shadow-xl">
        {sidebarContent}
      </aside>

      {/* Mobile Off-Canvas Sidebar Drawer (< md) */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop Fade */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            />

            {/* Sidebar Slide-in */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              className="relative w-4/5 max-w-xs bg-charcoal h-full shadow-2xl z-10 overflow-y-auto"
            >
              {sidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 p-4 sm:p-6 lg:p-8 min-h-screen max-w-full overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}
