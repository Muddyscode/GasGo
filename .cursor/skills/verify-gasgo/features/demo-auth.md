# Demo customer auth

Client-only session. `useSession` persist key `gasgo-session`. Not Supabase Auth (`SECURITY.md`). Demo user is `DEMO_SESSION_USER`: Tunde Adebayo, `tunde@demo.gasgo.app`, `usr_tunde_adebayo`.

## Sub-features

- `/login` and `/signup` (`AuthEntryView`): headings **Welcome back** / **Create your account**; primary **Continue with demo account**; swap link **Sign up** / **Sign in**.
- `AuthModal` (checkout / `requestAuth`): **Create an account to checkout** or **Create your GasGo account**; fields Full name, Phone, optional Email; **Sign up and continue to checkout** / **Create account**; secondary **Continue with demo account**; `aria-label="Close sign up"`.
- After demo continue from `/login` or `/signup`, `router.push("/")` → **`AppHome`** (greeting + **Order a refill**), not marketing.
- Profile **Log out** (`signOut`) returns `/` to marketing.
- Sign-in must keep `gasgo-order-draft`.

## How to get to it (user POV)

- Marketing hero **Sign in**, nav **Sign in** (hidden below 360px), or `/login`.
- Checkout as a guest (modal).
- `/signup` from the login footer **Need an account?**.

## Driving it with Chrome DevTools

1. Isolated profile. Open `/login`.
2. Wait for **Welcome back** and **Continue with demo account**. Screenshot (signed-out auth).
3. Click **Continue with demo account**.
4. Wait for `/` and **Port Harcourt plant refill** plus a greeting (Good morning/afternoon/evening) and **Order a refill** — not the marketing headline.
5. Confirm `localStorage.gasgo-session` includes `tunde@demo.gasgo.app` / `usr_tunde_adebayo`. Screenshot (signed-in home).
6. Optional: open `/profile` and click **Log out**; `/` must show the marketing headline again and session user is null.

Modal path: start a ready checkout as a guest, wait for `role="dialog"`, click **Continue with demo account**, land back on **Review and pay** with **Pay now**.

## Gotchas

- There is no password. Any “real email/password login” is not in this UI.
- `AuthEntryView` always uses the demo user — the page does not collect name/phone. Custom guests exist only in `AuthModal`.
- Hydration: `HomeGate` / `AppHome` wait on persist. Do not assert marketing vs app in the first 100 ms.
- Phone in the modal must have ≥10 digits after stripping non-digits or submit stays disabled.
- Do not clear `gasgo-order-draft` to “reset auth”.
