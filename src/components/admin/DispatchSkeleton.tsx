export function DispatchSkeleton() {
  return (
    <div className="flex flex-col gap-2.5" aria-hidden="true">
      {Array.from({ length: 5 }, (_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-border bg-surface px-3.5 py-3"
        >
          <div className="flex items-center justify-between">
            <div className="h-4 w-36 animate-pulse rounded bg-surface-muted" />
            <div className="h-6 w-20 animate-pulse rounded-full bg-surface-muted" />
          </div>
          <div className="mt-3 h-4 w-48 animate-pulse rounded bg-surface-muted" />
          <div className="mt-2 h-3.5 w-40 animate-pulse rounded bg-surface-muted" />
          <div className="mt-3 h-11 animate-pulse rounded-xl bg-surface-muted" />
        </div>
      ))}
    </div>
  );
}
