"use client";

import { supabaseClient } from "@bites/db";
import { useEffect, useState, useRef } from "react";
import type { OrderResponse } from "@bites/validators";
import { TrendingUp, Users, Bell, BellOff, X } from "lucide-react";

interface OrderUI {
  id: string;
  originalId: number;
  customer: string;
  items: string;
  time: string;
  status: "pending" | "preparing" | "ready" | "delivered" | "cancelled";
  address: string;
}

interface TopPatron {
  id: string;
  name: string;
  orders: number;
  revenue: string;
  avatar: string;
}

// Defined outside component so it's a stable module-level reference,
// preventing react-hooks/exhaustive-deps TypeScript errors.
const mapOrderToUI = (dbOrder: OrderResponse): OrderUI => {
  const itemsStr = dbOrder.items
    .map((i) => `${i.quantity}x ${i.title}`)
    .join(", ");

  const created = new Date(dbOrder.created_at);
  const now = new Date();
  const diffMins = Math.floor((now.getTime() - created.getTime()) / 60000);
  const timeStr = diffMins < 1 ? "Just now" : `${diffMins} min ago`;

  return {
    id: `#${dbOrder.id}`,
    originalId: dbOrder.id,
    customer: dbOrder.customer_name,
    items: itemsStr,
    time: timeStr,
    status: dbOrder.status,
    address: dbOrder.delivery_address,
  };
};

