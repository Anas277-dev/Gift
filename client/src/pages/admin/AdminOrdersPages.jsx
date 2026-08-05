import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Printer, ShoppingBag, Truck, CheckCircle2 } from 'lucide-react';
import { ordersAPI } from '../../api/endpoints';
import toast from 'react-hot-toast';

export function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchOrders = async () => {
    try {
      const res = await ordersAPI.adminGetAll({ status: statusFilter });
      if (res.success) setOrders(res.orders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-gray-900">Order Dispatch & Status Management</h1>
          <p className="text-xs text-gray-500">Track pending, confirmed, out for delivery, and completed gift orders</p>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs font-semibold text-gray-800 shadow-sm w-full sm:w-auto"
        >
          <option value="">All Order Statuses</option>
          <option value="PENDING">PENDING</option>
          <option value="CONFIRMED">CONFIRMED</option>
          <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
          <option value="DELIVERED">DELIVERED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs min-w-[850px]">
          <thead>
            <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase bg-gray-50">
              <th className="p-4 whitespace-nowrap">Order Ref</th>
              <th className="p-4 whitespace-nowrap">Recipient</th>
              <th className="p-4 whitespace-nowrap">City</th>
              <th className="p-4 whitespace-nowrap">Delivery Date</th>
              <th className="p-4 whitespace-nowrap">Payment</th>
              <th className="p-4 whitespace-nowrap">Total</th>
              <th className="p-4 whitespace-nowrap">Status</th>
              <th className="p-4 text-right whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-gray-50">
                <td className="p-4 font-mono font-bold text-teal-800 whitespace-nowrap">{o.orderNumber}</td>
                <td className="p-4 whitespace-nowrap">
                  <p className="font-bold text-gray-900">{o.recipientName}</p>
                  <p className="text-gray-400 text-[10px]">{o.recipientPhone}</p>
                </td>
                <td className="p-4 whitespace-nowrap">{o.deliveryCity}</td>
                <td className="p-4 text-gray-600 whitespace-nowrap">{o.deliveryDate}</td>
                <td className="p-4 text-gray-600 whitespace-nowrap">{o.paymentMethod}</td>
                <td className="p-4 font-bold text-gray-900 whitespace-nowrap">PKR {o.totalAmount.toLocaleString()}</td>
                <td className="p-4 whitespace-nowrap">
                  <span className="bg-teal-50 text-teal-700 font-bold px-2.5 py-1 rounded-full text-[10px] uppercase">
                    {o.status}
                  </span>
                </td>
                <td className="p-4 text-right whitespace-nowrap">
                  <Link to={`/admin/orders/${o.id}`} className="text-teal-700 hover:underline font-bold">
                    Manage / Print
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AdminOrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState('');

  const fetchOrder = async () => {
    try {
      const res = await ordersAPI.getById(id);
      if (res.success) {
        setOrder(res.order);
        setNewStatus(res.order.status);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleUpdateStatus = async () => {
    try {
      await ordersAPI.adminUpdateStatus(order.id, { status: newStatus });
      toast.success('Order status updated!');
      fetchOrder();
    } catch (err) {
      toast.error('Failed to update order status');
    }
  };

  if (loading) return <div className="p-12"><div className="h-48 bg-gray-200 animate-pulse rounded-2xl" /></div>;
  if (!order) return <div className="p-12 font-bold text-center">Order not found</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Action Header */}
      <div className="flex justify-between items-center print:hidden">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Order #{order.orderNumber}</h1>
          <p className="text-xs text-gray-500">Update status & print delivery invoice</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="bg-gray-900 text-white px-4 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 shadow-sm hover:bg-gray-800"
          >
            <Printer className="w-4 h-4" /> Print Invoice
          </button>
        </div>
      </div>

      {/* Status Updater Card */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-gray-700">Update Order Status:</span>
          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-bold text-teal-800"
          >
            <option value="PENDING">PENDING</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>
        <button
          onClick={handleUpdateStatus}
          className="gradient-teal text-white px-5 py-2 rounded-full text-xs font-bold shadow-md"
        >
          Save Status Update
        </button>
      </div>

      {/* Printable Invoice Card */}
      <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-xl space-y-6 print:shadow-none print:border-none">
        <div className="flex justify-between items-start border-b border-gray-100 pb-6">
          <div>
            <h2 className="font-display text-2xl font-bold text-teal-800">GIFTO PACKAGING & INVOICE</h2>
            <p className="text-xs text-gray-500">Gifto Online Pvt Ltd — NTN # 8492019-3</p>
            <p className="text-xs text-gray-500">Support Hotline: +92 300 1234567 | support@gifto.pk</p>
          </div>

          <div className="text-right">
            <span className="font-mono text-xl font-bold text-gray-900 block">{order.orderNumber}</span>
            <span className="text-xs text-gray-400">Order Date: {new Date(order.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Recipient & Delivery Info */}
        <div className="grid grid-cols-2 gap-6 text-xs text-gray-700 bg-gray-50 p-4 rounded-2xl border border-gray-100">
          <div>
            <span className="font-bold text-gray-900 uppercase block mb-1">RECIPIENT DETAILS</span>
            <p className="font-bold text-gray-900">{order.recipientName}</p>
            <p>Phone: <strong>{order.recipientPhone}</strong></p>
            <p>City: <strong>{order.deliveryCity}</strong></p>
            <p>Address: {order.deliveryAddress}</p>
          </div>

          <div>
            <span className="font-bold text-gray-900 uppercase block mb-1">DELIVERY SCHEDULE</span>
            <p>Delivery Date: <strong>{order.deliveryDate}</strong></p>
            <p>Time Slot: <strong>{order.deliveryTimeSlot}</strong></p>
            <p>Payment Method: <strong>{order.paymentMethod}</strong> ({order.paymentStatus})</p>
          </div>
        </div>

        {/* Gift Card Message */}
        {order.giftCardMessage && (
          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1">
            <span className="font-bold block uppercase text-[10px] text-amber-800">Gift Card Message to Recipient:</span>
            <p className="italic font-serif text-sm">"{order.giftCardMessage}"</p>
          </div>
        )}

        {/* Items Table */}
        <table className="w-full text-left text-xs border-t border-b border-gray-100 my-4">
          <thead>
            <tr className="text-gray-400 font-bold uppercase py-2">
              <th className="py-2">Item Description</th>
              <th className="py-2">Qty</th>
              <th className="py-2 text-right">Price</th>
              <th className="py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
            {order.items && order.items.map((item) => (
              <tr key={item.id}>
                <td className="py-2.5 font-bold text-gray-900">{item.product?.name || 'Product'}</td>
                <td className="py-2.5">{item.quantity}</td>
                <td className="py-2.5 text-right">PKR {item.priceAtPurchase.toLocaleString()}</td>
                <td className="py-2.5 text-right font-bold text-teal-800">
                  PKR {(item.priceAtPurchase * item.quantity).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Total Summary */}
        <div className="flex justify-between items-center pt-2 text-sm font-bold">
          <span>Total Order Value:</span>
          <span className="font-display text-2xl text-teal-900">PKR {order.totalAmount.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
