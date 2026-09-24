# Admin dispatch

Plant-ops board. Client PIN gate, not RBAC. In-memory tickets from `seedOrders()` in `src/lib/admin/orders.ts` (e.g. **GG-20260919-0042** Chioma Okeke, stage `nearby`). Reloading the tab reseeds — there is no disk.

## Sub-features

- `/admin` while locked → `AdminGate` replaces to `/admin/login`.
- Login: **Admin login**, **Demo PIN**, hint names `NEXT_PUBLIC_ADMIN_DEMO_PIN` or fallback **2468**, submit **Unlock dispatch**. Wrong PIN: `role="alert"` **That PIN doesn’t match.**
- Board: heading **Dispatch**, search **Search order number or phone**, **Lock**, tabs `aria-label="Dispatch filters"` **All / Pending / Out for delivery / Delivered** with counts.
- Cards: seed names (Chioma Okeke, Tunde Balogun, …), `StageUpdater` **Next: …** plus `sr-only` **Set stage** `<select id="stage-{orderId}">`.
- `/admin/orders/[orderId]` — `OrderDetailView`.
- Empty tab: **No pending orders** (etc.) / **No matching orders**.

## How to get to it (user POV)

Open `/admin` (redirects to login) or `/admin/login`. Enter **2468** unless the env PIN is set. **Unlock dispatch** → `/admin`. **Lock** returns to the login screen.

## Driving it with Chrome DevTools

1. Isolated profile (admin key is a different localStorage entry, but still isolate).
2. Open `/admin/login`. Wait for **Admin login**.
3. Fill the **Demo PIN** field with `2468`. Click **Unlock dispatch**.
4. Wait for heading **Dispatch** and ticket **GG-20260919-0042**. Screenshot (board).
5. Click tab **Out for delivery** (`aria-selected` flips). Chioma's nearby ticket still visible (filter `out` includes `nearby`).
6. On that card, click **Next: …** or set the **Set stage** select. Wait until **Updating…** clears.
7. Confirm the badge/title on that card changed. Screenshot (result). `getOrdersSnapshot()` is in-memory — a full reload restores the seed.

## Gotchas

- Fallback PIN **2468** is in the client bundle. This is the documented demo gate, not production auth.
- `AdminGate` hydrates with **Checking admin session…** (~400 ms timeout). Do not treat that flash as a failure.
- Seed is module memory. Two browser tabs on the **same** JS runtime share it; a refresh rebuilds `seedOrders()` with fresh relative timestamps. Do not look for a SQL row.
- Customer `gasgo-customer-orders` is **not** the admin seed. Paying as Tunde does not add a dispatch card unless something later wires that seam (it is not wired now).
- Brand mark in the admin header links to `/admin`, not marketing `/`.
