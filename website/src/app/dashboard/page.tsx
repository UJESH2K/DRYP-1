'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardPage() {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading || !isAuthenticated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-muted">Checking your session…</p>
      </div>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <section className="grid gap-6 rounded-2xl bg-white/80 p-6 shadow-soft border border-border/80 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            Vendor workspace
          </div>
          <h1 className="font-zaloga text-3xl text-ink">Welcome back, {user?.name || 'vendor'}.</h1>
          <p className="text-base text-muted">
            Publish new products, upload imagery, and keep your stock synced with the DR-YP shopper app. Everything you update here flows to the main experience immediately.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard/products"
              className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white shadow-soft hover:bg-brand/90"
            >
              Add a product
            </Link>
            <Link
              href="/dashboard/analytics"
              className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-ink hover:bg-white"
            >
              View analytics
            </Link>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-white/80 p-5 shadow-sm">
            <p className="text-sm font-semibold text-muted">Live sync</p>
            <p className="mt-2 text-2xl font-semibold text-ink">Images go straight to shoppers</p>
            <p className="mt-3 text-sm text-muted">Upload once and DR-YP serves optimized sizes to the swipe feed.</p>
          </div>
          <div className="rounded-2xl border border-border bg-white/80 p-5 shadow-sm">
            <p className="text-sm font-semibold text-muted">Inventory</p>
            <p className="mt-2 text-2xl font-semibold text-ink">Variant-level control</p>
            <p className="mt-3 text-sm text-muted">Track colors, sizes, and stock so recommendations stay accurate.</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-muted">Step 1</p>
          <h3 className="mt-2 text-xl font-semibold text-ink">Upload product imagery</h3>
          <p className="mt-2 text-sm text-muted">Add multiple angles per variant. We handle cropping and delivery.</p>
        </div>
        <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-muted">Step 2</p>
          <h3 className="mt-2 text-xl font-semibold text-ink">Set variants & stock</h3>
          <p className="mt-2 text-sm text-muted">Sizes, colors, and pricing stay in lockstep with the shopper feed.</p>
        </div>
        <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-muted">Step 3</p>
          <h3 className="mt-2 text-xl font-semibold text-ink">Go live instantly</h3>
          <p className="mt-2 text-sm text-muted">Once saved, your products appear in the DR-YP app without delay.</p>
        </div>
      </section>
    </main>
  );
}