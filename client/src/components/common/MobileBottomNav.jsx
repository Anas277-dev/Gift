import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, ShoppingBag, Heart, User } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { useAuthStore } from '../../store/useAuthStore';

export default function MobileBottomNav() {
  const location = useLocation();
  const { cart } = useCartStore();
  const { wishlist } = useWishlistStore();
  const { user } = useAuthStore();

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Shop', path: '/shop', icon: Search },
    { label: 'Wishlist', path: '/account/wishlist', icon: Heart, count: wishlist.length },
    { label: 'Cart', path: '/cart', icon: ShoppingBag, count: cartCount },
    { label: 'Account', path: user ? '/account/dashboard' : '/account/login', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 z-50 shadow-lg">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex flex-col items-center relative py-1 px-3 rounded-xl transition-all ${
                isActive ? 'text-teal-700 font-bold' : 'text-gray-500 hover:text-teal-700'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">{item.label}</span>
              {item.count > 0 && (
                <span className="absolute top-0 right-2 w-4 h-4 rounded-full bg-coral-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {item.count}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
