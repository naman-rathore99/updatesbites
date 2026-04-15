"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  MapPin,
  Package,
  CreditCard,
  ChevronRight,
  CheckCircle2,
  Clock,
  Loader2,
} from "lucide-react";
import Link from "next/link";

// 1. Define your Order Type based on what your backend will send
interface Order {
  id: string;
  status: "PENDING" | "PREPARING" | "READY" | "DELIVERED";
  total: number;
  items: string; // e.g., "Wild Tuna Bowl, Harvest Grain"
  createdAt: string;
  estimatedDelivery?: string;
}

export default function Dashboard() {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();

  // 2. Dynamic State for Live Tracking
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [pastOrders, setPastOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);

  // Protect route & handle redirect if not logged in
  useEffect(() => {
    if (isLoaded && !userId) {
      router.push("/");
    }
  }, [isLoaded, userId, router]);

  // 3. The "Live Tracker" Hook
  useEffect(() => {
    if (!userId) return;

    const fetchOrders = async () => {
      try {
        // TODO: Replace with your actual backend Supabase/API call
        // const res = await fetch('/api/orders');
        // const data = await res.json();

        // Simulating an empty database for now so the UI is clean
        setActiveOrders([]);
        setPastOrders([]);
      } catch (error) {
        console.error("Failed to fetch live orders:", error);
      } finally {
        setIsLoadingOrders(false);
      }
    };

    // Initial fetch
    fetchOrders();

    // Set up polling every 10 seconds to keep the dashboard "live"
    const intervalId = setInterval(fetchOrders, 10000);
    return () => clearInterval(intervalId);
  }, [userId]);

  // Show nothing while Clerk figures out who is logged in
  if (!isLoaded || !userId) return null;

  return (
    <main className="flex-1 flex flex-col container mx-auto px-6 lg:px-12 my-12">
      <div className="mb-12">
        <h4 className="text-[10px] font-bold tracking-widest text-brand-primary uppercase mb-2">
          Welcome Back
        </h4>
        <h1 className="font-display font-extrabold text-5xl md:text-6xl text-neutral-900 tracking-tight leading-none">
          Your Dashboard
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Navigation/Quick Links */}
        <div className="col-span-1 flex flex-col gap-4">
          <div className="bg-white rounded-[32px] p-6 shadow-soft border border-brand-primary/5 flex flex-col gap-2">
            <button className="flex items-center justify-between p-4 rounded-2xl bg-brand-primary/5 text-brand-primary font-bold text-sm transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5" /> Active Orders
              </div>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button className="flex items-center justify-between p-4 rounded-2xl hover:bg-neutral-50 text-brand-secondary font-bold text-sm transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5" /> Saved Addresses
              </div>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </button>
            <button className="flex items-center justify-between p-4 rounded-2xl hover:bg-neutral-50 text-brand-secondary font-bold text-sm transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5" /> Payment Methods
              </div>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </button>
          </div>
        </div>

        {/* Right Col: Live Order Tracking */}
        <div className="col-span-1 lg:col-span-2 flex flex-col gap-8">
          <div className="bg-white rounded-[32px] p-8 shadow-soft border border-brand-primary/5 min-h-[400px] flex flex-col">
            <div className="flex items-center justify-between mb-8 border-b border-neutral-100 pb-4">
              <h3 className="font-display font-bold text-2xl text-neutral-900 flex items-center gap-3">
                Live Orders
                {activeOrders.length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                )}
              </h3>
              <span className="text-[10px] font-bold tracking-widest uppercase text-brand-primary cursor-pointer hover:underline">
                View History
              </span>
            </div>

            {/* Loading State */}
            {isLoadingOrders ? (
              <div className="flex-1 flex flex-col items-center justify-center text-neutral-400">
                <Loader2 className="w-8 h-8 animate-spin mb-4 text-brand-primary/50" />
                <p className="text-sm font-medium">Syncing with kitchen...</p>
              </div>
            ) : (
              <div className="flex flex-col gap-6 flex-1">
                {/* Active Orders List */}
                {activeOrders.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center py-12 px-4 rounded-3xl bg-neutral-50/50 border border-neutral-100 border-dashed">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                      <Clock className="w-6 h-6 text-neutral-300" />
                    </div>
                    <h4 className="font-bold text-neutral-900 mb-2">
                      No active orders right now
                    </h4>
                    <p className="text-sm text-neutral-500 max-w-xs mb-6">
                      Looks like you haven't placed an order recently. Ready to
                      satisfy those cravings?
                    </p>
                    <Link
                      href="/#menu"
                      className="px-6 py-3 text-xs font-bold tracking-widest text-white bg-brand-primary rounded-full hover:bg-orange-700 transition-all shadow-md uppercase"
                    >
                      Browse Menu
                    </Link>
                  </div>
                ) : (
                  activeOrders.map((order) => (
                    <Link
                      key={order.id}
                      href={`/order/${order.id}`}
                      className="flex flex-col sm:flex-row items-center border border-brand-primary/20 rounded-3xl p-6 gap-6 hover:bg-orange-50/50 transition-colors cursor-pointer relative overflow-hidden"
                    >
                      <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex flex-col items-center justify-center text-brand-primary shrink-0 relative overflow-hidden">
                        <div className="absolute inset-0 bg-brand-primary opacity-20 animate-pulse"></div>
                        <Package className="w-6 h-6 mb-1 z-10" />
                        <span className="text-[10px] font-bold uppercase tracking-widest z-10">
                          {order.status}
                        </span>
                      </div>
                      <div className="flex flex-col flex-1 text-center sm:text-left">
                        <span className="font-bold text-neutral-900 text-lg mb-1">
                          Order #{order.id}
                        </span>
                        <span className="text-xs font-medium text-neutral-500 mb-3">
                          {order.items} • ₹{order.total}
                        </span>
                        <span className="text-[10px] font-bold text-brand-primary tracking-widest uppercase flex items-center justify-center sm:justify-start gap-2">
                          <span className="w-2 h-2 rounded-full bg-brand-primary animate-ping"></span>
                          {order.estimatedDelivery
                            ? `Arriving at ${order.estimatedDelivery}`
                            : "Preparing your meal"}
                        </span>
                      </div>
                      <ChevronRight className="w-6 h-6 text-brand-secondary/50 hidden sm:block" />
                    </Link>
                  ))
                )}

                {/* Past Orders Section (Only shows if there are past orders) */}
                {pastOrders.length > 0 && (
                  <div className="mt-8 pt-8 border-t border-neutral-100">
                    <h4 className="text-xs font-bold tracking-widest text-neutral-400 uppercase mb-6">
                      Recent History
                    </h4>
                    {pastOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex flex-col sm:flex-row items-center gap-6 opacity-60 mb-4 last:mb-0"
                      >
                        <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-400 shrink-0">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div className="flex flex-col flex-1 text-center sm:text-left">
                          <span className="font-bold text-neutral-900 text-lg mb-1">
                            Order #{order.id}
                          </span>
                          <span className="text-xs font-medium text-neutral-500">
                            {order.items} • ₹{order.total}
                          </span>
                          <span className="text-[10px] font-bold text-neutral-400 tracking-widest uppercase mt-2">
                            {order.status} • {order.createdAt}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
