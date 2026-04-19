"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Package, ChevronRight, Clock, MapPin, Loader2 } from "lucide-react";
import Link from "next/link";
import type { OrderResponse } from "@bites/validators";

export default function MyOrdersPage() {
  const { user, isLoaded } = useUser();
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded || !user) return;

    async function fetchMyOrders() {
      if (!user) return;
      try {
        const res = await fetch(`http://localhost:8080/api/orders/user/${user.id}`);
        const json = await res.json();
        if (json.success) {
          setOrders(json.data);
        }
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchMyOrders();
  }, [user, isLoaded]);

  if (!isLoaded || loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-24 gap-6">
        <h1 className="text-3xl font-display font-bold text-neutral-900">Please Sign In</h1>
        <p className="text-neutral-500">You need to be logged in to view your orders.</p>
        <Link href="/" className="px-8 py-3 bg-brand-primary text-white font-bold rounded-full uppercase tracking-widest text-xs">
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <main className="flex-1 container mx-auto px-6 py-12 max-w-4xl">
      <div className="mb-12">
        <h1 className="font-display font-extrabold text-5xl text-neutral-900 tracking-tight mb-4">
          My Orders
        </h1>
        <p className="text-neutral-500 font-medium">
          Tracking and history for your blissful bites.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-neutral-50 rounded-[32px] p-12 text-center border-2 border-dashed border-neutral-200">
          <Package className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-neutral-900 mb-2">No orders yet</h3>
          <p className="text-neutral-500 mb-8">Ready to start your first flavor journey?</p>
          <Link href="/" className="px-8 py-4 bg-brand-primary text-white font-bold rounded-full uppercase tracking-widest text-xs shadow-lg shadow-brand-primary/20">
            Order Now
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/order/${order.id}`}
              className="block bg-white rounded-[32px] p-6 border border-neutral-100 shadow-sm hover:shadow-md hover:border-brand-primary/20 transition-all group"
            >
              <div className="flex items-center justify-between gap-6">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-bold text-neutral-900 text-lg">#{order.id}</span>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      order.status === 'preparing' ? 'bg-orange-100 text-orange-700' :
                      order.status === 'ready' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      'bg-neutral-100 text-neutral-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-y-2 gap-x-6">
                    <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-neutral-500 truncate max-w-[300px]">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{order.delivery_address}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-2xl font-display font-bold text-brand-secondary">
                    ₹{order.total}
                  </div>
                  <div className="text-[10px] font-bold text-brand-primary uppercase tracking-widest mt-1 flex items-center justify-end gap-1 group-hover:gap-2 transition-all">
                    Track Order <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-neutral-50 flex gap-2 overflow-x-auto no-scrollbar">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 bg-neutral-50 px-3 py-1.5 rounded-full shrink-0">
                    <span className="text-[10px] font-bold text-neutral-900">{item.quantity}x</span>
                    <span className="text-[10px] text-neutral-600 font-medium">{item.title}</span>
                  </div>
                ))}
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
