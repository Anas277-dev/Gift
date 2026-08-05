import { create } from 'zustand';
import { useCartStore } from './useCartStore';
import { useWishlistStore } from './useWishlistStore';

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('gifto_user') || 'null'),
  token: localStorage.getItem('gifto_token') || null,

  setAuth: (user, token) => {
    localStorage.setItem('gifto_user', JSON.stringify(user));
    localStorage.setItem('gifto_token', token);

    // Switch cart & wishlist to this specific user's saved items
    useCartStore.getState().loadUserCart(user.id);
    useWishlistStore.getState().loadUserWishlist(user.id);

    set({ user, token });
  },

  updateUser: (updatedFields) => {
    set((state) => {
      const newUser = { ...state.user, ...updatedFields };
      localStorage.setItem('gifto_user', JSON.stringify(newUser));
      return { user: newUser };
    });
  },

  logout: () => {
    localStorage.removeItem('gifto_user');
    localStorage.removeItem('gifto_token');

    // Revert to guest cart & wishlist on logout
    useCartStore.getState().loadUserCart(null);
    useWishlistStore.getState().loadUserWishlist(null);

    set({ user: null, token: null });
  },
}));
