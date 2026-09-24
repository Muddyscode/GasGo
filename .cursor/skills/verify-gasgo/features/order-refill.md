# Refill order (fill → address → pay → track)

The paid plant-refill loop. Composer writes `gasgo-order-draft`. Paystack success (mock when no public key) calls `completePaidCheckout`, which persists `gasgo-customer-orders` and **clears the draft**, then `router.push(/order/tracking/:orderId)` with a `gg_…` id (`createLocalOrderId`).

## Sub-features

- **Fill** `/order/cylinder` (`FillComposer`): capacity input + **Common capacities** chips 6 / 12.5 / 25 / 50 kg; **Fill mode** Full / By kg / By ₦; live quote (`₦1,450/kg`); sticky **Continue** enabled when `quote().fillKg > 0`.
- **Delivery** `/order/address` (`AddressDeliveryForm`): **Fulfillment mode** Door-to-door (default) vs Hub self-collect; pickup/return dates (`aria-label` from `OrderDatePicker`, 8:00pm WAT cutoff); saved addresses Home / Work / Mum's place / Aunty Bisi; presence radios; window radios; optional notes; **Continue** when fill + address + (presence unless hub) + valid dates.
- **Checkout** `/order/checkout`: **Review and pay** + `PaystackPayButton`. Empty draft → `CheckoutEmpty` (**A few details first**). Guest triggers `AuthModal` (`Create an account to checkout`).
- **Pay**: signed-in **Pay now**; guest **Sign up to pay**. No `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` → immediate mock success (no Paystack iframe).
- **Tracking** `/order/tracking/[orderId]`: paid relief **You're paid** while stage is `queued`. Dev-only `[data-demo-stepper="plant-loop"]` walks queued → … → delivered.
- **Nav draft chip**: after a capacity is set, `aria-label="Continue 12.5 kg order"` (example) resumes address or checkout.

## How to get to it (user POV)

From marketing, **Start a refill**. From signed-in home, **Order a refill**. From a leftover draft, the bag chip. Deep-link `/order/cylinder` always works; `/order/checkout` without a ready draft shows the empty state.

## Driving it with Chrome DevTools

1. Isolated profile. Open `/order/cylinder` (or land via marketing).
2. Wait for **What should we fill?**.
3. Click **12.5 kg** in `aria-label="Common capacities"`. Full mode is the default — **Continue** enables; sticky hint looks like `12.5 kg at ₦1,450/kg`.
4. Screenshot. Click **Continue** → `/order/address`, heading **Where should we collect it?** (door-to-door).
5. Leave fulfillment on **Door-to-door**. Click address radio **Home, 12 Forces Avenue, Old GRA, Old GRA** (`aria-label` on `AddressCard`).
6. Click presence **Someone will be home**. Window defaults to ASAP.
7. Click **Continue** → `/order/checkout`, **Review and pay**.
8. If the dialog **Create an account to checkout** is open, click **Continue with demo account** (Tunde). Or fill Full name + Phone (≥10 digits).
9. Click **Pay now**. Wait for `/order/tracking/gg_` and **You're paid** (or **Order received** once the overlay settles).
10. Observe: `gasgo-customer-orders` has an order; `gasgo-order-draft` is cleared (`cylinderId` null / empty fill). Screenshot tracking.

Do not `completePaidCheckout` from the console and call that a proof.

## Gotchas

- Sticky **Continue** on fill stays disabled until `fillKg > 0`. Empty capacity is not a 12.5 default until the user types or hits a chip (placeholder is `12.5` only).
- Hub mode hides presence and zeros transport (`applyFulfillmentToQuote`). Door-to-door Old GRA adds **₦700** (`PH_ZONES`).
- After 20:00 Africa/Lagos, same-day dates roll; copy mentions **8:00pm WAT**.
- Guest checkout opens the modal; **Pay now** also calls `requestAuth`. Drive the modal, do not skip it with `signIn()` unless you are testing the store in isolation (that is not this feature).
- `/order/success` exists but **Pay now** does not navigate there. Do not wait for **Paid — test checkout** after the button.
- Demo stepper is absent in production builds unless `NEXT_PUBLIC_GASGO_DEMO=1`. `next dev` shows it.
- Auth sign-in/out must not clear the draft — if a sign-in wipes capacity, that is a regression (`SECURITY.md`).
