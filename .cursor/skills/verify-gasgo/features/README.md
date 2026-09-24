# GasGo feature map

Maintained verification source for the customer + plant-ops web UI. A proof that only hits one convenient entry is incomplete when this map lists others — drive the feature you changed.

There is no Playwright/Cypress suite. Drive with **Chrome DevTools** or `helpers/drive-marketing-landing.sh` (CDP). Routes and control names below are from `src/app/` and the components they render.

| Feature | File | Primary routes | First proof? |
|---|---|---|---|
| Marketing landing and pages | [marketing-landing.md](marketing-landing.md) | `/`, `/how-it-works`, `/zones`, `/why` | Yes — scripted helper |
| Refill order (fill → pay → track) | [order-refill.md](order-refill.md) | `/order/cylinder`, `/order/address`, `/order/checkout`, `/order/tracking/[orderId]` | |
| Demo customer auth | [demo-auth.md](demo-auth.md) | `/login`, `/signup` | |
| Customer profile | [customer-profile.md](customer-profile.md) | `/profile`, `/profile/addresses`, `/profile/orders/[orderId]` | |
| Admin dispatch | [admin-dispatch.md](admin-dispatch.md) | `/admin/login`, `/admin`, `/admin/orders/[orderId]` | |

Not in the product today (do not invent): live Supabase Auth, Paystack webhook verify, auto-refill placement, cylinder marketplace. `ComingSoonTeaser` is a teaser only.

Keep this map honest with `/maintain-verification-skill` when routes or copy change.
