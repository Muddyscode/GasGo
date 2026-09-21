# GasGo security notes (demo)

This app is a customer + plant-ops demo. Treat paid and identity as **untrusted** until the production seams below exist.

## What is true today

- **Mock customer session is client-only.** `gasgo-session` in `localStorage` is set by `signIn()` in `src/stores/session.ts`. Anyone can write that key. AuthModal / demo account is not Supabase Auth.
- **`signIn` / `signOut` must never call `clear()` on `gasgo-order-draft`.** Only a completed Paystack pay may clear the draft.
- **Paystack Inline without server verify is a demo risk.** `initiatePaystackPayment` uses `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` only (public key). Success is the popup callback — there is no webhook, no secret key, and no server-side verification before the UI treats the order as paid.
- **Admin gate is a demo PIN, not RBAC.** `/admin` requires `gasgo-admin-session` in `localStorage`, set only after a matching PIN on `/admin/login`. PIN is `NEXT_PUBLIC_ADMIN_DEMO_PIN` or the documented fallback `2468`. This stops casual visitors from stage-bumping mock orders. It is not production auth.

## Production must have before trusting paid

1. **Supabase Auth** for customers (and a real admin role), not a client flag.
2. **Paystack webhook verification** (secret key on the server) before marking an order paid or dispatching a rider.
3. Do **not** put Paystack secret keys, service-role keys, or admin PINs in the client bundle. Keep the Paystack **public** key only on the client.

Hub-configured stubs (`LIVE_RATE_NGN_PER_KG`, `PH_ZONES`) are constants, not secrets.