export default function AdminDashboard() {
  const [orders, setOrders] = useState<OrderUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [toast, setToast] = useState<{ id: number; orderId: number; message: string } | null>(null);

  useEffect(() => {
    // 1. Fetch initial orders
    async function fetchOrders() {
      try {
        const res = await fetch("http://localhost:8080/api/orders");
        const json = await res.json();
        if (json.success) {
          setOrders(json.data.map((o: OrderResponse) => mapOrderToUI(o)));
        }
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();

    // 2. Subscribe to realtime updates
    const channel = supabaseClient
      .channel("orders-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        (payload: {
          eventType: string;
          new: Record<string, unknown>;
          old: Record<string, unknown>;
        }) => {
          const newRecord = payload.new as OrderResponse;

          if (payload.eventType === "INSERT") {
            setOrders((prev) => {
              const updated = [mapOrderToUI(newRecord), ...prev];
              // Play sound if new order is pending
              if (newRecord.status === "pending" && audioEnabled && audioRef.current) {
                audioRef.current.play().catch(e => console.error("Audio play failed:", e));
              }
              return updated;
            });
            // Show toast
            if (newRecord.status === "pending") {
              setToast({ id: Date.now(), orderId: newRecord.id, message: `New order from ${newRecord.customer_name}!` });
              setTimeout(() => setToast(null), 15000);
            }
          } else if (payload.eventType === "UPDATE") {
            setOrders((prev) =>
              prev.map((o) =>
                o.originalId === newRecord.id ? mapOrderToUI(newRecord) : o,
              ),
            );
          }
        },
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, []);



  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const preparingCount = orders.filter((o) => o.status === "preparing").length;
  const readyCount = orders.filter((o) => o.status === "ready").length;

  useEffect(() => {
    // If pending orders go down to 0, stop the ringing
    if (pendingCount === 0 && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [pendingCount]);

  const handleStatusChange = async (
    orderId: number,
    newStatus: "pending" | "preparing" | "ready" | "delivered" | "cancelled",
  ) => {
    // Optimistic UI update
    setOrders(
      orders.map((order) =>
        order.originalId === orderId ? { ...order, status: newStatus } : order,
      ),
    );

    // Call API
    try {
      await fetch(`http://localhost:8080/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  return (
    <div className="space-y-8">
      <audio ref={audioRef} src="/notification.mp3" loop preload="auto" />
      
      {/* Daily Overview Header */}
      <div className="mb-12 flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-4xl text-neutral-900 mb-2">
            Daily Overview
          </h1>
          <p className="text-sm text-neutral-500">
            Today's current metrics and performance
          </p>
        </div>
        <button
          onClick={() => {
            setAudioEnabled(!audioEnabled);
            if (!audioEnabled && audioRef.current) {
               audioRef.current.play().then(() => {
                 if (pendingCount === 0) {
                   audioRef.current?.pause();
                   if (audioRef.current) audioRef.current.currentTime = 0;
                 }
               }).catch(e => console.error(e));
            } else if (audioEnabled && audioRef.current) {
               audioRef.current.pause();
               audioRef.current.currentTime = 0;
            }
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all shadow-sm ${
            audioEnabled 
              ? "bg-green-100 text-green-700 border border-green-200" 
              : "bg-white text-neutral-600 border border-neutral-200"
          }`}
        >
          {audioEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
          {audioEnabled ? "Sound On" : "Sound Off"}
        </button>
      </div>

      {/* KPI Cards - Top Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-brand-primary text-white rounded-2xl p-8 shadow-lg">
          <div className="text-xs font-bold uppercase tracking-widest text-white/80 mb-3">
            Total Revenue
          </div>
          <div className="font-display font-bold text-4xl mb-6">₹42,890.00</div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4" />
            <span className="font-medium">+12% from yesterday</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-neutral-200 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-3">
            Total Orders
          </div>
          <div className="font-display font-bold text-4xl text-neutral-900 mb-6">
            18
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-neutral-600">Pending: {pendingCount}</span>
              <span className="font-bold text-yellow-500">{pendingCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">
                Preparing: {preparingCount}
              </span>
              <span className="font-bold text-brand-primary">
                {preparingCount}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-neutral-200 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-3">
            Active Users
          </div>
          <div className="font-display font-bold text-4xl text-neutral-900 mb-6">
            1,240
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-brand-primary" />
            <span className="text-neutral-600">24 online now</span>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart Placeholder */}
        <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
          <h3 className="font-bold text-lg text-neutral-900 mb-6">
            Revenue Trends
          </h3>
          <div className="h-48 flex items-end justify-center gap-2">
            {[40, 65, 45, 80, 55, 90, 70].map((height, i) => (
              <div
                key={i}
                className="flex-1 bg-gradient-to-t from-brand-primary to-orange-500 rounded-t-lg opacity-80 hover:opacity-100 transition"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
          <div className="mt-4 grid grid-cols-7 gap-2 text-xs text-center text-neutral-500">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>
        </div>

        {/* Category Performance */}
        <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
          <h3 className="font-bold text-lg text-neutral-900 mb-6">
            Category Performance
          </h3>
          <div className="space-y-4">
            {[
              { name: "Signature Bowls", value: "₹14,102", percent: 32 },
              { name: "Artisan Burgers", value: "₹10,502", percent: 24 },
              { name: "Desserts", value: "₹8,220", percent: 19 },
              { name: "Beverages", value: "₹5,220", percent: 12 },
            ].map((cat) => (
              <div key={cat.name}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-neutral-900">
                    {cat.name}
                  </span>
                  <span className="text-sm font-bold text-brand-primary">
                    {cat.value}
                  </span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2">
                  <div
                    className="bg-brand-primary rounded-full h-2 transition-all"
                    style={{ width: `${cat.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Management Section */}
      <div className="space-y-6">
        <h2 className="font-display font-bold text-3xl text-neutral-900">
          Live Orders
        </h2>

        <div className="bg-white rounded-2xl overflow-hidden border border-neutral-200 shadow-sm">
          <div className="grid grid-cols-6 gap-4 p-6 bg-neutral-50 border-b border-neutral-200 text-xs font-bold uppercase tracking-widest text-neutral-600">
            <div>Order ID</div>
            <div>Customer</div>
            <div>Items</div>
            <div>Status</div>
            <div>Time</div>
            <div>Actions</div>
          </div>

          {orders
            .filter((o) => o.status !== "delivered" && o.status !== "cancelled")
            .map((order) => (
              <div
                key={order.id}
                className={`grid grid-cols-6 gap-4 p-6 border-b border-neutral-100 items-center ${
                  order.status === "pending"
                    ? "bg-yellow-50"
                    : order.status === "preparing"
                      ? "bg-orange-50"
                      : "bg-green-50"
                }`}
              >
                <div className="font-bold text-neutral-900">{order.id}</div>
                <div className="text-sm text-neutral-900 font-medium">
                  {order.customer}
                </div>
                <div className="text-xs text-neutral-600">{order.items}</div>
                <div>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                      order.status === "pending"
                        ? "bg-yellow-200 text-yellow-900"
                        : order.status === "preparing"
                          ? "bg-orange-200 text-orange-900"
                          : "bg-green-200 text-green-900"
                    }`}
                  >
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </span>
                </div>
                <div className="text-xs text-neutral-600">{order.time}</div>
                <div className="flex gap-2">
                  {order.status === "pending" && (
                    <button
                      onClick={() =>
                        handleStatusChange(order.originalId, "preparing")
                      }
                      className="px-3 py-1 bg-brand-primary text-white text-xs font-bold rounded-lg hover:bg-orange-700 transition"
                    >
                      Start
                    </button>
                  )}
                  {order.status === "preparing" && (
                    <button
                      onClick={() =>
                        handleStatusChange(order.originalId, "ready")
                      }
                      className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700 transition"
                    >
                      Done
                    </button>
                  )}
                  {order.status === "ready" && (
                    <button
                      onClick={() =>
                        handleStatusChange(order.originalId, "delivered")
                      }
                      className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition"
                    >
                      Deliver
                    </button>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-8 right-8 z-50 animate-in slide-in-from-top-4 fade-in duration-300">
          <div className="bg-neutral-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex flex-col gap-4 min-w-[320px]">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center animate-pulse shrink-0">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-bold">{toast.message}</p>
                <p className="text-xs text-neutral-400">Action required immediately</p>
              </div>
              <button 
                onClick={() => setToast(null)}
                className="p-2 hover:bg-neutral-800 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex gap-2 w-full">
              <button 
                onClick={() => setToast(null)}
                className="flex-1 px-3 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-xs font-bold transition-colors"
              >
                View
              </button>
              <button 
                onClick={() => {
                  handleStatusChange(toast.orderId, "cancelled");
                  setToast(null);
                }}
                className="flex-1 px-3 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-xl text-xs font-bold transition-colors"
              >
                Reject
              </button>
              <button 
                onClick={() => {
                  handleStatusChange(toast.orderId, "preparing");
                  setToast(null);
                }}
                className="flex-1 px-3 py-2 bg-brand-primary hover:bg-orange-600 rounded-xl text-xs font-bold transition-colors shadow-lg"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
