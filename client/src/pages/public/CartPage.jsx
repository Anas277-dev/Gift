import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, ShieldCheck, Tag, ShoppingBag, MapPin } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { couponsAPI } from '../../api/endpoints';
import toast from 'react-hot-toast';

export default function CartPage() {
  const navigate = useNavigate();
  const {
    cart,
    updateQuantity,
    removeFromCart,
    getSubtotal,
    selectedCity,
    appliedCoupon,
    applyCoupon,
    clearCoupon,
  } = useCartStore();

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  const subtotal = getSubtotal();
  const deliveryFee = 250;
  const discount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const grandTotal = Math.max(0, subtotal + deliveryFee - discount);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;

    setValidatingCoupon(true);
    try {
      const res = await couponsAPI.validate(couponCodeInput.trim(), subtotal);
      if (res.success) {
        applyCoupon(res.coupon);
        setCouponCodeInput('');
      }
    } catch (err) {
      toast.error(err.message || 'Invalid coupon code');
    } finally {
      setValidatingCoupon(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-20 h-20 bg-teal-50 text-teal-700 rounded-full flex items-center justify-center mx-auto text-3xl">
          🎁
        </div>
        <h2 className="font-display text-2xl font-bold text-gray-900">Your Shopping Cart is Empty</h2>
        <p className="text-sm text-gray-500 max-w-sm mx-auto">
          Explore our fresh bakery cakes, flower bouquets, and gift hampers to deliver love in Pakistan!
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 bg-teal-700 hover:bg-teal-800 text-white font-bold px-6 py-3 rounded-full text-sm transition-all"
        >
          Explore All Gifts <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900">
        Shopping Cart ({cart.length} items)
      </h1>

      <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-100">
            {cart.map(({ product, quantity }) => {
              const price = product.salePrice || product.price;
              const isDeliverable = product.deliverableCities
                ? product.deliverableCities.includes(selectedCity)
                : true;

              return (
                <div key={product.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0 w-full sm:w-auto">
                    <img
                      src={product.images && product.images[0] ? product.images[0] : 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&auto=format&fit=crop&q=80'}
                      alt={product.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-gray-100 flex-shrink-0"
                    />

                    <div className="min-w-0 space-y-1">
                      <Link
                        to={`/product/${product.slug}`}
                        className="font-bold text-gray-900 text-sm sm:text-base hover:text-teal-700 line-clamp-1"
                      >
                        {product.name}
                      </Link>

                      <p className="text-xs text-teal-800 font-bold">
                        PKR {price.toLocaleString()}
                      </p>

                      {!isDeliverable && (
                        <p className="text-[11px] font-bold text-rose-600">
                          ⚠️ Not deliverable to {selectedCity}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-50">
                    <div className="flex items-center border border-gray-200 rounded-full bg-gray-50 p-1 text-xs">
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="w-7 h-7 rounded-full bg-white font-bold text-gray-700 flex items-center justify-center shadow-sm"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-bold text-gray-900">{quantity}</span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="w-7 h-7 rounded-full bg-white font-bold text-gray-700 flex items-center justify-center shadow-sm"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="p-2 text-gray-400 hover:text-rose-500 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Summary & Coupon */}
        <div className="space-y-6">
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900 text-base sm:text-lg border-b border-gray-100 pb-3">
              Order Summary
            </h3>

            {/* Delivery city */}
            <div className="flex justify-between items-center text-xs text-gray-600 bg-teal-50/50 p-2.5 rounded-xl border border-teal-100">
              <span className="flex items-center gap-1 font-semibold text-teal-900">
                <MapPin className="w-3.5 h-3.5 text-coral-500" /> Target City:
              </span>
              <strong className="text-teal-900">{selectedCity}</strong>
            </div>

            {/* Subtotal / Delivery / Discount */}
            <div className="space-y-2 text-xs text-gray-600 pt-1">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="font-bold text-gray-900">PKR {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Standard Delivery Charge:</span>
                <span className="font-bold text-gray-900">PKR {deliveryFee.toLocaleString()}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Coupon Discount ({appliedCoupon.code}):</span>
                  <span>- PKR {discount.toLocaleString()}</span>
                </div>
              )}
            </div>

            {/* Coupon Code Input */}
            <div className="pt-2">
              {appliedCoupon ? (
                <div className="flex justify-between items-center bg-emerald-50 text-emerald-800 p-2.5 rounded-xl text-xs font-semibold">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" /> Coupon {appliedCoupon.code} Applied
                  </span>
                  <button onClick={clearCoupon} className="text-rose-600 underline font-bold">
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter Coupon Code (e.g. GIFTO10)"
                    value={couponCodeInput}
                    onChange={(e) => setCouponCodeInput(e.target.value)}
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs uppercase min-w-0"
                  />
                  <button
                    type="submit"
                    disabled={validatingCoupon}
                    className="bg-gray-900 text-white font-bold px-4 py-2 rounded-xl text-xs hover:bg-gray-800 flex-shrink-0"
                  >
                    Apply
                  </button>
                </form>
              )}
            </div>

            {/* Grand Total */}
            <div className="pt-4 border-t border-gray-100 flex justify-between items-baseline">
              <span className="font-bold text-gray-900 text-sm sm:text-base">Grand Total:</span>
              <span className="font-display font-extrabold text-xl sm:text-2xl text-teal-800">
                PKR {grandTotal.toLocaleString()}
              </span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full gradient-teal text-white font-bold py-3.5 rounded-full shadow-lg hover:opacity-95 transition-all text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
