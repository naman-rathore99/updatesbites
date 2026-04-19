"use client";

import { useParams } from "next/navigation";
import { useCatalogStore, useCartStore } from "@bites/store";
import { useState } from "react"; // Add this
import { Check, ShoppingBasket } from "lucide-react"; // Add icons

export default function ItemDetail() {
  const { id } = useParams();
  const [isAdding, setIsAdding] = useState(false); // Feedback state

  const getProductById = useCatalogStore((state) => state.getProductById);
  const addItem = useCartStore((state) => state.addItem);

  const product = getProductById(id as string);

  if (!product)
    return (
      <div className="p-24 text-center font-display text-2xl animate-pulse">
        Finding your flavor...
      </div>
    );
  const handleAddToCart = () => {
    if (!product) return;

    setIsAdding(true);

    addItem({
      productId: product.id,
      title: product.title,
      price: product.price,
      img: product.img,
      quantity: 1, // Default quantity when adding from this page
      // base: "regular", // You can add state later to handle bases/enhancements
      // enhancements: []
    });

    setTimeout(() => setIsAdding(false), 1500);
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row gap-12 lg:gap-24 items-center">
        {/* Product Image */}
        <div className="flex-1 w-full">
          <div className="relative group">
            <img
              src={product.img}
              alt={product.title}
              className="w-full aspect-square object-cover rounded-[40px] shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]"
            />
            {product.badge && (
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg">
                <span className="text-brand-primary font-bold text-xs uppercase tracking-tighter">
                  {product.badge}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1 flex flex-col gap-6">
          <div>
            <span className="text-brand-primary font-bold uppercase tracking-[0.2em] text-xs">
              {product.category.replace(/-/g, " ")}
            </span>
            <h1 className="text-5xl lg:text-6xl font-display font-extrabold text-neutral-900 mt-2">
              {product.title}
            </h1>
            {product.tagline && (
              <p className="text-brand-secondary/60 font-medium italic mt-1">
                {product.tagline}
              </p>
            )}
          </div>

          <p className="text-xl text-neutral-500 leading-relaxed max-w-xl">
            {product.desc}
          </p>

          <div className="flex items-center gap-4">
            <div className="text-4xl font-sans font-black text-neutral-900">
              ₹{product.price}
            </div>
            {product.rating && (
              <div className="bg-neutral-100 px-3 py-1 rounded-full text-xs font-bold text-neutral-600">
                ★ {product.rating}
              </div>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`
              flex items-center justify-center gap-3 py-5 rounded-full font-bold uppercase tracking-widest transition-all shadow-xl active:scale-95
              ${
                isAdding
                  ? "bg-green-500 text-white"
                  : "bg-brand-primary text-white hover:bg-orange-600 hover:shadow-orange-200"
              }
            `}
          >
            {isAdding ? (
              <>
                <Check className="w-5 h-5" />
                In the Basket
              </>
            ) : (
              <>
                <ShoppingBasket className="w-5 h-5" />
                Add to Basket
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
