---
name: verify-gasgo
description: Drive the GasGo Next.js PWA (Port Harcourt cooking-gas delivery) in a real browser — launch an isolated dev server, doctor it, and exercise customer/admin UI. Use mid-task whenever a change touches marketing, the refill order path, demo auth, profile, or admin dispatch.
---

# Verify GasGo

GasGo is a Next.js 15 PWA. A visitor touches a **web UI** (marketing pages, refill composer, Paystack checkout, tracking, profile, admin dispatch). There is no CLI and no live Supabase client in `src/` — customer session, order draft, placed orders, and admin unlock are **Zustand persist keys in localStorage**. Vitest covers units only; there is no Playwright/Cypress suite. Drive the UI with **Chrome DevTools / isolated Chrome CDP**.

Write proofs for the next agent, not a human demo script. Read `features/` before picking a path.

## Launch

Always start an **isolated** instance. The repo's documented Cloud env (`/.cursor/environment.json`) and `npm run dev` bind **http://localhost:3000**. Do not attach to `:3000` if anything else may already be using it — that origin shares `localStorage` (`gasgo-session`, `gasgo-order-draft`, `gasgo-customer-orders`, `gasgo-admin-session`, `gasgo-theme`) and you will corrupt that session.

```bash
# from repo root
./.cursor/skills/verify-gasgo/helpers/launch.sh
```

What it does:

- `npm run dev -- --hostname 127.0.0.1 -p 3100` (override with `GASGO_VERIFY_PORT`)
- Writes pid / port / url / log under `.cursor/skills/verify-gasgo/.run/` (gitignored scratch)
- Ready when `GET /` returns **200** and Next logs `Ready in` (or HTTP 200 alone after the wait loop)

No `.env` is required. Observed defaults:

| Concern | What verification uses |
|---|---|
| Paystack | Unset `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` → `initiatePaystackPayment` returns `{ kind: "mock" }` (`src/lib/paystack.ts`) |
| Admin PIN | Unset `NEXT_PUBLIC_ADMIN_DEMO_PIN` → documented fallback **`2468`** (`src/lib/admin/auth.ts`) |
| Demo stepper | On in `next dev` (`NODE_ENV !== "production"`) via `isDemoToolsEnabled` |
| Seed data | In-memory admin tickets from `src/lib/admin/orders.ts`; customer mocks from `src/data/profile.ts` |

Teardown is `helpers/cleanup.sh` (kills the pid tree we started, deletes `.run/`, **keeps evidence**).

Two instances can sit side by side: pick another `GASGO_VERIFY_PORT` **and** another `GASGO_VERIFY_CDP_PORT`. Same origin = shared client state. If the chosen port is already bound, launch **refuses** instead of stealing it.

## Doctor

Run this first whenever anything looks off. It is read-only.

```bash
./.cursor/skills/verify-gasgo/helpers/doctor.sh
```

It answers: is our pid alive, is `package.json` name `gasgo`, is our port listening (and preferably owned by that pid tree), and do these routes return 200 with `<title>GasGo</title>` on `/`?

- `/` `src/app/(customer)/page.tsx` — `HomeGate` (marketing if signed out, `AppHome` if `gasgo-session` has a user)
- `/order/cylinder` fill composer
- `/login` demo auth
- `/admin/login` PIN gate
- `/how-it-works` `/zones` `/why` `/profile`

`/` SSR is the `HomeGate` shell. The hero headline is **client-only** after persist hydration (~80 ms fallback). Doctor checks the HTML title, not the hydrated headline. Drive waits for the headline.

If doctor fails, do not drive. Cleanup, then launch again.

## Drive

Harness: **Chrome DevTools MCP** (navigate / snapshot / click / fill / screenshot) **or** the isolated CDP helper. Prefer **routes, visible names, ARIA**. Do not click by coordinates.

Seeded scripted drive (marketing landing → fill composer):

```bash
./.cursor/skills/verify-gasgo/helpers/drive-marketing-landing.sh
```

That launches a **fresh headless Chrome** (`--user-data-dir` under `.run/chrome-profile`) so `/` cannot inherit a leftover demo session.

### Stable handles from this repo

**Routes** (`src/lib/customer-routes.ts`, `src/app/`):

| Path | What the user sees |
|---|---|
| `/` | Signed-out: `MarketingLanding`. Signed-in: `AppHome`. `/app` is the same `HomeGate`. |
| `/how-it-works` `/zones` `/why` | Marketing pages |
| `/order/cylinder` → `/order/address` → `/order/checkout` → `/order/tracking/[orderId]` | Refill loop. Paid checkout **does not** land on `/order/success` (that page is query-param leftover). |
| `/login` `/signup` | `AuthEntryView` — button **Continue with demo account** |
| `/profile` `/profile/addresses` `/profile/orders/[orderId]` | Profile. Signed-out `/profile` shows **You're signed out** + **Sign in**. |
| `/admin/login` `/admin` `/admin/orders/[orderId]` | Dispatch. Unlocked flag in `gasgo-admin-session`. |

**Names / ARIA** (click these, not pixels):

