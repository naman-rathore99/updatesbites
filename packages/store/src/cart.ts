import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string; // Dynamic unique ID for cart iteration (e.g. "ITEM_ID-BASE_ID")
  productId: number;
  title: string;
  price: number;
  quantity: number;
  img: string;
  base?: string;
  enhancements?: { name: string; price: number }[];
}

interface CartState {
  items: CartItem[];
  
  // Actions
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  
  // Computed
  getSubtotal: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (newItem) => set((state) => {
        // Construct a unique ID based on the product and its configuration
        const enhancementsKey = newItem.enhancements?.map(e => e.name).sort().join('-') || 'none';
        const uniqueCartId = `${newItem.productId}-${newItem.base || 'nobase'}-${enhancementsKey}`;
        
        const existingItem = state.items.find(item => item.id === uniqueCartId);
        
        if (existingItem) {
          return {
            items: state.items.map(item => 
              item.id === uniqueCartId 
                ? { ...item, quantity: item.quantity + newItem.quantity }
                : item
            )
          };
        }
        
        return {
          items: [...state.items, { ...newItem, id: uniqueCartId }]
        };
      }),

      removeItem: (id) => set((state) => ({
        items: state.items.filter(item => item.id !== id)
      })),

      updateQuantity: (id, quantity) => set((state) => ({
        items: state.items.map(item => 
          item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
        )
      })),

      clearCart: () => set({ items: [] }),

      getSubtotal: () => {
        const { items } = get();
        return items.reduce((acc, item) => {
          const enhancementsTotal = item.enhancements?.reduce((sum, e) => sum + e.price, 0) || 0;
          return acc + ((item.price + enhancementsTotal) * item.quantity);
        }, 0);
      },

      getTotalItems: () => {
        const { items } = get();
        return items.reduce((acc, item) => acc + item.quantity, 0);
      }
    }),
    {
      name: 'bites-cart-storage',
    }
  )
);
