# Marketing landing and pages

Cold visitor surface. `HomeGate` (`src/components/home/HomeGate.tsx`) renders `MarketingLanding` when `gasgo-session` has no user, else `AppHome`. Marketing chrome (`TopNav marketing`) is on `/`, `/how-it-works`, `/zones`, `/why` only while signed out (`CustomerChrome`).

## Sub-features

- Hero on `/`: headline **A full cylinder back at the door, before the pot needs it.** (`MARKETING_HEADLINE`), lede about collect / plant refill / return, CTAs **Start a refill** → `/order/cylinder` and **See prices** → `/zones`, **Sign in** → `/login`.
- Live rate chip: **Live ₦1,450/kg** (`LIVE_RATE_NGN_PER_KG` + `formatNaira`) and **Start a refill** (desktop card + mobile).
- How it works band: **Collect → Plant refill → Return** (`HowItWorks`).
- Audience scenes, `ZoneMap` with `aria-label="Map legend"`, key benefits, FAQ.
- `/how-it-works`: hero **Collect empty. Plant refill. Return full.** plus **Start a refill**.
- `/zones`: **Garden City coverage. Not the whole map of Nigeria.**, fee ceiling **₦1,200**, door-to-door vs hub copy, **Order in your zone**.
- `/why`: **Plant refill you can actually follow.**, plant vs street contrast (`aria-labelledby="contrast-heading"`).
- Island nav (`aria-label="Marketing"`, `md:flex` — hidden on narrow viewports): **How it works**, **Zones**, **Why GasGo**, **Order**. Narrow viewports get a green **Order** button instead.

## How to get to it (user POV)

1. Open the isolated verify origin with an empty profile (no `gasgo-session`).
2. Land on `/`. Wait out **Loading GasGo** (persist hydration, 80 ms fallback).
3. Read the hero. Use **See prices** or the marketing nav to reach `/zones`, `/how-it-works`, `/why`.
4. Start a refill from any **Start a refill** / **Order** / **Order in your zone** control.

If a previous run signed in on this origin, `/` is `AppHome` (**Port Harcourt plant refill** + **Order a refill**). That is a different feature. Fresh Chrome profile or clear `gasgo-session`.

## Driving it with Chrome DevTools

Scripted:

```bash
./.cursor/skills/verify-gasgo/helpers/launch.sh
./.cursor/skills/verify-gasgo/helpers/doctor.sh
./.cursor/skills/verify-gasgo/helpers/drive-marketing-landing.sh
```

Manual CDP / MCP:

1. Isolated context → `$GASGO_VERIFY_BASE_URL/`.
2. Wait for `A full cylinder back at the door, before the pot needs it.`
3. Screenshot + a11y snapshot (action: hero visible).
4. Click the hero link **Start a refill** (`href="/order/cylinder"`).
5. Wait for `What should we fill?` and `We collect your empty, refill it at the plant, and return it filled.`.
6. Confirm `location.pathname === "/order/cylinder"`. Screenshot (result).

Optional: click **See prices**, wait for `Garden City coverage`, confirm `/zones`.

End state that proves it: signed-out `/` shows the marketing headline; the primary CTA routes to the fill composer without a session.

## Gotchas

- `HomeGate` is client-only. Doctor HTML will show `<title>GasGo</title>` and often **Loading GasGo**, not the headline.
- Two **Start a refill** controls exist on desktop (hero + status card). Prefer the hero `Link` in `.hero-copy` / first snapshot match with that name.
- Marketing island nav is `hidden` below `md`. Drive the hero CTAs or the mobile **Order** button at narrow widths.
- Signing in mid-run flips chrome from marketing to the app shell on `/`.
- Do not treat `/app` as a separate product — it is the same `HomeGate`.
