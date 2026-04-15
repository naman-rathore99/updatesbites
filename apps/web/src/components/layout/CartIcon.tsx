"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@bites/store";
import { useEffect, useState } from "react";

export default function CartIcon() {
  const [mounted, setMounted] = useState(false);
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Link href="/checkout" className="relative">
      <ShoppingCart className="w-5 h-5 text-brand-primary cursor-pointer hover:opacity-80 transition-opacity" strokeWidth={2.5} />
      {mounted && getTotalItems() > 0 && (
        <span className="absolute -top-2 -right-2 bg-[#E65100] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
          {getTotalItems()}
        </span>
      )}
    </Link>
  );
}
