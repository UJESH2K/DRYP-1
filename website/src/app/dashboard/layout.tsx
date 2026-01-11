'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/dashboard/products', label: 'Products' },
  { href: '/dashboard/analytics', label: 'Analytics' },
  { href: '/dashboard/store', label: 'Store Profile' },
];

const NavLink = ({ href, label, isActive }: { href: string; label: string; isActive: boolean }) => (
  <Link
    href={href}
    className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition ${
      isActive
        ? 'bg-white text-ink shadow-soft'
        : 'text-ink/70 hover:bg-white/60 hover:text-ink'
    }`}
  >
    <span>{label}</span>
    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: isActive ? '#007aff' : 'transparent' }} />
  </Link>
);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 flex-col gap-6 border-r border-border/80 bg-white/80 px-5 py-6 lg:flex">
          <div className="flex items-center gap-3 px-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ink text-white font-semibold shadow-soft">DR</div>
            <div className="leading-tight">
              <p className="font-zaloga text-xl">DR-YP</p>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Vendor</p>
            </div>
          </div>

          <nav className="flex flex-1 flex-col gap-2">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.href} href={item.href} label={item.label} isActive={pathname === item.href} />
            ))}
          </nav>

          <button
            onClick={logout}
            className="rounded-xl border border-border px-4 py-3 text-sm font-semibold text-ink transition hover:bg-white"
          >
            Logout
          </button>
        </aside>

        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border/80 bg-white/80 px-5 py-4 backdrop-blur">
            <div className="flex flex-col gap-1">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Vendor Hub</p>
              <h1 className="font-zaloga text-2xl text-ink">{NAV_ITEMS.find((item) => item.href === pathname)?.label || 'Dashboard'}</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-full border border-border bg-white px-3 py-2 text-sm font-semibold text-ink/80">
                {user?.name || 'Vendor'}
              </div>
              <Link
                href="/dashboard/products"
                className="hidden items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-brand/90 md:flex"
              >
                Add product
              </Link>
            </div>
          </header>

          <main className="flex-1 px-4 py-8 sm:px-6 lg:px-10">{children}</main>
        </div>
      </div>
    </div>
  );
}
