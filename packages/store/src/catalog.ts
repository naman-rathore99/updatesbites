import { create } from 'zustand';

// 1. Your exact Product Interface
export interface Product {
  id: number;
  title: string;
  price: number; // INR
  desc: string;
  img: string;
  category: string;
  badge?: string;
  macros?: { calories: number; protein: string; carbs: string };
  bases?: string[];
  enhancements?: { name: string; price: number }[];
  rating?: number;
  reviews?: number;
  tagline?: string;
  isAvailable?: boolean; // Added for the Admin KDS to toggle items on/off
}

// 2. The Store State Definition
interface CatalogState {
  items: Product[];

  // Admin Actions
  setCatalog: (items: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: number, updates: Partial<Product>) => void;
  deleteProduct: (id: number) => void;

  // Getters
  getProductById: (id: number) => Product | undefined;
  getProductsByCategory: (category: Product['category']) => Product[];
}

// 3. The Zustand Store
export const useCatalogStore = create<CatalogState>((set, get) => ({
  // Items will be populated from Supabase
  items: [],

  setCatalog: (items) => set({ items }),

  addProduct: (product) => set((state) => ({
    items: [...state.items, product]
  })),

  updateProduct: (id, updates) => set((state) => ({
    items: state.items.map((item) =>
      item.id === id ? { ...item, ...updates } : item
    )
  })),

  deleteProduct: (id) => set((state) => ({
    items: state.items.filter((item) => item.id !== id)
  })),

  getProductById: (id) => {
    return get().items.find((item) => item.id === id);
  },

  getProductsByCategory: (category) => {
    return get().items.filter((item) => item.category === category);
  }
}));