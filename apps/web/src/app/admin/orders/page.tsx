'use client';

import { useState } from 'react';
import { Clock, MapPin, Package, Search, Filter, ChevronDown, Eye, Truck } from 'lucide-react';

interface Order {
  id: string;
  customer: string;
  email: string;
  phone: string;
  items: { name: string; qty: number; price: number }[];
  subtotal: number;
  delivery: number;
  gst: number;
  total: number;
  address: string;
  note: string;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  time: string;
  date: string;
  paymentMethod: string;
}

const MOCK_ORDERS: Order[] = [
  {
    id: '#ORD-1024', customer: 'Sarah Mitchell', email: 'sarah@example.com', phone: '+91 98765 43210',
    items: [{ name: 'Wild Tuna Bowl', qty: 2, price: 599 }, { name: 'Berry Cloud', qty: 1, price: 379 }],
    subtotal: 1577, delivery: 40, gst: 79, total: 1696,
    address: '3524 Heritage Lane, Apt 4B, New Delhi', note: 'Ring bell twice',
    status: 'preparing', time: '11:24 AM', date: 'Today', paymentMethod: 'Card (Visa)',
  },
  {
    id: '#ORD-1023', customer: 'John Desmond', email: 'john.d@example.com', phone: '+91 91234 56789',
    items: [{ name: 'The Truffle Brie', qty: 1, price: 749 }],
    subtotal: 749, delivery: 40, gst: 37, total: 826,
    address: '5621 Oak Street, Mumbai', note: '',
    status: 'pending', time: '11:18 AM', date: 'Today', paymentMethod: 'UPI',
  },
  {
    id: '#ORD-1022', customer: 'Emma Laurent', email: 'emma.l@example.com', phone: '+91 87654 32109',
    items: [{ name: 'Zen Med Bowl', qty: 3, price: 549 }, { name: 'Smokestack', qty: 2, price: 599 }],
    subtotal: 2845, delivery: 40, gst: 142, total: 3027,
    address: '1847 Maple Ave, Bangalore', note: 'Leave at door',
    status: 'ready', time: '10:52 AM', date: 'Today', paymentMethod: 'Card (Mastercard)',
  },
  {
    id: '#ORD-1021', customer: 'Raj Patel', email: 'raj.p@example.com', phone: '+91 76543 21098',
    items: [{ name: 'Harvest Grain', qty: 1, price: 499 }, { name: 'Midnight Ganache', qty: 2, price: 449 }],
    subtotal: 1397, delivery: 40, gst: 70, total: 1507,
    address: '42 MG Road, Pune', note: '',
    status: 'delivered', time: '09:30 AM', date: 'Today', paymentMethod: 'UPI',
  },
  {
    id: '#ORD-1020', customer: 'Priya Sharma', email: 'priya.s@example.com', phone: '+91 65432 10987',
    items: [{ name: 'Wild Tuna Bowl', qty: 1, price: 599 }, { name: 'Zesty Gold Tart', qty: 1, price: 399 }],
    subtotal: 998, delivery: 40, gst: 50, total: 1088,
    address: '15 Brigade Road, Bangalore', note: 'Call on arrival',
    status: 'delivered', time: '08:15 AM', date: 'Today', paymentMethod: 'Card (Visa)',
  },
  {
    id: '#ORD-1019', customer: 'Ankit Kumar', email: 'ankit.k@example.com', phone: '+91 54321 09876',
    items: [{ name: 'The Truffle Brie', qty: 2, price: 749 }],
    subtotal: 1498, delivery: 40, gst: 75, total: 1613,
    address: '78 Connaught Place, Delhi', note: '',
    status: 'cancelled', time: '07:45 AM', date: 'Yesterday', paymentMethod: 'UPI',
  },
];

