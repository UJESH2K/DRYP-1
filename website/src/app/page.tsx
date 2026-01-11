import Link from 'next/link';

const highlights = [
  {
    title: 'Live sync to shopper app',
    detail: 'Products you publish appear instantly in the DR-YP swipe feed.',
  },
  {
    title: 'Image-first merchandising',
    detail: 'Upload multiple angles per variant and keep them crisp across devices.',
  },
  {
    title: 'Inventory aware by default',
    detail: 'Variant stock and pricing stay in lockstep with your catalog.',
  },
];

const steps = [
  'Upload photos — we handle sizing and compression.',
  'Add colors, sizes, and stock in one place.',
  'Publish to go live for shoppers immediately.',
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col text-ink">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 border-b border-border/80">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-ink text-white font-semibold shadow-soft">DR</div>
          <div className="leading-tight">
            <p className="font-zaloga text-xl">DR-YP</p>
            <p className="text-sm text-muted">Vendor Hub</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="rounded-xl px-4 py-2 text-sm font-semibold text-ink hover:bg-white/70 border border-border">
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white shadow-soft hover:bg-brand/90"
          >
            Open Vendor Hub
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-12 lg:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-ink shadow-soft border border-border/70">
              <span className="h-2 w-2 rounded-full bg-brand" />
              Built for vendors who move fast
            </div>
            <div className="space-y-6">
              <h1 className="font-zaloga text-4xl leading-tight sm:text-5xl lg:text-6xl">
                Bring your catalog to the DR-YP experience.
              </h1>
              <p className="max-w-2xl text-lg text-muted">
                Upload products, push images, and manage inventory in a workspace that matches the main DR-YP app. Your updates flow straight to shoppers without extra steps.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/signup"
                className="rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white shadow-soft hover:bg-brand/90"
              >
                Create a vendor account
              </Link>
              <Link
                href="/login"
                className="rounded-xl border border-border px-5 py-3 text-sm font-semibold text-ink hover:bg-white/70"
              >
                Already onboarded? Log in
              </Link>
              <p className="text-sm text-muted">No setup fees. Syncs with your existing DR-YP backend.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {highlights.map((item) => (
                <div key={item.title} className="glass-card rounded-2xl p-5">
                  <h3 className="font-semibold text-base text-ink">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-3xl p-8 shadow-soft border border-border/70">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.15em] text-muted">Go live flow</p>
                <h2 className="mt-2 font-zaloga text-3xl text-ink">From upload to live in minutes</h2>
              </div>
              <div className="rounded-full bg-brand/10 px-4 py-2 text-sm font-semibold text-brand">Instant sync</div>
            </div>

            <div className="mt-8 space-y-4">
              {steps.map((step, idx) => (
                <div key={step} className="flex items-start gap-3 rounded-2xl border border-border bg-white/80 px-4 py-3">
                  <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-brand text-white font-semibold">
                    {idx + 1}
                  </div>
                  <p className="text-sm text-ink">{step}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 grid gap-4 rounded-2xl bg-ink px-6 py-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/70">Image delivery</p>
                  <p className="text-2xl font-semibold">Ready for the swipe feed</p>
                </div>
                <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">Optimized</div>
              </div>
              <p className="text-sm text-white/80">
                Upload high-res shots and we serve responsive sizes back to shoppers instantly. No broken links, no delays.
              </p>
              <div className="flex items-center gap-4 text-sm">
                <span className="rounded-full bg-white/10 px-3 py-1">Multi-variant galleries</span>
                <span className="rounded-full bg-white/10 px-3 py-1">Stock-aware merchandising</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mx-auto w-full max-w-6xl px-6 py-8 text-sm text-muted">
        <p>&copy; {new Date().getFullYear()} DR-YP. Powered by the same stack as the main app.</p>
      </footer>
    </div>
  );
}
