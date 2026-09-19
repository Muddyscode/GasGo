import { Search } from "lucide-react";

type DispatchHeaderProps = {
  query: string;
  onQueryChange: (value: string) => void;
};

export function DispatchHeader({ query, onQueryChange }: DispatchHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-border/70 bg-surface/80 px-4 pt-[env(safe-area-inset-top)] shadow-gasgo-soft backdrop-blur-xl">
      <div className="flex h-14 items-center">
        <h1 className="text-[17px] font-semibold tracking-tight text-ink">Dispatch</h1>
      </div>
      <label className="relative mb-3 block">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted"
        />
        <input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search order number or phone"
          className="h-11 w-full rounded-xl border border-border bg-surface-muted pl-10 pr-3 text-[15px] text-ink outline-none placeholder:text-ink-muted/70 focus:border-brand-green focus:bg-surface focus:ring-2 focus:ring-brand-green/20"
        />
      </label>
    </header>
  );
}
