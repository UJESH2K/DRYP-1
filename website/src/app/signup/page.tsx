'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to sign up');
      }
      
      // Automatically log the user in after successful registration
      login(data.user, data.token);

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Signup failed');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_20%_20%,rgba(0,122,255,0.08),transparent),radial-gradient(circle_at_80%_0%,rgba(15,23,42,0.06),transparent),#f5f6fb] px-4 py-10">
      <div className="grid w-full max-w-5xl items-center gap-10 rounded-3xl border border-border/80 bg-white/80 p-10 shadow-soft lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand/10 px-4 py-2 text-sm font-semibold text-brand">
            <span className="h-2 w-2 rounded-full bg-brand" />
            DR-YP · Vendor Hub
          </div>
          <h1 className="font-zaloga text-4xl leading-tight text-ink">Create your vendor account</h1>
          <p className="text-base text-muted max-w-xl">
            Use the same visual language as the shopper app. Publish products with images and variants, and have them appear in the feed immediately.
          </p>
          <div className="grid gap-3 text-sm text-ink/80">
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-white/70 px-4 py-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-white font-semibold">✓</div>
              <p>Access the vendor dashboard with your credentials.</p>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-white/70 px-4 py-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-white font-semibold">✓</div>
              <p>Upload imagery per variant and keep stock in sync.</p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-8">
          <div className="mb-6 space-y-2 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">Vendor Hub</p>
            <h2 className="font-zaloga text-3xl text-ink">Join DR-YP</h2>
            <p className="text-sm text-muted">Create your account to start publishing.</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="text-sm font-semibold text-ink">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 block w-full rounded-xl border border-border bg-white px-3 py-3 text-ink shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                  placeholder="Alex Vendor"
                />
              </div>
              <div>
                <label htmlFor="email-address" className="text-sm font-semibold text-ink">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 block w-full rounded-xl border border-border bg-white px-3 py-3 text-ink shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                  placeholder="you@brand.com"
                />
              </div>
              <div>
                <label htmlFor="password" className="text-sm font-semibold text-ink">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 block w-full rounded-xl border border-border bg-white px-3 py-3 text-ink shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                  placeholder="Create a strong password"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-brand/90 disabled:cursor-not-allowed disabled:bg-brand/70"
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-muted">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-ink hover:text-brand">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
