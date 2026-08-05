import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Truck, CheckCircle2, Clock, PackageCheck, AlertCircle } from 'lucide-react';
import { ordersAPI } from '../../api/endpoints';

const STATUS_STEPS = ['PENDING', 'CONFIRMED', 'OUT_FOR_DELIVERY', 'DELIVERED'];

export default function OrderTrackingPage() {
  const [searchParams] = useSearchParams();
  const initialRef = searchParams.get('ref') || '';

  const [orderNumber, setOrderNumber] = useState(initialRef);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTracking = async (num) => {
    if (!num.trim()) return;
    setLoading(true);
    setError('');
    setOrder(null);
    try {
      const res = await ordersAPI.track(num.trim());
      if (res.success) setOrder(res.order);
    } catch (err) {
      setError(err.message || 'Order number not found. Please verify your reference ID.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialRef) {
      fetchTracking(initialRef);
    }
  }, [initialRef]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTracking(orderNumber);
  };

  const currentStepIndex = order ? STATUS_STEPS.indexOf(order.status) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-3 max-w-lg mx-auto">
        <div className="w-16 h-16 bg-teal-50 text-teal-700 rounded-full flex items-center justify-center mx-auto text-2xl shadow-sm">
          <Truck className="w-8 h-8" />
        </div>
        <h1 className="font-display text-3xl font-extrabold text-gray-900">Track Your Gift Delivery</h1>
        <p className="text-xs text-gray-500">Enter your order reference ID (e.g. GFT-123456-7890) to check real-time status</p>
      </div>

      {/* Search Input */}
      <form onSubmit={handleSearch} className="max-w-md mx-auto flex gap-2">
        <input
          type="text"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          placeholder="Enter Order Reference Number..."
          className="flex-1 bg-white border border-gray-200 rounded-full py-3 px-5 text-xs font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-700"
        />
        <button
          type="submit"
          disabled={loading}
          className="gradient-teal text-white font-bold px-6 py-3 rounded-full text-xs shadow-md hover:opacity-95"
        >
          {loading ? 'Searching...' : 'Track Status'}
        </button>
      </form>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-2xl text-xs text-center flex items-center justify-center gap-2 max-w-md mx-auto">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      {/* Order Status Display & Timeline */}
      {order && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xl space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-gray-100">
            <div>
              <span className="text-xs text-gray-400 font-bold uppercase">Order Reference</span>
              <h3 className="font-mono font-extrabold text-teal-800 text-xl">{order.orderNumber}</h3>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-xs text-gray-400 font-bold uppercase">Delivery Target</span>
              <p className="font-bold text-gray-900 text-sm">{order.deliveryCity} — {order.deliveryDate}</p>
            </div>
          </div>

          {/* Visual Timeline Bar */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Delivery Timeline Status</h4>
            <div className="grid grid-cols-4 gap-2 text-center relative">
              {STATUS_STEPS.map((step, idx) => {
                const isPassed = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div key={step} className="flex flex-col items-center space-y-2 relative z-10">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                        isPassed
                          ? 'bg-teal-700 text-white shadow-md'
                          : 'bg-gray-100 text-gray-400'
                      } ${isCurrent ? 'ring-4 ring-teal-100 scale-110' : ''}`}
                    >
                      {idx + 1}
                    </div>
                    <span className={`text-[11px] font-semibold ${isPassed ? 'text-teal-900' : 'text-gray-400'}`}>
                      {step.replace(/_/g, ' ')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary Box */}
          <div className="bg-gray-50 p-4 rounded-2xl text-xs space-y-2 text-gray-700">
            <div className="flex justify-between">
              <span>Recipient:</span>
              <strong className="text-gray-900">{order.recipientName} ({order.recipientPhone})</strong>
            </div>
            <div className="flex justify-between">
              <span>Address:</span>
              <strong className="text-gray-900">{order.deliveryAddress}</strong>
            </div>
            <div className="flex justify-between">
              <span>Payment Status:</span>
              <strong className="text-teal-800 uppercase">{order.paymentStatus} ({order.paymentMethod})</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
