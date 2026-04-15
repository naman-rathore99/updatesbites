'use client';

import { useState } from 'react';
import { TrendingUp, TrendingDown, Users, ShoppingBag, DollarSign, Clock, Utensils, Star, ArrowUpRight, ArrowDownRight } from 'lucide-react';

// Mock analytics data
const dailyRevenue = [
  { day: 'Mon', revenue: 4820, orders: 12 },
  { day: 'Tue', revenue: 6340, orders: 18 },
  { day: 'Wed', revenue: 5100, orders: 14 },
  { day: 'Thu', revenue: 7200, orders: 22 },
  { day: 'Fri', revenue: 8900, orders: 28 },
  { day: 'Sat', revenue: 11200, orders: 35 },
  { day: 'Sun', revenue: 9400, orders: 30 },
];

const topItems = [
  { name: 'Wild Tuna Bowl', sold: 145, revenue: 86855, trend: 12 },
  { name: 'The Truffle Brie', sold: 112, revenue: 83888, trend: 8 },
  { name: 'Harvest Grain', sold: 98, revenue: 48902, trend: -3 },
  { name: 'Berry Cloud', sold: 87, revenue: 32973, trend: 15 },
  { name: 'Smokestack', sold: 76, revenue: 45524, trend: 5 },
  { name: 'Zen Med Bowl', sold: 65, revenue: 35685, trend: -1 },
];

const hourlyOrders = [
  { hour: '9AM', count: 3 }, { hour: '10AM', count: 7 }, { hour: '11AM', count: 12 },
  { hour: '12PM', count: 18 }, { hour: '1PM', count: 22 }, { hour: '2PM', count: 15 },
  { hour: '3PM', count: 8 }, { hour: '4PM', count: 5 }, { hour: '5PM', count: 4 },
  { hour: '6PM', count: 9 }, { hour: '7PM', count: 16 }, { hour: '8PM', count: 20 },
  { hour: '9PM', count: 14 }, { hour: '10PM', count: 6 },
];

const maxHourlyCount = Math.max(...hourlyOrders.map(h => h.count));
const maxDailyRevenue = Math.max(...dailyRevenue.map(d => d.revenue));

const customerInsights = [
  { label: 'New Customers', value: 48, change: 12, icon: Users },
  { label: 'Repeat Customers', value: 156, change: 8, icon: Star },
  { label: 'Avg. Basket Size', value: '₹847', change: 5, icon: ShoppingBag },
  { label: 'Avg. Delivery Time', value: '28 min', change: -4, icon: Clock },
];

const categoryBreakdown = [
  { name: 'Signature Bowls', percentage: 42, revenue: 178420, color: 'bg-brand-primary' },
  { name: 'Artisan Burgers', percentage: 33, revenue: 141200, color: 'bg-amber-500' },
  { name: 'Decadent Desserts', percentage: 25, revenue: 105380, color: 'bg-rose-500' },
];

