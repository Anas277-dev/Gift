import { create } from 'zustand';
import toast from 'react-hot-toast';

const getWishlistStorageKey = () => {
  const userStr = localStorage.getItem('gifto_user');
  const user = userStr ? JSON.parse(userStr) : null;
  return user?.id ? `gifto_wishlist_${user.id}` : 'gifto_wishlist_guest';
};

export const useWishlistStore = create((set, get) => ({
  wishlist: JSON.parse(localStorage.getItem(getWishlistStorageKey()) || '[]'),

  loadUserWishlist: (userId) => {
    const key = userId ? `gifto_wishlist_${userId}` : 'gifto_wishlist_guest';
    const saved = JSON.parse(localStorage.getItem(key) || '[]');
    set({ wishlist: saved });
  },

  toggleWishlist: (product) => {
    const { wishlist } = get();
    const exists = wishlist.some((item) => item.id === product.id);

    let updated;
    if (exists) {
      updated = wishlist.filter((item) => item.id !== product.id);
      toast.error('Removed from wishlist');
    } else {
      updated = [...wishlist, product];
      toast.success('Saved to wishlist! ❤️');
    }

    const key = getWishlistStorageKey();
    localStorage.setItem(key, JSON.stringify(updated));
    set({ wishlist: updated });
  },

  isInWishlist: (productId) => {
    return get().wishlist.some((item) => item.id === productId);
  },

  clearWishlist: () => {
    const key = getWishlistStorageKey();
    localStorage.removeItem(key);
    set({ wishlist: [] });
  },
}));
