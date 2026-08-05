import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, MapPin, Award, User, LogOut, ChevronRight } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { ordersAPI } from '../../api/endpoints';

export default function CustomerDashboard() {
  const { user, logout } = useAuthStore();
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await ordersAPI.getMyOrders();
        if (res.success) setRecentOrders(res.orders || []);
      } catch (err) {
        console.error('Failed to load my orders:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="gradient-teal text-white p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <span className="text-xs font-bold text-amber-300 uppercase">Customer Portal</span>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold">Welcome back, {user?.name}! 👋</h1>
          <p className="text-xs text-teal-100">{user?.email}</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 text-center sm:text-right">
          <span className="text-[10px] font-bold text-amber-300 uppercase block">Loyalty Points</span>
          <p className="font-display font-extrabold text-2xl text-amber-400">
            {user?.points || 0} <span className="text-xs font-normal text-white">PTS</span>
          </p>
        </div>
      </div>

      {/* Navigation Quick Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link to="/account/orders" className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-teal-50 text-teal-700">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm text-gray-900">My Orders</p>
              <p className="text-xs text-gray-500">{recentOrders.length} placed</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </Link>

        <Link to="/account/wishlist" className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-coral-50 text-coral-500">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm text-gray-900">Wishlist</p>
              <p className="text-xs text-gray-500">Saved items</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </Link>

        <Link to="/account/addresses" className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm text-gray-900">Addresses</p>
              <p className="text-xs text-gray-500">Manage PK cities</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </Link>

        <Link to="/account/profile" className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm text-gray-900">Profile</p>
              <p className="text-xs text-gray-500">Edit details</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </Link>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
          <h3 className="font-bold text-gray-900 text-lg">Recent Orders</h3>
          <Link to="/account/orders" className="text-xs font-semibold text-teal-700 hover:underline">
            View All Orders
          </Link>
        </div>

        {loading ? (
          <div className="h-32 bg-gray-200 animate-pulse rounded-2xl" />
        ) : recentOrders.length === 0 ? (
          <p className="text-xs text-gray-500 py-4 text-center">You haven't placed any gift orders yet.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {recentOrders.slice(0, 3).map((order) => (
              <div key={order.id} className="py-3 flex justify-between items-center text-xs">
                <div>
                  <p className="font-mono font-bold text-teal-800">{order.orderNumber}</p>
                  <p className="text-gray-500">{order.deliveryCity} — {order.deliveryDate}</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-gray-900 block">PKR {order.totalAmount.toLocaleString()}</span>
                  <span className="text-[10px] font-bold text-teal-700 uppercase bg-teal-50 px-2 py-0.5 rounded-full">
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
