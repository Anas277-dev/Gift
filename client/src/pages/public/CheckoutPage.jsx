import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin, Calendar, Clock, CreditCard, Banknote, ShieldCheck, CheckCircle } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { ordersAPI } from '../../api/endpoints';
import toast from 'react-hot-toast';

const TIME_SLOTS = [
  'Morning Delivery (10:00 AM – 01:00 PM)',
  'Afternoon Delivery (02:00 PM – 05:00 PM)',
  'Evening Delivery (06:00 PM – 09:00 PM)',
  'Midnight Surprise Delivery (11:45 PM – 12:15 AM)',
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, selectedCity, getSubtotal, appliedCoupon, clearCart } = useCartStore();
  const { user } = useAuthStore();

  const subtotal = getSubtotal();
  const deliveryCharge = 250;
  const discount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const grandTotal = Math.max(0, subtotal + deliveryCharge - discount);

  // Form Fields
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryCity, setDeliveryCity] = useState(selectedCity || 'Lahore');
  const [giftCardMessage, setGiftCardMessage] = useState('');
  const [deliveryDate, setDeliveryDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [deliveryTimeSlot, setDeliveryTimeSlot] = useState(TIME_SLOTS[0]);
  const [paymentMethod, setPaymentMethod] = useState('Bank Transfer');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!recipientName || !recipientPhone || !deliveryAddress) {
      toast.error('Please fill in recipient details');
      return;
    }

    setSubmitting(true);
    try {
      const orderData = {
        items: cart.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
        deliveryCity,
        deliveryAddress,
        recipientName,
        recipientPhone,
        giftCardMessage,
        deliveryDate,
        deliveryTimeSlot,
        paymentMethod,
        couponCode: appliedCoupon ? appliedCoupon.code : undefined,
      };

      const res = await ordersAPI.create(orderData);
      if (res.success) {
        toast.success('Order placed successfully! 🎉');
        clearCart();
        navigate(`/order-confirmation/${res.order.id}`);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Your cart is empty</h2>
        <Link to="/shop" className="text-teal-700 underline font-semibold mt-2 inline-block">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-gray-900">
        Checkout & Delivery Details
      </h1>

      <form onSubmit={handleSubmitOrder} className="grid lg:grid-cols-3 gap-8 items-start">
        {/* Recipient & Delivery Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recipient Details */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2 border-b border-gray-100 pb-3">
              <MapPin className="w-5 h-5 text-teal-700" /> Recipient & Delivery Address in Pakistan
            </h3>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Recipient Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ayesha Khan"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-teal-700"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Recipient Mobile Phone *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. +92 300 1234567"
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-teal-700"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Delivery City *</label>
                <select
                  value={deliveryCity}
                  onChange={(e) => setDeliveryCity(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-semibold focus:ring-2 focus:ring-teal-700"
                >
                  {['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Gujranwala', 'Sialkot', 'Peshawar', 'Hyderabad', 'Sahiwal', 'Bahawalpur', 'Rahim Yar Khan', 'Jhelum', 'Gujrat'].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Full Delivery Address *</label>
                <input
                  type="text"
                  required
                  placeholder="House #, Street, Block, Area, Landmark..."
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-teal-700"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Free Gift Greeting Card Message 💌</label>
              <textarea
                placeholder="Write your custom message to be printed on the free gift card..."
                rows={3}
                value={giftCardMessage}
                onChange={(e) => setGiftCardMessage(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-teal-700"
              />
            </div>
          </div>

          {/* Delivery Date & Time Slot Picker */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2 border-b border-gray-100 pb-3">
              <Calendar className="w-5 h-5 text-teal-700" /> Delivery Schedule & Slot
            </h3>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Delivery Date *</label>
                <input
                  type="date"
                  required
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-semibold focus:ring-2 focus:ring-teal-700"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Time Slot *</label>
                <select
                  value={deliveryTimeSlot}
                  onChange={(e) => setDeliveryTimeSlot(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-semibold focus:ring-2 focus:ring-teal-700"
                >
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Payment Method Section */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2 border-b border-gray-100 pb-3">
              <CreditCard className="w-5 h-5 text-teal-700" /> Select Payment Method
            </h3>

            <div className="grid sm:grid-cols-3 gap-3">
              <label
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'Bank Transfer'
                    ? 'border-teal-700 bg-teal-50 text-teal-900 font-bold shadow-sm'
                    : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="Bank Transfer"
                  checked={paymentMethod === 'Bank Transfer'}
                  onChange={() => setPaymentMethod('Bank Transfer')}
                  className="sr-only"
                />
                <div className="text-xs space-y-1">
                  <span className="text-base block">🏦</span>
                  <span>Bank Transfer</span>
                  <p className="text-[10px] text-gray-500 font-normal">Meezan Bank / Raast</p>
                </div>
              </label>

              <label
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'Credit/Debit Card'
                    ? 'border-teal-700 bg-teal-50 text-teal-900 font-bold shadow-sm'
                    : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="Credit/Debit Card"
                  checked={paymentMethod === 'Credit/Debit Card'}
                  onChange={() => setPaymentMethod('Credit/Debit Card')}
                  className="sr-only"
                />
                <div className="text-xs space-y-1">
                  <span className="text-base block">💳</span>
                  <span>Credit / Debit Card</span>
                  <p className="text-[10px] text-gray-500 font-normal">Visa, Mastercard, Intl</p>
                </div>
              </label>

              <label
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'Cash on Delivery'
                    ? 'border-teal-700 bg-teal-50 text-teal-900 font-bold shadow-sm'
                    : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="Cash on Delivery"
                  checked={paymentMethod === 'Cash on Delivery'}
                  onChange={() => setPaymentMethod('Cash on Delivery')}
                  className="sr-only"
                />
                <div className="text-xs space-y-1">
                  <span className="text-base block">💵</span>
                  <span>Cash on Delivery</span>
                  <p className="text-[10px] text-gray-500 font-normal">Pay upon arrival</p>
                </div>
              </label>
            </div>

            {/* Bank details info box */}
            {paymentMethod === 'Bank Transfer' && (
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-xs space-y-1 text-amber-900">
                <p className="font-bold">Meezan Bank Limited</p>
                <p>Account Title: <strong>Gifto Online Pvt Ltd</strong></p>
                <p>Account #: <strong>01020104928192</strong> | IBAN: <strong>PK36MEZN0001020104928192</strong></p>
                <p className="text-[10px] text-amber-800 pt-1">
                  After placing order, please send transaction receipt via WhatsApp to +92 300 1234567.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary Column */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <h3 className="font-bold text-gray-900 text-lg border-b border-gray-100 pb-3">
            Review Order ({cart.length} Items)
          </h3>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1 divide-y divide-gray-50">
            {cart.map(({ product, quantity }) => (
              <div key={product.id} className="pt-2 flex justify-between items-center text-xs">
                <div className="pr-2">
                  <p className="font-bold text-gray-900 line-clamp-1">{product.name}</p>
                  <p className="text-gray-400">Qty: {quantity}</p>
                </div>
                <span className="font-bold text-teal-800">
                  PKR {((product.salePrice || product.price) * quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-3 space-y-2 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-bold text-gray-900">PKR {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee ({deliveryCity}):</span>
              <span className="font-bold text-gray-900">PKR {deliveryCharge.toLocaleString()}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Discount:</span>
                <span>- PKR {discount.toLocaleString()}</span>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-gray-100 flex justify-between items-baseline">
            <span className="font-bold text-gray-900 text-base">Total Payable:</span>
            <span className="font-display font-extrabold text-2xl text-teal-800">
              PKR {grandTotal.toLocaleString()}
            </span>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full gradient-teal hover:opacity-95 text-white font-bold py-3.5 rounded-full shadow-lg transition-all text-sm uppercase tracking-wider flex items-center justify-center gap-2"
          >
            {submitting ? 'Processing Order...' : 'Confirm & Place Order 🎁'}
          </button>
        </div>
      </form>
    </div>
  );
}