const STATUS_CONFIG = {
  pending: { label: 'Pending', bg: 'bg-yellow-100', text: 'text-yellow-800', dot: 'bg-yellow-500' },
  preparing: { label: 'Preparing', bg: 'bg-orange-100', text: 'text-orange-800', dot: 'bg-orange-500' },
  ready: { label: 'Ready', bg: 'bg-blue-100', text: 'text-blue-800', dot: 'bg-blue-500' },
  delivered: { label: 'Delivered', bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
  cancelled: { label: 'Cancelled', bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500' },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const filteredOrders = orders
    .filter(o => filterStatus === 'all' || o.status === filterStatus)
    .filter(o =>
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase())
    );

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const statusCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    ready: orders.filter(o => o.status === 'ready').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-4xl text-neutral-900 mb-2">Orders</h1>
          <p className="text-sm text-neutral-500">{orders.length} total orders · {statusCounts.pending + statusCounts.preparing} active</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {(['pending', 'preparing', 'ready', 'delivered', 'cancelled'] as const).map(status => {
          const config = STATUS_CONFIG[status];
          const revenue = orders.filter(o => o.status === status).reduce((sum, o) => sum + o.total, 0);
          return (
            <div key={status} className={`${config.bg} rounded-2xl p-5 cursor-pointer transition-all hover:scale-[1.02] ${filterStatus === status ? 'ring-2 ring-offset-2 ring-brand-primary' : ''}`} onClick={() => setFilterStatus(filterStatus === status ? 'all' : status)}>
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2 h-2 rounded-full ${config.dot}`} />
                <span className={`text-xs font-bold uppercase tracking-wider ${config.text}`}>{config.label}</span>
              </div>
              <div className="font-display font-bold text-3xl text-neutral-900">{statusCounts[status]}</div>
              <div className="text-xs text-neutral-500 mt-1">₹{revenue.toLocaleString()}</div>
            </div>
          );
        })}
      </div>

      {/* Search */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search orders by ID or customer name..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-neutral-200 rounded-xl text-sm font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all"
          />
        </div>
        {filterStatus !== 'all' && (
          <button onClick={() => setFilterStatus('all')} className="text-xs font-bold text-brand-primary hover:underline whitespace-nowrap">
            Clear Filter
          </button>
        )}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const config = STATUS_CONFIG[order.status];
          const isExpanded = expandedOrder === order.id;
          return (
            <div key={order.id} className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden transition-all">
              {/* Order Row */}
              <div
                className="flex items-center gap-6 p-5 cursor-pointer hover:bg-neutral-50 transition-colors"
                onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-bold text-neutral-900">{order.id}</span>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${config.bg} ${config.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                      {config.label}
                    </span>
                  </div>
                  <div className="text-sm text-neutral-600">{order.customer}</div>
                </div>
                <div className="hidden md:block text-sm text-neutral-500 w-40">
                  {order.items.length} item{order.items.length > 1 ? 's' : ''}
                </div>
                <div className="text-right">
                  <div className="font-bold text-neutral-900">₹{order.total.toLocaleString()}</div>
                  <div className="text-xs text-neutral-400">{order.time} · {order.date}</div>
                </div>
                <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="border-t border-neutral-100 p-5 bg-neutral-50/50">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Items */}
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-3">Order Items</h4>
                      <div className="space-y-2">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span className="text-neutral-700">{item.qty}x {item.name}</span>
                            <span className="font-bold text-neutral-900">₹{(item.price * item.qty).toLocaleString()}</span>
                          </div>
                        ))}
                        <div className="border-t border-neutral-200 pt-2 mt-2 space-y-1">
                          <div className="flex justify-between text-xs text-neutral-500">
                            <span>Subtotal</span><span>₹{order.subtotal}</span>
                          </div>
                          <div className="flex justify-between text-xs text-neutral-500">
                            <span>Delivery</span><span>₹{order.delivery}</span>
                          </div>
                          <div className="flex justify-between text-xs text-neutral-500">
                            <span>GST (5%)</span><span>₹{order.gst}</span>
                          </div>
                          <div className="flex justify-between text-sm font-bold text-neutral-900 pt-1">
                            <span>Total</span><span>₹{order.total}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-3">Customer</h4>
                      <div className="space-y-2 text-sm">
                        <div className="text-neutral-900 font-medium">{order.customer}</div>
                        <div className="text-neutral-500">{order.email}</div>
                        <div className="text-neutral-500">{order.phone}</div>
                        <div className="flex items-start gap-2 mt-3">
                          <MapPin className="w-3.5 h-3.5 text-neutral-400 mt-0.5 shrink-0" />
                          <span className="text-neutral-600">{order.address}</span>
                        </div>
                        {order.note && (
                          <div className="text-xs text-brand-primary bg-orange-50 px-3 py-2 rounded-lg mt-2">
                            📝 {order.note}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-3">Actions</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs text-neutral-500 mb-3">
                          <Package className="w-3.5 h-3.5" /> {order.paymentMethod}
                        </div>
                        {order.status === 'pending' && (
                          <>
                            <button onClick={() => handleStatusChange(order.id, 'preparing')} className="w-full py-2.5 bg-brand-primary text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-orange-700 transition-colors">
                              Accept & Start Preparing
                            </button>
                            <button onClick={() => handleStatusChange(order.id, 'cancelled')} className="w-full py-2.5 border border-red-200 text-red-600 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-red-50 transition-colors">
                              Cancel Order
                            </button>
                          </>
                        )}
                        {order.status === 'preparing' && (
                          <button onClick={() => handleStatusChange(order.id, 'ready')} className="w-full py-2.5 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                            <Package className="w-3.5 h-3.5" /> Mark as Ready
                          </button>
                        )}
                        {order.status === 'ready' && (
                          <button onClick={() => handleStatusChange(order.id, 'delivered')} className="w-full py-2.5 bg-green-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                            <Truck className="w-3.5 h-3.5" /> Mark as Delivered
                          </button>
                        )}
                        {(order.status === 'delivered' || order.status === 'cancelled') && (
                          <div className="text-xs text-neutral-400 text-center py-3 bg-neutral-100 rounded-xl">
                            Order {order.status === 'delivered' ? 'completed' : 'cancelled'} — no actions available
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-neutral-200">
          <p className="text-neutral-500 font-medium">No orders found</p>
          {search && <p className="text-sm text-neutral-400 mt-1">Try a different search term</p>}
        </div>
      )}
    </div>
  );
}
