"use client";

import { Star, Plus, Check, Minus, ShoppingCart } from "lucide-react";
import Link from "next/link";
// 1. Import BOTH stores and your new Product type
import { useCartStore, useCatalogStore, type Product } from "@bites/store";

// --- FIXED QUICK ADD COMPONENT ---
// 2. Update prop type to use the global Product interface
function QuickAddButton({ product }: { product: Product }) {
  const items = useCartStore((state: any) => state.items || []);
  const addItem = useCartStore((state: any) => state.addItem);
  const updateQuantity = useCartStore((state: any) => state.updateQuantity);
  const removeItem = useCartStore((state: any) => state.removeItem);

  const cartItem = items.find((item: any) => item.productId === product.id);
  const quantity = cartItem?.quantity || 0;

  const handleInitialAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      title: product.title,
      price: product.price,
      quantity: 1,
      img: product.img, // Updated from image_url
    });
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(product.id, quantity + 1);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity <= 1) {
      removeItem(product.id);
    } else {
      updateQuantity(product.id, quantity - 1);
    }
  };

  if (quantity > 0) {
    return (
      <div
        className="flex items-center justify-between w-full h-full rounded-xl overflow-hidden shadow-md border border-neutral-200 bg-white"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <button
          onClick={handleDecrement}
          className="w-1/3 h-full flex items-center justify-center text-brand-primary hover:bg-neutral-50 transition-colors"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <span className="w-1/3 text-center font-bold text-sm text-neutral-900 select-none">
          {quantity}
        </span>
        <button
          onClick={handleIncrement}
          className="w-1/3 h-full flex items-center justify-center text-brand-primary hover:bg-neutral-50 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleInitialAdd}
      className="w-full h-full bg-white border border-neutral-200 text-brand-primary font-extrabold text-[13px] tracking-wide rounded-xl shadow-md hover:shadow-lg hover:border-brand-primary/20 transition-all flex items-center justify-center"
    >
      ADD
      <span className="absolute top-0 right-1 text-[8px]">+</span>
    </button>
  );
}

