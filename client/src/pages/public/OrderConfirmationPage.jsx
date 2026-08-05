import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Truck, Copy, ShoppingBag, ArrowRight } from 'lucide-react';
import { ordersAPI } from '../../api/endpoints';
import toast from 'react-hot-toast';

export default function OrderConfirmationPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await ordersAPI.getById(orderId);
        if (res.success) setOrder(res.order);
      } catch (err) {
        console.error('Error loading order confirmation:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="h-12 w-12 bg-teal-200 animate-pulse rounded-full mx-auto" />
        <div className="h-6 w-48 bg-gray-200 animate-pulse mx-auto rounded-lg" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Order Not Found</h2>
        <Link to="/" className="text-teal-700 font-semibold underline mt-2 inline-block">Return to Home</Link>
      </div>
    );
  }

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(order.orderNumber);
    toast.success('Order number copied!');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Success Card */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-4xl shadow-sm">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">ORDER SUCCESSFUL</span>
          <h1 className="font-display text-3xl font-extrabold text-gray-900">Thank You for Your Order! 🎉</h1>
          <p className="text-sm text-gray-600 max-w-md mx-auto">
            Your gift order has been received and sent to our dispatch team for delivery in <strong>{order.deliveryCity}</strong>.
          </p>
        </div>

        {/* Order Number Box */}
        <div className="bg-gray-50 border border-gray-200 p-4 rounded-2xl max-w-md mx-auto flex items-center justify-between">
          <div className="text-left">
            <span className="text-[11px] text-gray-400 font-bold uppercase">Order Reference Number</span>
            <p className="font-mono text-lg font-bold text-teal-800">{order.orderNumber}</p>
          </div>
          <button
            onClick={copyOrderNumber}
            className="flex items-center gap-1 bg-white border border-gray-200 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-100"
          >
            <Copy className="w-3.5 h-3.5" /> Copy
          </button>
        </div>

        {/* Order Details Summary */}
        <div className="text-left border-t border-gray-100 pt-6 space-y-3 text-xs text-gray-600">
          <div className="flex justify-between">
            <span>Recipient Name:</span>
            <strong className="text-gray-900">{order.recipientName} ({order.recipientPhone})</strong>
          </div>
          <div className="flex justify-between">
            <span>Delivery City & Address:</span>
            <strong className="text-gray-900">{order.deliveryCity} — {order.deliveryAddress}</strong>
          </div>
          <div className="flex justify-between">
            <span>Scheduled Delivery:</span>
            <strong className="text-teal-800">{order.deliveryDate} ({order.deliveryTimeSlot})</strong>
          </div>
          <div className="flex justify-between">
            <span>Payment Method:</span>
            <strong className="text-gray-900">{order.paymentMethod}</strong>
          </div>
          <div className="flex justify-between text-sm pt-2 border-t border-gray-100">
            <span className="font-bold text-gray-900">Total Paid / Payable:</span>
            <span className="font-extrabold text-teal-800">PKR {order.totalAmount.toLocaleString()}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to={`/order-tracking?ref=${order.orderNumber}`}
            className="bg-teal-700 hover:bg-teal-800 text-white font-bold py-3 px-6 rounded-full text-xs transition-all flex items-center justify-center gap-2 shadow-md"
          >
            <Truck className="w-4 h-4" /> Track Order Status
          </Link>
          <Link
            to="/shop"
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-full text-xs transition-all flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" /> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
