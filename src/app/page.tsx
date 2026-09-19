import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-surface px-6 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-16">
      <div className="flex flex-1 flex-col justify-center">
        <p className="text-sm font-semibold tracking-[0.18em] text-brand-green">
          GASGO
        </p>
        <h1 className="mt-3 text-[2.25rem] font-semibold leading-[1.12] tracking-tight text-ink">
          Know your gas.
          <br />
          Order with confidence.
        </h1>
        <p className="mt-3 max-w-[32ch] text-[15px] leading-relaxed text-ink-muted">
          Cooking gas, filled and delivered to your door.
        </p>
      </div>
      <Link
        href="/order/cylinder"
        className="flex h-14 items-center justify-center rounded-2xl bg-brand-green text-base font-semibold text-white shadow-gasgo-md transition-transform duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40 focus-visible:ring-offset-2"
      >
        Order gas
      </Link>
    </main>
  );
}