const satisfactionData = {
  overall: 4.7,
  food: 4.8,
  delivery: 4.5,
  packaging: 4.6,
  value: 4.4,
};

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('week');
  const totalWeekRevenue = dailyRevenue.reduce((sum, d) => sum + d.revenue, 0);
  const totalWeekOrders = dailyRevenue.reduce((sum, d) => sum + d.orders, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-4xl text-neutral-900 mb-2">Analytics</h1>
          <p className="text-sm text-neutral-500">Performance insights and trends</p>
        </div>
        <div className="flex bg-white rounded-xl border border-neutral-200 overflow-hidden">
          {(['today', 'week', 'month'] as const).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                timeRange === range ? 'bg-brand-primary text-white' : 'text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-gradient-to-br from-brand-primary to-orange-700 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Revenue</span>
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-bold text-3xl">₹{totalWeekRevenue.toLocaleString()}</div>
          <div className="flex items-center gap-1 mt-2 text-xs opacity-90">
            <ArrowUpRight className="w-3 h-3" />
            <span>+14.2% vs last week</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Orders</span>
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <div className="font-display font-bold text-3xl text-neutral-900">{totalWeekOrders}</div>
          <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
            <ArrowUpRight className="w-3 h-3" />
            <span>+8.3% vs last week</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Avg. Order Value</span>
            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <div className="font-display font-bold text-3xl text-neutral-900">₹{Math.round(totalWeekRevenue / totalWeekOrders)}</div>
          <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
            <ArrowUpRight className="w-3 h-3" />
            <span>+5.1% vs last week</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Fulfillment Rate</span>
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <Utensils className="w-4 h-4 text-purple-600" />
            </div>
          </div>
          <div className="font-display font-bold text-3xl text-neutral-900">96.4%</div>
          <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
            <ArrowUpRight className="w-3 h-3" />
            <span>+1.2% vs last week</span>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-200 p-6">
          <h3 className="font-display font-bold text-xl text-neutral-900 mb-6">Revenue Trends</h3>
          <div className="flex items-end gap-3 h-48">
            {dailyRevenue.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-[10px] font-bold text-neutral-500">₹{(d.revenue / 1000).toFixed(1)}k</span>
                <div className="w-full relative">
                  <div
                    className="w-full bg-gradient-to-t from-brand-primary to-orange-400 rounded-t-lg transition-all duration-500 hover:opacity-80"
                    style={{ height: `${(d.revenue / maxDailyRevenue) * 140}px` }}
                  />
                </div>
                <span className="text-[10px] font-bold text-neutral-400">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6">
          <h3 className="font-display font-bold text-xl text-neutral-900 mb-6">Category Split</h3>
          {/* Donut Visual */}
          <div className="flex justify-center mb-6">
            <div className="relative w-36 h-36">
              <svg className="w-36 h-36 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="14" fill="none" stroke="#F3F4F6" strokeWidth="4" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#E65100" strokeWidth="4"
                  strokeDasharray={`${42} ${100 - 42}`} strokeDashoffset="0" className="transition-all duration-500" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#F59E0B" strokeWidth="4"
                  strokeDasharray={`${33} ${100 - 33}`} strokeDashoffset={`${-42}`} className="transition-all duration-500" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#F43F5E" strokeWidth="4"
                  strokeDasharray={`${25} ${100 - 25}`} strokeDashoffset={`${-(42 + 33)}`} className="transition-all duration-500" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display font-bold text-lg text-neutral-900">₹4.25L</span>
                <span className="text-[9px] text-neutral-500">total</span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {categoryBreakdown.map(cat => (
              <div key={cat.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${cat.color}`} />
                  <span className="text-sm text-neutral-700">{cat.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-neutral-900">{cat.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Customer Insights */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {customerInsights.map(insight => {
          const Icon = insight.icon;
          const isPositive = insight.change > 0;
          return (
            <div key={insight.label} className="bg-white rounded-2xl border border-neutral-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Icon className="w-4 h-4 text-neutral-400" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">{insight.label}</span>
              </div>
              <div className="font-display font-bold text-2xl text-neutral-900">{insight.value}</div>
              <div className={`flex items-center gap-1 mt-1 text-xs ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
                {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                <span>{isPositive ? '+' : ''}{insight.change}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Peak Hours */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6">
          <h3 className="font-display font-bold text-xl text-neutral-900 mb-2">Peak Hours</h3>
          <p className="text-xs text-neutral-500 mb-6">Order distribution throughout the day</p>
          <div className="flex items-end gap-1.5 h-32">
            {hourlyOrders.map((h) => (
              <div key={h.hour} className="flex-1 flex flex-col items-center gap-1 group">
                <span className="text-[8px] font-bold text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity">{h.count}</span>
                <div
                  className={`w-full rounded-t transition-all duration-300 ${h.count >= 15 ? 'bg-brand-primary' : h.count >= 10 ? 'bg-orange-300' : 'bg-orange-100'}`}
                  style={{ height: `${(h.count / maxHourlyCount) * 100}px` }}
                />
                <span className="text-[8px] font-bold text-neutral-400">{h.hour.replace('AM','').replace('PM','')}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-4 text-xs text-neutral-400">
            <span>Morning</span>
            <span>Lunch Rush ☀️</span>
            <span>Dinner Rush 🌙</span>
          </div>
        </div>

        {/* Top Menu Items */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6">
          <h3 className="font-display font-bold text-xl text-neutral-900 mb-2">Best Sellers</h3>
          <p className="text-xs text-neutral-500 mb-6">Top performing items this week</p>
          <div className="space-y-4">
            {topItems.map((item, i) => (
              <div key={item.name} className="flex items-center gap-4">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${i < 3 ? 'bg-brand-primary text-white' : 'bg-neutral-100 text-neutral-500'}`}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-neutral-900 truncate">{item.name}</div>
                  <div className="text-[10px] text-neutral-400">{item.sold} sold</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-neutral-900">₹{(item.revenue / 1000).toFixed(1)}k</div>
                  <div className={`text-[10px] flex items-center gap-0.5 justify-end ${item.trend > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {item.trend > 0 ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
                    {item.trend > 0 ? '+' : ''}{item.trend}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Customer Satisfaction */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6">
        <h3 className="font-display font-bold text-xl text-neutral-900 mb-2">Customer Satisfaction</h3>
        <p className="text-xs text-neutral-500 mb-6">Average ratings across categories</p>
        <div className="grid grid-cols-5 gap-4">
          {Object.entries(satisfactionData).map(([key, rating]) => (
            <div key={key} className="text-center">
              <div className="relative mx-auto w-20 h-20 mb-3">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.5" fill="none" stroke="#F3F4F6" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15.5" fill="none" stroke={rating >= 4.5 ? '#16A34A' : rating >= 4.0 ? '#F59E0B' : '#EF4444'} strokeWidth="3"
                    strokeDasharray={`${(rating / 5) * 97.5} ${97.5 - (rating / 5) * 97.5}`}
                    strokeLinecap="round" className="transition-all duration-700" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-bold text-lg text-neutral-900">{rating}</span>
                </div>
              </div>
              <span className="text-xs font-medium text-neutral-600 capitalize">{key}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
