import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice: number;
  quantity: number;
  imageBg: string;
  bundlePrice?: number;  // all-in flat price (VAT + shipping included)
  bundleQty?: number;    // physical units in this bundle
}

interface CartState {
  items: CartItem[];
  isCheckoutOpen: boolean;
  openCheckout: () => void;
  closeCheckout: () => void;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  setBundle: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  subtotal: () => number;
}

export const VAT_RATE = 0.15;
export const COD_FEE = 20;

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isCheckoutOpen: false,
      openCheckout: () => set({ isCheckoutOpen: true }),
      closeCheckout: () => set({ isCheckoutOpen: false }),
      // Replace cart with a single bundle item (clears previous cart)
      setBundle: (item) => set({ items: [{ ...item, quantity: 1 }] }),
      addItem: (item) => {
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: 1 }] };
        });
      },
      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      updateQuantity: (id, quantity) => {
        if (quantity < 1) { get().removeItem(id); return; }
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        }));
      },
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    { name: 'selora-cart', partialize: (s) => ({ items: s.items }) }
  )
);
