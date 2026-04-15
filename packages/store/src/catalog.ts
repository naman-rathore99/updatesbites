import { create } from 'zustand';

// 1. Your exact Product Interface
export interface Product {
  id: number;
  title: string;
  price: number; // INR
  desc: string;
  img: string;
  category: 'bowls' | 'burgers' | 'desserts';
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
  // Your exact catalog array as the initial state
  items: [
    // ── Signature Bowls ──
    {
      id: 1,
      title: 'Wild Tuna Bowl',
      price: 599,
      desc: 'Fresh pacific tuna, ginger soy, jasmine rice, and crisp organic vegetables.',
      img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=600&fit=crop',
      category: 'bowls',
      badge: 'Popular',
      macros: { calories: 540, protein: '34g', carbs: '18g' },
      bases: ['Jasmine Rice', 'Organic Quinoa', 'Spring Mix'],
      enhancements: [
        { name: 'Extra Avocado', price: 79 },
        { name: 'Spicy Sriracha Mayo', price: 49 },
      ],
      rating: 4.9,
      reviews: 230,
      tagline: 'Sustainably Sourced',
      isAvailable: true,
    },
    {
      id: 2,
      title: 'Harvest Grain',
      price: 499,
      desc: 'Roasted seasonal squash, ancient grains, kale, and a tahini lemon dressing.',
      img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=600&fit=crop',
      category: 'bowls',
      macros: { calories: 480, protein: '22g', carbs: '42g' },
      bases: ['Jasmine Rice', 'Organic Quinoa', 'Spring Mix'],
      enhancements: [
        { name: 'Extra Avocado', price: 79 },
        { name: 'Roasted Chickpeas', price: 59 },
      ],
      rating: 4.7,
      reviews: 142,
      tagline: 'Farm Fresh',
      isAvailable: true,
    },
    {
      id: 3,
      title: 'Zen Med Bowl',
      price: 549,
      desc: 'Quinoa, charred heirloom tomatoes, cucumber, feta, and house-made hummus.',
      img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&h=600&fit=crop',
      category: 'bowls',
      macros: { calories: 460, protein: '28g', carbs: '35g' },
      bases: ['Jasmine Rice', 'Organic Quinoa', 'Spring Mix'],
      enhancements: [
        { name: 'Extra Feta', price: 69 },
        { name: 'Spicy Sriracha Mayo', price: 49 },
      ],
      rating: 4.8,
      reviews: 187,
      tagline: 'Mediterranean Soul',
      isAvailable: true,
    },
    // ── Artisan Burgers ──
    {
      id: 4,
      title: 'The Truffle Brie',
      price: 749,
      desc: 'A5 Wagyu blend, double cream brie, balsamic reduction, and fresh black truffle shavings.',
      img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=600&fit=crop',
      category: 'burgers',
      badge: "Chef's Choice",
      macros: { calories: 720, protein: '42g', carbs: '38g' },
      enhancements: [
        { name: 'Extra Truffle', price: 149 },
        { name: 'Caramelised Onions', price: 49 },
      ],
      rating: 4.9,
      reviews: 312,
      tagline: 'House Signature',
      isAvailable: true,
    },
    {
      id: 5,
      title: 'Smokestack',
      price: 599,
      desc: 'Aged cheddar, crispy shallots, house bourbon BBQ sauce, and pickled jalapeños.',
      img: 'https://images.unsplash.com/photo-1586816001966-79b736744398?w=600&h=600&fit=crop',
      category: 'burgers',
      macros: { calories: 680, protein: '38g', carbs: '44g' },
      enhancements: [
        { name: 'Bacon Strips', price: 99 },
        { name: 'Extra Cheese', price: 59 },
      ],
      rating: 4.6,
      reviews: 198,
      tagline: 'Smoky Legend',
      isAvailable: true,
    },
    // ── Decadent Desserts ──
    {
      id: 6,
      title: 'Zesty Gold Tart',
      price: 399,
      desc: 'Meyer lemon curd, torched Swiss meringue, and a buttery shortbread crust dusted with gold.',
      img: 'https://images.unsplash.com/photo-1514517521153-1be72277b32f?w=600&h=800&fit=crop',
      category: 'desserts',
      macros: { calories: 340, protein: '6g', carbs: '52g' },
      rating: 4.8,
      reviews: 156,
      tagline: 'Patisserie Craft',
      isAvailable: true,
    },
    {
      id: 7,
      title: 'Midnight Ganache',
      price: 449,
      desc: '70% dark chocolate souffle with a molten center and sea salt caramel drizzle.',
      img: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=600&h=800&fit=crop',
      category: 'desserts',
      macros: { calories: 420, protein: '8g', carbs: '48g' },
      rating: 4.9,
      reviews: 201,
      tagline: 'Chocolatier Select',
      isAvailable: true,
    },
    {
      id: 8,
      title: 'Berry Cloud',
      price: 379,
      desc: 'Light meringue topped with chantilly cream and seasonal forest berries.',
      img: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&h=800&fit=crop',
      category: 'desserts',
      macros: { calories: 280, protein: '4g', carbs: '46g' },
      rating: 4.7,
      reviews: 134,
      tagline: 'Light & Dreamy',
      isAvailable: true,
    },
  ],

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