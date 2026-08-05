import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, Truck, Calendar, MapPin } from 'lucide-react';
import { ordersAPI } from '../../api/endpoints';

export function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMyOrders() {
      try {
        const res = await ordersAPI.getMyOrders();
        if (res.success) setOrders(res.orders);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchMyOrders();
  }, []);

  if (loading) {
    return <div className="max-w-4xl mx-auto p-12"><div className="h-48 bg-gray-200 animate-pulse rounded-2xl" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <h1 className="font-display text-2xl font-bold text-gray-900">My Gift Orders History ({orders.length})</h1>

      {orders.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-gray-100">
          <p className="text-gray-500 text-xs">No orders found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-teal-800 text-sm">{order.orderNumber}</span>
                  <span className="text-[10px] font-bold bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full uppercase">
                    {order.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Recipient: {order.recipientName} ({order.deliveryCity})
                </p>
                <p className="text-xs text-gray-400">Date: {order.deliveryDate}</p>
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto justify-between">
                <span className="font-bold text-gray-900 text-sm">
                  PKR {order.totalAmount.toLocaleString()}
                </span>
                <Link
                  to={`/account/orders/${order.id}`}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold px-4 py-2 rounded-xl text-xs"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetail() {
      try {
        const res = await ordersAPI.getById(id);
        if (res.success) setOrder(res.order);
      } catch (err) {
        console.error('Failed to load order detail:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [id]);

  if (loading) return <div className="max-w-3xl mx-auto p-12"><div className="h-48 bg-gray-200 animate-pulse rounded-2xl" /></div>;
  if (!order) return <div className="max-w-3xl mx-auto p-12 text-center font-bold">Order not found.</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-gray-100">
          <div>
            <span className="text-xs text-gray-400 font-bold uppercase">Order Reference</span>
            <h1 className="font-mono text-xl font-bold text-teal-800">{order.orderNumber}</h1>
          </div>
          <span className="bg-teal-50 text-teal-700 font-bold px-3 py-1 rounded-full text-xs uppercase">
            {order.status}
          </span>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 text-xs text-gray-600">
          <div>
            <p className="font-bold text-gray-900 mb-1">Recipient Information</p>
            <p>{order.recipientName}</p>
            <p>{order.recipientPhone}</p>
            <p>{order.deliveryCity} — {order.deliveryAddress}</p>
          </div>
          <div>
            <p className="font-bold text-gray-900 mb-1">Delivery Schedule</p>
            <p>Date: {order.deliveryDate}</p>
            <p>Slot: {order.deliveryTimeSlot}</p>
            <p>Payment: {order.paymentMethod} ({order.paymentStatus})</p>
          </div>
        </div>

        {order.giftCardMessage && (
          <div className="bg-amber-50 p-4 rounded-xl text-xs text-amber-900 border border-amber-200">
            <span className="font-bold block mb-1">Gift Card Message:</span>
            <p className="italic">"{order.giftCardMessage}"</p>
          </div>
        )}

        <div className="pt-4 border-t border-gray-100 space-y-3">
          <h3 className="font-bold text-gray-900 text-sm">Ordered Items</h3>
          <div className="divide-y divide-gray-100">
            {order.items && order.items.map((item) => (
              <div key={item.id} className="py-2.5 flex justify-between items-center text-xs">
                <div>
                  <p className="font-bold text-gray-900">{item.product?.name || 'Gift Product'}</p>
                  <p className="text-gray-400">Qty: {item.quantity}</p>
                </div>
                <span className="font-bold text-teal-800">
                  PKR {(item.priceAtPurchase * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-sm font-bold">
          <span>Total Amount:</span>
          <span className="text-teal-800 text-lg">PKR {order.totalAmount.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
