'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ClipboardList, UtensilsCrossed, BarChart3 } from 'lucide-react';
import { UserButton } from '@clerk/nextjs';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/orders', label: 'Orders', icon: ClipboardList },
  { href: '/admin/menu', label: 'Menu Items', icon: UtensilsCrossed },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-neutral-50">
      {/* Sidebar */}
      <aside className="w-64 bg-neutral-900 text-white flex flex-col border-r border-neutral-800 shrink-0">
        <div className="p-6 border-b border-neutral-800">
          <h1 className="font-display font-bold text-2xl">
            Admin<span className="text-brand-primary">Hub</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-2">Kitchen Display System</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link 
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive 
                    ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/20' 
                    : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-neutral-800 flex items-center gap-3">
          <UserButton />
          <span className="text-sm text-neutral-300">Account</span>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b border-neutral-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <h2 className="font-display font-bold text-2xl text-neutral-900">Kitchen Display System</h2>
          <Link href="/" className="text-xs font-bold uppercase tracking-widest text-brand-primary hover:text-orange-700 transition-colors">
            Back to Store
          </Link>
        </header>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
