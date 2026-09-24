# Customer profile

Signed-in account surface. `ProfileView` reads session + `gasgo-customer-orders` and overlays mock history from `src/data/profile.ts` (`MOCK_ORDERS` GG-1842, GG-1770, … for `usr_tunde_adebayo`).

## Sub-features

- Signed-out `/profile`: **You're signed out**, **Sign in** → `/login`.
- Signed-in: **Profile** header, `ProfileUserCard` (Tunde after demo), `aria-label="Edit profile"` opens `EditProfileSheet` (`role="dialog"`).
- `ProfileGaugeCard` mock ~62%.
- `ProfileOrderHistory` — mock delivered tickets plus any placed orders; rows link `/profile/orders/[orderId]`.
- `ProfileAddresses` + `/profile/addresses` (`AddressesManageView`) using `SAVED_ADDRESSES` (Home, Work, Mum's place, Aunty Bisi).
- `ComingSoonTeaser` **Never run out** — teaser, does not place refills.
- `ProfileSupport`: theme row (`aria-label="Theme"`), **Chat on WhatsApp** (`wa.me/2348088444645`), **Log out**.

## How to get to it (user POV)

Sign in (demo account), then tap `aria-label="Profile"` in `NavActions`, or open `/profile`. Addresses via the profile list or `/profile/addresses`. Order detail from a history row.

## Driving it with Chrome DevTools

1. Sign in via `/login` → **Continue with demo account** (see demo-auth).
2. Click `aria-label="Profile"`.
3. Wait for the profile header and Tunde's card. Screenshot.
4. Confirm history includes **GG-1842** (or a `gg_` id if you just paid).
5. Click **Log out**. Wait for marketing headline on `/`. Session user is null. Screenshot.

Optional: **Edit profile** → change Full name → save → home greeting uses the new first name (`signIn` merge in `ProfileView`).

## Gotchas

- Mock history is **user-id scoped**. A modal-created guest (`usr_<timestamp>`) will not see Tunde's GG-1842 tickets — only orders they placed.
- Gauge / addresses are mock accessors (`getMockGauge`, `getMockAddresses`), not server reads.
- WhatsApp opens an external `wa.me` URL. Do not treat a new tab to WhatsApp as an in-app failure; do not send a real message as “proof”.
- Auto-refill teaser must stay inert (`leftover-lock` tests). No checkbox that places a background order.
