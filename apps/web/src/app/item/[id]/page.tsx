"use client";

import { ArrowLeft, Star, ShoppingCart, Check } from "lucide-react";
import Link from "next/link";
import { useState, use } from "react";
// 1. Import BOTH stores and the Product type
import { useCartStore, useCatalogStore, type Product } from "@bites/store";

export default function ItemDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  // 2. Fetch directly from Zustand using the parsed ID
  const product = useCatalogStore((state) => state.getProductById(Number(id)));

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addItemToCart = useCartStore((state) => state.addItem);

  // We no longer need the loading state since Zustand is synchronous!

  if (!product) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center container mx-auto px-6 lg:px-12 my-24">
        <h1 className="font-display font-extrabold text-5xl text-neutral-900 mb-4">
          Item Not Found
        </h1>
        <p className="text-brand-secondary mb-8">
          The menu item you're looking for doesn't exist.
        </p>
        <Link
          href="/"
          className="px-8 py-3.5 text-sm font-bold tracking-wide text-white bg-brand-primary rounded-full hover:bg-orange-700 transition-all shadow-md"
        >
          Back to Menu
        </Link>
      </main>
    );
  }

  const totalPrice = product.price * quantity;

  const handleAddToCart = () => {
    addItemToCart({
      productId: product.id,
      title: product.title,
      price: product.price,
      quantity,
      img: product.img, // Updated from image_url
    });
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      setQuantity(1);
    }, 1500);
  };

  const selectionNumber = String(product.id).padStart(2, "0");

  return (
    <main className="flex-1 flex flex-col container mx-auto px-6 lg:px-12 my-12">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-brand-secondary hover:text-brand-primary transition-colors mb-10 w-max"
      >
        <ArrowLeft className="w-4 h-4" /> Return to Menu
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
        {/* Left: Image */}
        <div className="relative w-full aspect-square rounded-[40px] overflow-hidden shadow-soft bg-neutral-900 border border-brand-primary/10">
          <img
            src={product.img} // Updated from image_url
            alt={product.title}
            className="absolute inset-0 w-full h-full object-cover origin-center"
          />
          {product.tagline && (
            <div className="absolute bottom-6 right-6 bg-[#B88029] text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full shadow-lg backdrop-blur-sm bg-opacity-90">
              {product.tagline}
            </div>
          )}
        </div>

        {/* Right: Details */}
        <div className="flex flex-col">
          <h4 className="text-xs font-bold tracking-widest text-brand-primary uppercase mb-3">
            Kitchen Selection No. {selectionNumber}
          </h4>
          <h1 className="font-display font-extrabold text-5xl md:text-6xl text-neutral-900 tracking-tight leading-none mb-4">
            {product.title.split(" ").slice(0, -1).join(" ")}
            <br />
            {product.title.split(" ").slice(-1)[0]}
          </h1>

          <div className="flex items-center justify-between border-b border-brand-primary/10 pb-6 mb-8 mt-2">
            <span className="font-sans font-bold text-3xl text-brand-primary">
              ₹{product.price}
            </span>
            {product.rating && (
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-brand-primary/5">
                <Star className="w-4 h-4 fill-brand-primary text-brand-primary" />
                <span className="font-bold text-sm text-neutral-900">
                  {product.rating}{" "}
                  <span className="text-neutral-500 font-medium">
                    ({product.reviews} Reviews)
                  </span>
                </span>
              </div>
            )}
          </div>

          <p className="text-brand-secondary leading-relaxed font-medium mb-10 text-lg">
            {product.desc} {/* Updated from description */}
          </p>

          {/* Macros */}
          {product.macros && ( // Updated to use the nested macros object
            <div className="grid grid-cols-3 gap-4 mb-12">
              <div className="bg-white border border-brand-primary/10 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
                <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider mb-1">
                  Calories
                </span>
                <span className="font-bold text-xl text-neutral-900">
                  {product.macros.calories}
                </span>
              </div>
              <div className="bg-white border border-brand-primary/10 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
                <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider mb-1">
                  Protein
                </span>
                <span className="font-bold text-xl text-neutral-900">
                  {product.macros.protein}
                </span>
              </div>
              <div className="bg-white border border-brand-primary/10 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
                <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider mb-1">
                  Carbs
                </span>
                <span className="font-bold text-xl text-neutral-900">
                  {product.macros.carbs}
                </span>
              </div>
            </div>
          )}

          {/* Add to Cart Actions */}
          <div className="flex items-center gap-4 mt-auto">
            <div className="flex items-center bg-white border border-brand-primary/10 rounded-full h-14 px-2 shadow-sm shrink-0">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center text-brand-secondary hover:text-brand-primary font-bold text-xl"
              >
                -
              </button>
              <span className="w-8 text-center font-bold text-neutral-900">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 flex items-center justify-center text-brand-secondary hover:text-brand-primary font-bold text-xl"
              >
                +
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={added}
              className={`flex-1 h-14 font-bold tracking-widest uppercase rounded-full shadow-md transition-all flex items-center justify-center gap-2 ${
                added
                  ? "bg-green-600 text-white"
                  : "bg-brand-primary text-white hover:bg-orange-700"
              }`}
            >
              {added ? (
                <>
                  <Check className="w-5 h-5" /> Added!
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" /> Add To Order • ₹
                  {totalPrice}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
