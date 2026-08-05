import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, DollarSign, Users, AlertTriangle, ArrowUpRight, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { adminAPI } from '../../api/endpoints';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [statsRes, salesRes] = await Promise.all([
          adminAPI.getStats(),
          adminAPI.getSalesReport(),
        ]);
        if (statsRes.success) {
          setStats(statsRes.stats);
          setRecentOrders(statsRes.recentOrders || []);
        }
        if (salesRes.success) {
          setSalesData(salesRes.dailyTrends || []);
        }
      } catch (err) {
        console.error('Error loading admin dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-20 bg-gray-200 animate-pulse rounded-2xl" />
        <div className="grid grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => <div key={n} className="h-32 bg-gray-200 animate-pulse rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900">Store Performance & Analytics</h1>
        <p className="text-xs text-gray-500">Real-time overview of revenue, order volume, and low stock alerts</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase">Total Revenue</span>
            <p className="font-display font-bold text-2xl text-teal-800 mt-1">
              PKR {(stats?.totalRevenue || 0).toLocaleString()}
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-teal-50 text-teal-700">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase">Total Orders</span>
            <p className="font-display font-bold text-2xl text-gray-900 mt-1">
              {stats?.totalOrders || 0}
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-coral-50 text-coral-500">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase">Customers</span>
            <p className="font-display font-bold text-2xl text-gray-900 mt-1">
              {stats?.totalCustomers || 0}
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-amber-50 text-amber-600">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase">Low Stock Items</span>
            <p className="font-display font-bold text-2xl text-rose-600 mt-1">
              {stats?.lowStockCount || 0}
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-rose-50 text-rose-500">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Sales Trend Chart (Recharts) */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Sales Revenue Trend (PKR)</h3>
            <p className="text-xs text-gray-500">Weekly sales distribution</p>
          </div>
          <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            <TrendingUp className="w-4 h-4" /> +14.8% vs last week
          </span>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0F766E" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#0F766E" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
              <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(val) => `${val / 1000}k`} />
              <Tooltip formatter={(value) => [`PKR ${value.toLocaleString()}`, 'Sales']} />
              <Area type="monotone" dataKey="sales" stroke="#0F766E" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
          <h3 className="font-bold text-gray-900 text-lg">Recent Orders</h3>
          <Link to="/admin/orders" className="text-xs font-semibold text-teal-700 hover:underline flex items-center gap-1">
            Manage All Orders <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                <th className="pb-3">Order Ref</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Delivery City</th>
                <th className="pb-3">Total Amount</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="py-3 font-mono font-bold text-teal-800">{order.orderNumber}</td>
                  <td className="py-3">{order.recipientName}</td>
                  <td className="py-3">{order.deliveryCity}</td>
                  <td className="py-3 font-bold text-gray-900">PKR {order.totalAmount.toLocaleString()}</td>
                  <td className="py-3">
                    <span className="bg-teal-50 text-teal-700 font-bold px-2.5 py-1 rounded-full text-[10px] uppercase">
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <Link
                      to={`/admin/orders/${order.id}`}
                      className="text-teal-700 hover:underline font-bold"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
