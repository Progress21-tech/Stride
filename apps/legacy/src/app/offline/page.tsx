export default function OfflinePage() {
  return <section className="glass-card w-full rounded-2xl p-7 text-center">
    <h1 className="text-xl font-semibold">You’re offline</h1>
    <p className="mt-2 text-sm text-[var(--text-muted)]">Reconnect to continue to Sylpace. Your private pages are not stored for offline use on this device.</p>
    <a href="/login" className="mt-5 inline-flex rounded-lg bg-[#18A957] px-4 py-2 text-sm font-semibold text-white">Try again</a>
  </section>;
}