// --- MAIN PAGE COMPONENT ---
export default function Home() {
  // 3. Connect directly to your global catalog store! (No fetch needed)
  const menuItems = useCatalogStore((state) => state.items);

  const CATEGORY_LABELS: Record<string, string> = {
    bowls: "Signature Bowls",
    burgers: "Artisan Burgers",
    desserts: "Decadent Desserts",
  };

  // Only show categories that actually have items, and respect the isAvailable flag
  const availableItems = menuItems.filter((item) => item.isAvailable !== false);
  const categoriesInUse = Array.from(
    new Set(availableItems.map((i) => i.category)),
  );

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <main className="flex flex-col container mx-auto px-6 lg:px-12 my-12 lg:my-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <div className="flex flex-col items-start text-left">
            <h3 className="text-sm font-bold tracking-widest text-brand-primary uppercase mb-6 drop-shadow-sm">
              The Art of Cloud Dining
            </h3>
            <h1 className="font-display font-extrabold text-7xl md:text-8xl lg:text-[100px] leading-[0.9] text-black tracking-tight mb-8">
              Elevated
              <br />
              <span className="italic text-brand-primary">Flavors</span>
              <br />
              Delivered.
            </h1>
            <p className="text-lg text-brand-secondary mb-10 leading-relaxed max-w-md font-medium">
              A curated culinary experience from our private kitchen to your
              table. We blend traditional techniques with modern pantry
              essentials.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#menu"
                className="px-8 py-3.5 text-sm font-bold tracking-wide text-white bg-brand-primary rounded-full hover:bg-orange-700 transition-all shadow-md"
              >
                ORDER NOW
              </a>
              <a
                href="#menu"
                className="px-8 py-3.5 text-sm font-bold tracking-wide text-brand-secondary bg-blue-100 rounded-full hover:bg-blue-200 transition-all"
              >
                VIEW MENU
              </a>
            </div>
          </div>

          <div className="relative w-full h-[500px] lg:h-[600px] rounded-[40px] overflow-hidden shadow-soft group">
            <img
              src="https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
              alt="Gourmet Pasta"
              className="absolute inset-0 w-full h-full object-cover origin-center group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute bottom-8 left-8 bg-white/95 backdrop-blur-sm px-6 py-4 rounded-3xl shadow-soft flex items-center gap-4">
              <div className="w-12 h-12 bg-[#F1E5C4] rounded-full flex items-center justify-center">
                <Star className="w-5 h-5 fill-[#C7913A] text-[#C7913A]" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-black text-lg">
                  4.9/5 Rating
                </span>
                <span className="text-xs font-semibold text-neutral-500">
                  2,000+ Happy Gourmets
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Section */}
        <section
          id="menu"
          className="mt-40 mb-24 flex flex-col items-center scroll-mt-8"
        >
          <div className="text-center mb-16">
            <h4 className="text-xs font-bold tracking-widest text-brand-primary uppercase mb-4">
              Curated Selection
            </h4>
            <h2 className="font-display font-extrabold text-5xl md:text-6xl text-neutral-900 tracking-tight">
              Our Menu
            </h2>
          </div>

          <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-10 items-start">
            {/* Sticky Sidebar Navigation (Desktop) */}
            <nav className="w-full lg:w-64 shrink-0 lg:sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto hidden lg:block pr-4 space-y-1">
              {categoriesInUse.map((categoryId) => {
                const label = CATEGORY_LABELS[categoryId] || categoryId;
                return (
                  <a
                    key={categoryId}
                    href={`#category-${categoryId}`}
                    className="block text-sm font-bold text-neutral-600 hover:text-black py-3 px-4 rounded-xl hover:bg-neutral-100 transition-colors capitalize border-l-4 border-transparent hover:border-brand-primary"
                  >
                    {label}
                  </a>
                );
              })}
            </nav>

            {/* Horizontal Navigation (Mobile) */}
            <nav className="w-full lg:hidden flex overflow-x-auto no-scrollbar gap-2 pb-4 -mb-4 sticky top-16 bg-brand-bg/95 backdrop-blur-md z-40 py-2 border-b border-neutral-200">
              {categoriesInUse.map((categoryId) => {
                const label = CATEGORY_LABELS[categoryId] || categoryId;
                return (
                  <a
                    key={categoryId}
                    href={`#category-${categoryId}`}
                    className="shrink-0 text-[11px] font-bold text-neutral-600 bg-white border border-neutral-200 px-4 py-2 rounded-full hover:bg-neutral-50 hover:text-brand-primary transition-colors capitalize"
                  >
                    {label}
                  </a>
                );
              })}
            </nav>

            {/* Main Content Area */}
            <div className="flex-1 w-full flex flex-col gap-12 bg-white rounded-3xl p-6 md:p-10 shadow-soft border border-neutral-100">
              {categoriesInUse.map((categoryId) => {
                const itemsInCategory = availableItems.filter(
                  (i) => i.category === categoryId,
                );

                const label = CATEGORY_LABELS[categoryId] || categoryId;

                return (
                  <div
                    key={categoryId}
                    id={`category-${categoryId}`}
                    className="scroll-mt-32"
                  >
                    <h3 className="font-display font-extrabold text-3xl text-neutral-900 mb-8 capitalize">
                      {label}
                    </h3>
                    <div className="flex flex-col gap-10">
                      {itemsInCategory.map((item) => (
                        <div
                          key={item.id}
                          className="flex gap-4 md:gap-8 pb-10 border-b border-neutral-100 border-dashed last:border-0 last:pb-0"
                        >
                          {/* Item Info (Left) */}
                          <div className="flex-1 min-w-0 flex flex-col justify-center">
                            {item.badge && (
                              <span className="inline-flex w-max items-center bg-[#B88029]/10 text-[#B88029] text-[10px] font-bold px-2 py-0.5 rounded-md mb-2 tracking-wider uppercase">
                                ⭐ {item.badge}
                              </span>
                            )}
                            <h4 className="font-bold text-lg md:text-xl text-neutral-900 leading-tight mb-1">
                              {item.title}
                            </h4>
                            <span className="font-bold text-neutral-900 mb-3 block">
                              ₹{item.price}
                            </span>

                            {item.rating && (
                              <div className="flex items-center gap-1.5 text-xs text-brand-secondary font-bold mb-3">
                                <span className="bg-green-600 text-white rounded text-[10px] px-1.5 py-0.5 inline-flex items-center gap-0.5">
                                  ⭐ {item.rating}
                                </span>
                                <span>({item.reviews || "50+"})</span>
                              </div>
                            )}
                            <p className="text-sm text-neutral-500 leading-relaxed hidden md:block">
                              {item.desc}
                            </p>
                          </div>

                          {/* Item Image & Add Button (Right) */}
                          <div className="w-[120px] h-[120px] md:w-[156px] md:h-[156px] shrink-0 relative flex flex-col items-center">
                            <Link
                              href={`/item/${item.id}`}
                              className="block w-full h-full relative rounded-2xl overflow-hidden bg-neutral-50"
                            >
                              {item.img ? (
                                <img
                                  src={item.img}
                                  alt={item.title}
                                  className="absolute inset-0 w-full h-full object-cover transform hover:scale-110 transition-transform duration-700"
                                />
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-neutral-100 text-neutral-300">
                                  No Image
                                </div>
                              )}
                            </Link>

                            <div className="absolute -bottom-4 z-10 w-[100px] h-10 shadow-[0_4px_12px_rgba(0,0,0,0.1)] rounded-xl bg-white overflow-visible">
                              <QuickAddButton product={item} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Features Block */}
        <section className="mb-24 flex flex-col w-full">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#F1E5C4] text-[#C7913A] rounded-full flex items-center justify-center mb-6 shadow-sm">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
                </svg>
              </div>
              <h4 className="font-display font-bold text-xl text-neutral-900 mb-3">
                Safe & Secure Payments
              </h4>
              <p className="text-xs text-neutral-500 leading-relaxed font-medium">
                Encrypted transactions via leading gateway providers for your
                peace of mind.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#F1E5C4] text-[#C7913A] rounded-full flex items-center justify-center mb-6 shadow-sm">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
              </div>
              <h4 className="font-display font-bold text-xl text-neutral-900 mb-3">
                Contactless Delivery
              </h4>
              <p className="text-xs text-neutral-500 leading-relaxed font-medium">
                Your order is left safely at your door with zero-contact
                handovers.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#F1E5C4] text-[#C7913A] rounded-full flex items-center justify-center mb-6 shadow-sm">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 13.5c0-2.49-2.01-4.5-4.5-4.5S10 11.01 10 13.5 12.01 18 14.5 18 19 15.99 19 13.5zM14.5 16c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
              </div>
              <h4 className="font-display font-bold text-xl text-neutral-900 mb-3">
                Sanitized Kitchens
              </h4>
              <p className="text-xs text-neutral-500 leading-relaxed font-medium">
                Our kitchens adhere to the highest clinical hygiene and safety
                protocols.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#F1E5C4] text-[#C7913A] rounded-full flex items-center justify-center mb-6 shadow-sm">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M21 3L3 10.53v.98l6.84 2.65L12.48 21h.98L21 3z" />
                </svg>
              </div>
              <h4 className="font-display font-bold text-xl text-neutral-900 mb-3">
                Real-time Tracking
              </h4>
              <p className="text-xs text-neutral-500 leading-relaxed font-medium">
                Watch your meal's journey from our oven to your doorstep in
                real-time.
              </p>
            </div>
          </div>
        </section>

        {/* Subscribe Section */}
        <section className="mb-24 w-full bg-brand-primary rounded-[40px] px-8 py-20 flex flex-col items-center text-center text-white shadow-xl">
          <h2 className="font-display font-extrabold text-5xl md:text-7xl tracking-tight mb-6 leading-none shadow-sm">
            Ready to taste the
            <br />
            magic?
          </h2>
          <p className="font-sans font-medium text-sm md:text-base opacity-90 max-w-lg mb-10 leading-relaxed">
            Join our community of flavor seekers and get 20% off your first
            culinary adventure.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-black/15 placeholder-white/60 text-white rounded-full px-6 py-4 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm font-semibold transition-all"
            />
            <button className="bg-white text-brand-primary font-bold text-sm tracking-widest uppercase rounded-full px-8 py-4 shadow-lg hover:bg-neutral-50 transition-colors">
              Subscribe
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
