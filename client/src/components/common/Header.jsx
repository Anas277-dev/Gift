import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  MapPin,
  Menu,
  X,
  PhoneCall,
  Gift,
  ChevronDown,
  Truck,
  Sparkles,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';

const CITIES = [
  'Lahore',
  'Karachi',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Gujranwala',
  'Sialkot',
  'Peshawar',
  'Hyderabad',
];

export default function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { cart, selectedCity, setCity } = useCartStore();
  const { wishlist } = useWishlistStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cityModalOpen, setCityModalOpen] = useState(false);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      {/* Top Announcement Bar */}
      <div className="gradient-teal text-white text-xs py-2 px-4 flex justify-between items-center">
        <div className="max-w-7xl mx-w-auto w-full flex justify-between items-center px-4 mx-auto">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <span>International Orders Accepted! Delivering Same-Day & Midnight Across Pakistan 🇵🇰</span>
          </div>
          <div className="hidden md:flex items-center space-x-6 text-teal-100">
            <span className="flex items-center gap-1">
              <PhoneCall className="w-3 h-3" /> Support: +92 300 1234567 (10am–12am)
            </span>
            <Link to="/order-tracking" className="hover:text-white flex items-center gap-1 font-medium">
              <Truck className="w-3.5 h-3.5" /> Track Order
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          {/* Logo & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl gradient-coral flex items-center justify-center text-white shadow-md">
                <Gift className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-2xl font-bold text-teal-700 tracking-tight leading-none">
                  GIFTO
                </span>
                <span className="text-[10px] text-coral-500 font-semibold tracking-wider uppercase">
                  Gift Delivery PK
                </span>
              </div>
            </Link>
          </div>

          {/* City Delivery Selector */}
          <button
            onClick={() => setCityModalOpen(true)}
            className="hidden sm:flex items-center gap-2 bg-teal-50 border border-teal-200 text-teal-800 px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-teal-100 transition-all"
          >
            <MapPin className="w-4 h-4 text-teal-700" />
            <span>Delivering to: <strong className="text-teal-900 underline">{selectedCity}</strong></span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cakes, flowers, chocolates, food deals..."
                className="w-full bg-gray-50 border border-gray-200 rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-teal-700 focus:bg-white transition-all"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full gradient-teal text-white hover:opacity-90 transition-opacity"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Actions: Account, Wishlist, Cart */}
          <div className="flex items-center space-x-4">
            {/* Account */}
            {user ? (
              <div className="relative group">
                <Link
                  to={user.role === 'CUSTOMER' ? '/account/dashboard' : '/admin/dashboard'}
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-teal-700 py-1"
                >
                  <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
                    {user.name.charAt(0)}
                  </div>
                  <span className="hidden lg:inline">{user.name.split(' ')[0]}</span>
                </Link>
                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 hidden group-hover:block z-50">
                  {user.role !== 'CUSTOMER' && (
                    <Link
                      to="/admin/dashboard"
                      className="block px-4 py-2 text-sm font-semibold text-coral-500 hover:bg-coral-50"
                    >
                      👑 Admin Panel
                    </Link>
                  )}
                  <Link to="/account/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    My Account
                  </Link>
                  <Link to="/account/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    My Orders
                  </Link>
                  <Link to="/account/wishlist" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    Wishlist ({wishlist.length})
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/account/login"
                className="hidden sm:flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-teal-700"
              >
                <User className="w-5 h-5" />
                <span>Login</span>
              </Link>
            )}

            {/* Wishlist */}
            <Link
              to="/account/wishlist"
              className="relative p-2 text-gray-700 hover:text-coral-500 hidden sm:block"
            >
              <Heart className="w-6 h-6" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-coral-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Drawer Button */}
            <Link
              to="/cart"
              className="relative flex items-center gap-2 bg-teal-700 text-white px-3.5 py-2 rounded-full font-medium text-sm hover:bg-teal-800 transition-all shadow-sm"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-amber-500 text-gray-900 text-xs font-bold flex items-center justify-center ml-0.5">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <form onSubmit={handleSearch} className="mt-3 md:hidden">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cakes, flowers, food deals..."
              className="w-full bg-gray-50 border border-gray-200 rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-teal-700"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full gradient-teal text-white"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Primary Category Bar Navigation */}
      <div className="bg-teal-900 text-white hidden md:block border-t border-teal-800">
        <div className="max-w-7xl mx-auto px-4 flex items-center space-x-6 text-sm font-medium overflow-x-auto py-2.5">
          <Link to="/shop" className="hover:text-amber-500 transition-colors flex items-center gap-1 font-semibold text-amber-500">
            <Sparkles className="w-4 h-4" /> All Gifts
          </Link>
          <Link to="/category/cakes" className="hover:text-amber-400 whitespace-nowrap">Cakes</Link>
          <Link to="/category/flowers" className="hover:text-amber-400 whitespace-nowrap">Flowers</Link>
          <Link to="/category/chocolates" className="hover:text-amber-400 whitespace-nowrap">Chocolates</Link>
          <Link to="/category/sweets-mithai" className="hover:text-amber-400 whitespace-nowrap">Sweets / Mithai</Link>
          <Link to="/category/combo-deals" className="hover:text-amber-400 whitespace-nowrap">Combo Deals</Link>
          <Link to="/category/food-deals" className="hover:text-amber-400 whitespace-nowrap">Food Deals</Link>
          <Link to="/category/perfumes" className="hover:text-amber-400 whitespace-nowrap">Perfumes</Link>
          <Link to="/category/personalised-gifts" className="hover:text-amber-400 whitespace-nowrap">Personalised</Link>
          <Link to="/category/gifts-by-occasion" className="hover:text-amber-400 whitespace-nowrap">By Occasion</Link>
        </div>
      </div>

      {/* Mobile Off-Canvas Navigation Sidebar with Smooth Framer Motion Animation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop Fade */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Drawer Sidebar Smooth Slide-in */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
              className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl z-10 flex flex-col justify-between overflow-y-auto"
            >
              <div className="p-5 space-y-6">
                {/* Top Drawer Header */}
                <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                  <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl gradient-coral flex items-center justify-center text-white font-bold">
                      <Gift className="w-4 h-4" />
                    </div>
                    <span className="font-display font-bold text-teal-700 text-xl">GIFTO</span>
                  </Link>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* City Delivery Selector Button */}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setCityModalOpen(true);
                  }}
                  className="w-full flex items-center justify-between bg-teal-50 border border-teal-200 text-teal-800 p-3 rounded-2xl text-xs font-semibold"
                >
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-coral-500" />
                    <span>Delivering to: <strong className="text-teal-900 underline">{selectedCity}</strong></span>
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* Account Quick Status */}
                <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
                  {user ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-teal-700 text-white font-bold text-xs flex items-center justify-center">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-xs text-gray-900">{user.name}</p>
                          <p className="text-[10px] text-teal-700 font-semibold">{user.points || 0} Loyalty Pts</p>
                        </div>
                      </div>
                      <Link
                        to="/account/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-[11px] font-bold text-teal-700 hover:underline"
                      >
                        Dashboard
                      </Link>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600 font-medium">Welcome Guest</span>
                      <Link
                        to="/account/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="gradient-teal text-white font-bold px-3 py-1.5 rounded-full text-xs"
                      >
                        Login / Register
                      </Link>
                    </div>
                  )}
                </div>

                {/* Categories Navigation */}
                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">
                    Gift Categories
                  </span>
                  <nav className="space-y-1 text-sm font-medium">
                    <Link
                      to="/shop"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-coral-500 font-bold hover:bg-coral-50"
                    >
                      <Sparkles className="w-4 h-4" /> All Gifts Catalog
                    </Link>
                    <Link
                      to="/category/cakes"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-xl text-gray-700 hover:bg-teal-50 hover:text-teal-800"
                    >
                      🎂 Cakes (Bakery Fresh)
                    </Link>
                    <Link
                      to="/category/flowers"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-xl text-gray-700 hover:bg-teal-50 hover:text-teal-800"
                    >
                      🌹 Fresh Flowers & Roses
                    </Link>
                    <Link
                      to="/category/chocolates"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-xl text-gray-700 hover:bg-teal-50 hover:text-teal-800"
                    >
                      🍫 Ferrero & Chocolates
                    </Link>
                    <Link
                      to="/category/sweets-mithai"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-xl text-gray-700 hover:bg-teal-50 hover:text-teal-800"
                    >
                      🍬 Traditional Mithai
                    </Link>
                    <Link
                      to="/category/combo-deals"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-xl text-gray-700 hover:bg-teal-50 hover:text-teal-800"
                    >
                      🎁 Combo Package Deals
                    </Link>
                    <Link
                      to="/category/food-deals"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-xl text-gray-700 hover:bg-teal-50 hover:text-teal-800"
                    >
                      🍔 KFC & Food Combos
                    </Link>
                    <Link
                      to="/category/perfumes"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-xl text-gray-700 hover:bg-teal-50 hover:text-teal-800"
                    >
                      ✨ Original Perfumes (J.)
                    </Link>
                    <Link
                      to="/category/personalised-gifts"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-xl text-gray-700 hover:bg-teal-50 hover:text-teal-800"
                    >
                      🎨 Personalised Mugs & Items
                    </Link>
                  </nav>
                </div>

                {/* Quick Customer Care Links */}
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">
                    Support & Help
                  </span>
                  <nav className="space-y-1 text-xs text-gray-600 font-medium">
                    <Link
                      to="/order-tracking"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 text-teal-800 font-bold"
                    >
                      <Truck className="w-4 h-4" /> Track Order Status
                    </Link>
                    <Link
                      to="/about-us"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-xl hover:bg-gray-50"
                    >
                      About Us
                    </Link>
                    <Link
                      to="/contact-us"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-xl hover:bg-gray-50"
                    >
                      Contact Us
                    </Link>
                    <Link
                      to="/faqs"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-xl hover:bg-gray-50"
                    >
                      FAQs
                    </Link>
                  </nav>
                </div>
              </div>

              {/* Bottom Footer Info */}
              <div className="p-4 bg-gray-50 border-t border-gray-100 text-[11px] text-gray-500 space-y-1">
                <p className="flex items-center gap-1">
                  <PhoneCall className="w-3 h-3 text-teal-700" /> Support: +92 300 1234567
                </p>
                <p>Business Hours: 10am – 12am PST</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* City Selector Modal */}
      {cityModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <MapPin className="text-teal-700" /> Select Delivery City in Pakistan
              </h3>
              <button onClick={() => setCityModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              We deliver same-day and midnight gifts to all major Pakistani cities. Select your target recipient city:
            </p>
            <div className="grid grid-cols-2 gap-2.5 max-h-60 overflow-y-auto pr-1">
              {CITIES.map((cityName) => (
                <button
                  key={cityName}
                  onClick={() => {
                    setCity(cityName);
                    setCityModalOpen(false);
                  }}
                  className={`py-2 px-3 text-left rounded-xl text-sm font-medium border transition-all ${
                    selectedCity === cityName
                      ? 'border-teal-700 bg-teal-50 text-teal-900 font-bold'
                      : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  📍 {cityName}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