- Hero / marketing: link text **Start a refill**, **See prices**, **Sign in**; nav `aria-label="Marketing"` with **How it works**, **Zones**, **Why GasGo**, **Order**
- Home brand: `aria-label="GasGo home"`
- Fill: heading **What should we fill?**; capacity `sr-only` **Cylinder capacity in kilograms**; `role="group"` **Common capacities** (buttons `6 kg`, `12.5 kg`, `25 kg`, `50 kg`); `role="radiogroup"` **Fill mode** radios **Full** / **By kg** / **By ₦**; sticky **Continue**
- Address: `aria-label="Fulfillment mode"` (**Door-to-door** / **Hub self-collect**); `aria-label="Delivery address"` (Home / Work / Mum's place / Aunty Bisi); `aria-label="Presence and handover"`; `aria-label="Preferred delivery window"`; **Continue**
- Checkout: heading **Review and pay**; pay button **Pay now** or **Sign up to pay**; auth dialog `aria-labelledby` **Create an account to checkout** + **Continue with demo account**
- Tracking (dev): `[data-demo-stepper="plant-loop"]` **Advance to …** / **Reset**
- Admin: input labeled **Demo PIN**; submit **Unlock dispatch**; `role="tablist"` **Dispatch filters**; search placeholder **Search order number or phone**; **Lock**
- Theme: `aria-label="Switch to dark theme"` / **Switch to light theme**
- Profile: `aria-label="Profile"`; **Log out**

**localStorage keys** (observe after actions; do not treat as the user path):

- `gasgo-session` — `signIn` / `signOut` (`src/stores/session.ts`). Auth must never `clear()` the draft.
- `gasgo-order-draft` — fill + address. Only `completePaidCheckout` may clear it.
- `gasgo-customer-orders` — placed orders after mock/real Paystack success.
- `gasgo-admin-session` — `{ unlocked: true }` after PIN **2468**.
- `gasgo-theme` — `system` \| `light` \| `dark`.

Chrome DevTools recipe (same selectors as the helper):

1. `new_page` or `navigate_page` to `$GASGO_VERIFY_BASE_URL/` with `isolatedContext` named `gasgo-verify` (or a fresh profile).
2. `wait_for` text `A full cylinder back at the door, before the pot needs it.`
3. `take_snapshot` → click the **Start a refill** link (not the status-card duplicate unless you mean to).
4. `wait_for` `What should we fill?`
5. Screenshot + dump `location.href` (must include `/order/cylinder`).

Feature files in `features/` have the rest of the map.

## Evidence

Proof lives in **`.cursor/skills/verify-gasgo/evidence/`**. Cleanup must not touch this directory. The helper also writes `LAST_PROOF.json` pointing at the newest run.

A proof is complete only if it:

1. Exercises the **real UI path** (links, radios, Pay now). Do not `localStorage.setItem` a draft and call that checkout. Do not hit a test-only endpoint — there isn't one.
2. Captures **the action and the resulting state** (screenshot + href + visible text before and after). A final frame alone is not enough.
3. Checks **side effects** that this app actually has: `gasgo-order-draft` after choosing a capacity; `gasgo-session` after demo sign-in; `gasgo-customer-orders` after **Pay now**; admin board still listing seed ticket `GG-20260919-0042` after a stage bump. There is no server DB to query.
4. Uses mocks only at production boundaries that already isolate: Paystack without a public key; admin in-memory seed; demo account `tunde@demo.gasgo.app` (`DEMO_SESSION_USER`).

When a name says mock or demo, still observe what it skipped (no `js.paystack.co` script if the public key is unset; `kind: "mock"` path in `src/lib/paystack.ts`).

## Cleanup

```bash
./.cursor/skills/verify-gasgo/helpers/cleanup.sh
```

Kills **only** the Next pid recorded at launch and the Chrome pid the driver recorded, by walking `/proc/<pid>/task/<pid>/children`. Never `pkill -f next` / `pkill -f chrome`. Deletes `.run/` (logs, pid, chrome profile). **Leaves `evidence/` in place.** After cleanup, confirm `evidence/LAST_PROOF.json` (or the dated files) still exist.

If a drive fails, run cleanup before the next launch so ports and CDP `33100` are free.

## Helpers

All executable; invoke from repo root. Implementation is in the script — do not reverse-engineer flags that are not listed here.

```bash
./.cursor/skills/verify-gasgo/helpers/launch.sh
./.cursor/skills/verify-gasgo/helpers/doctor.sh
./.cursor/skills/verify-gasgo/helpers/drive-marketing-landing.sh
./.cursor/skills/verify-gasgo/helpers/cleanup.sh
```

| Helper | Role |
|---|---|
| `helpers/launch.sh` | Isolated `next dev` on `GASGO_VERIFY_PORT` (default **3100**) |
| `helpers/doctor.sh` | Read-only health of that instance |
| `helpers/drive-marketing-landing.sh` | Chrome CDP: `/` → **Start a refill** → `/order/cylinder` + screenshots/JSON under `evidence/` |
| `helpers/cdp-drive.mjs` | Engine for the drive script (`node …/cdp-drive.mjs marketing-landing`) |
| `helpers/cleanup.sh` | Kill launched pids; keep evidence |
| `helpers/lib.sh` | Shared paths — sourced, not executed |

Optional env: `GASGO_VERIFY_PORT`, `GASGO_VERIFY_HOST`, `GASGO_VERIFY_BASE_URL`, `GASGO_VERIFY_CDP_PORT` (default **33100**), `GASGO_VERIFY_CHROME`, `GASGO_VERIFY_EVIDENCE_DIR`, `GASGO_VERIFY_RUN_DIR`.
