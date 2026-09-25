import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number; // flat total price for this line at quantity=1
  originalPrice: number;
  quantity: number;
  imageBg: string;
  includes?: string[]; // display list of what's inside a set (e.g. serum + cream)
  sku?: string;
}

interface CartState {
  items: CartItem[];
  isCheckoutOpen: boolean;
  openCheckout: () => void;
  closeCheckout: () => void;
  // Replaces the cart with a single selected bundle/set (only one at a time)
  setMainSet: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  subtotal: () => number;
}

export const VAT_RATE = 0;   // prices are all-inclusive
export const COD_FEE = 0;    // no COD fee

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isCheckoutOpen: false,
      openCheckout: () => set({ isCheckoutOpen: true }),
      closeCheckout: () => set({ isCheckoutOpen: false }),
      setMainSet: (item) => set({ items: [{ ...item, quantity: 1 }] }),
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
    { name: 'sellura-cart', partialize: (s) => ({ items: s.items }) }
  )
);
