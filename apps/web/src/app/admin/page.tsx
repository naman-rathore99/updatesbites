"use client";

import { supabaseClient } from "@bites/db";
import { useEffect, useState } from "react";
import type { OrderResponse } from "@bites/validators";
import { Star, TrendingUp, Users } from "lucide-react";

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
            setOrders((prev) => [mapOrderToUI(newRecord), ...prev]);
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

  const topPatrons: TopPatron[] = [
    {
      id: "1",
      name: "Elena Vasquez",
      orders: 23,
      revenue: "₹28,420",
      avatar: "👩",
    },
    {
      id: "2",
      name: "Julian Thorne",
      orders: 18,
      revenue: "₹17,090",
      avatar: "👨",
    },
    {
      id: "3",
      name: "Sophia Gray",
      orders: 15,
      revenue: "₹14,150",
      avatar: "👱‍♀️",
    },
  ];

  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const preparingCount = orders.filter((o) => o.status === "preparing").length;
  const readyCount = orders.filter((o) => o.status === "ready").length;

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
      {/* Daily Overview Header */}
      <div className="mb-12">
        <h1 className="font-display font-bold text-4xl text-neutral-900 mb-2">
          Daily Overview
        </h1>
        <p className="text-sm text-neutral-500">
          Today's current metrics and performance
        </p>
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

      {/* Bottom Row - Financial & Customer Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
          <h3 className="font-bold text-lg text-neutral-900 mb-6">
            Payment History
          </h3>
          <div className="space-y-3">
            {[
              {
                id: "#ORD-00041",
                date: "Oct 28, 2025",
                method: "Card (Visa)",
                amount: "₹824,400.00",
                status: "COMPLETED",
              },
              {
                id: "#ORD-00029",
                date: "Oct 27, 2025",
                method: "UPI Payment",
                amount: "₹68,890.00",
                status: "COMPLETED",
              },
              {
                id: "#ORD-00025",
                date: "Oct 28, 2025",
                method: "PayPal/Razorpay",
                amount: "₹324,200.00",
                status: "PENDING",
              },
            ].map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-0"
              >
                <div className="flex-1">
                  <div className="font-bold text-sm text-neutral-900">
                    {tx.id}
                  </div>
                  <div className="text-xs text-neutral-500">
                    {tx.date} • {tx.method}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-sm text-neutral-900">
                    {tx.amount}
                  </div>
                  <span
                    className={`text-xs font-bold ${tx.status === "COMPLETED" ? "text-green-600" : "text-yellow-600"}`}
                  >
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Patrons & Loyalty */}
        <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
          <h3 className="font-bold text-lg text-neutral-900 mb-6">
            Top Patrons
          </h3>
          <div className="space-y-4">
            {topPatrons.map((patron) => (
              <div
                key={patron.id}
                className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{patron.avatar}</div>
                  <div>
                    <div className="font-bold text-sm text-neutral-900">
                      {patron.name}
                    </div>
                    <div className="text-xs text-neutral-500">
                      {patron.orders} orders
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-brand-primary">
                    {patron.revenue}
                  </div>
                  <div className="flex gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-3 h-3 fill-brand-primary text-brand-primary"
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Special Discounts */}
      <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
        <h3 className="font-bold text-lg text-neutral-900 mb-6">
          Active Discounts & Promotions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              code: "AUTUMN20",
              desc: "Autumn Special - 20% off",
              status: "ACTIVE",
            },
            {
              code: "WELCOME50",
              desc: "Welcome New Users - ₹50 off",
              status: "ACTIVE",
            },
            {
              code: "LOYALTY30",
              desc: "Loyalty Members - ₹30 off",
              status: "ENDING",
            },
          ].map((promo) => (
            <div
              key={promo.code}
              className="p-4 bg-gradient-to-r from-brand-primary/10 to-orange-100 border border-brand-primary/20 rounded-xl"
            >
              <div className="font-bold text-neutral-900">{promo.code}</div>
              <div className="text-sm text-neutral-600 mt-1">{promo.desc}</div>
              <span
                className={`inline-block mt-3 text-xs font-bold px-2 py-1 rounded ${
                  promo.status === "ACTIVE"
                    ? "bg-green-200 text-green-900"
                    : "bg-yellow-200 text-yellow-900"
                }`}
              >
                {promo.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
