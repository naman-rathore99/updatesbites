"use client";

import { SignInButton, UserButton } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@bites/store";

export default function Header() {
  const { userId } = useAuth();
  const cartItems = useCartStore((state) => state.getTotalItems());

  return (
    <header className="w-full pt-8 pb-4">
      <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between">
        <Link
          href="/"
          className="font-display font-bold text-3xl tracking-tight text-neutral-900 group"
        >
          Bites
          <span className="italic font-normal group-hover:text-brand-primary transition-colors">
            of
          </span>
          Bliss
        </Link>

        {/* Global Navigation matching screenshot */}
        <nav className="hidden md:flex gap-10 items-center font-display font-bold text-sm tracking-widest uppercase text-brand-secondary">
          <Link
            href="/"
            className="text-brand-primary border-b-2 border-brand-primary pb-1"
          >
            Menu
          </Link>
          <Link href="/" className="hover:text-brand-primary transition-colors">
            Kitchen
          </Link>
          <Link href="/" className="hover:text-brand-primary transition-colors">
            Our Story
          </Link>
        </nav>

        <div className="flex items-center gap-6">
          <Link href="/checkout" className="relative">
            <ShoppingCart
              className="w-5 h-5 text-brand-primary cursor-pointer hover:opacity-80 transition-opacity"
              strokeWidth={2.5}
            />
            {cartItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-brand-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartItems}
              </span>
            )}
          </Link>
          {!userId ? (
            <div className="text-xs font-bold uppercase tracking-wider text-brand-primary border border-brand-primary px-4 py-1.5 rounded-full hover:bg-brand-primary/5 transition-colors cursor-pointer">
              <SignInButton mode="modal" fallbackRedirectUrl="/dashboard" />
            </div>
          ) : (
            <UserButton />
          )}
        </div>
      </div>
    </header>
  );
}
