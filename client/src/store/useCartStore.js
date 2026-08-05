import { create } from 'zustand';
import toast from 'react-hot-toast';

const getCartStorageKey = () => {
  const userStr = localStorage.getItem('gifto_user');
  const user = userStr ? JSON.parse(userStr) : null;
  return user?.id ? `gifto_cart_${user.id}` : 'gifto_cart_guest';
};

export const useCartStore = create((set, get) => ({
  cart: JSON.parse(localStorage.getItem(getCartStorageKey()) || '[]'),
  selectedCity: localStorage.getItem('gifto_city') || 'Lahore',
  appliedCoupon: null,

  setCity: (city) => {
    localStorage.setItem('gifto_city', city);
    set({ selectedCity: city });
  },

  loadUserCart: (userId) => {
    const key = userId ? `gifto_cart_${userId}` : 'gifto_cart_guest';
    const saved = JSON.parse(localStorage.getItem(key) || '[]');
    set({ cart: saved, appliedCoupon: null });
  },

  addToCart: (product, quantity = 1) => {
    const { cart } = get();
    const existingIndex = cart.findIndex((item) => item.product.id === product.id);

    let updatedCart;
    if (existingIndex > -1) {
      updatedCart = [...cart];
      updatedCart[existingIndex].quantity += quantity;
    } else {
      updatedCart = [...cart, { product, quantity }];
    }

    const key = getCartStorageKey();
    localStorage.setItem(key, JSON.stringify(updatedCart));
    set({ cart: updatedCart });
    toast.success(`${product.name} added to cart! 🎁`);
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(productId);
      return;
    }

    const { cart } = get();
    const updatedCart = cart.map((item) =>
      item.product.id === productId ? { ...item, quantity } : item
    );

    const key = getCartStorageKey();
    localStorage.setItem(key, JSON.stringify(updatedCart));
    set({ cart: updatedCart });
  },

  removeFromCart: (productId) => {
    const { cart } = get();
    const updatedCart = cart.filter((item) => item.product.id !== productId);
    const key = getCartStorageKey();
    localStorage.setItem(key, JSON.stringify(updatedCart));
    set({ cart: updatedCart });
    toast.error('Item removed from cart');
  },

  applyCoupon: (coupon) => {
    set({ appliedCoupon: coupon });
    toast.success(`Coupon ${coupon.code} applied!`);
  },

  clearCoupon: () => {
    set({ appliedCoupon: null });
  },

  clearCart: () => {
    const key = getCartStorageKey();
    localStorage.removeItem(key);
    set({ cart: [], appliedCoupon: null });
  },

  getSubtotal: () => {
    return get().cart.reduce((total, item) => {
      const price = item.product.salePrice || item.product.price;
      return total + price * item.quantity;
    }, 0);
  },
}));
