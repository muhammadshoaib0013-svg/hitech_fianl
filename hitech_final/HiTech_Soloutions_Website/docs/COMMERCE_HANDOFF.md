# Commerce integration handoff

## Current state

Functional storefront preview, static HTML + CSS + JS. Browser cart is persisted in localStorage and is NOT an actual reserved stock or confirmed purchase.

## To launch commercially

1. Create the verified product + variants in a reputable commerce platform (recommended Shopify).
2. Confirm product SKU, currency (PKR), price, supported paper, bundle content, inventory and shipping terms.
3. Replace browser cart source of truth with provider-created cart IDs and server/provider-resolved totals.
4. Integrate secure hosted checkout (do not accept raw card numbers in custom forms).
5. Handle return URLs, asynchronous order status, inventory and payment confirmation from the provider.
6. Configure COD only if supported by your operations and shipping partner.
7. Add customer emails/WhatsApp communications via verified channels, with permission and consent where needed.
8. Protect customer/order lookup from guessing and unauthorized disclosure.
9. Verify taxes, order totals, discounts, shipping and complete order lifecycle through provider sandbox tests.
10. Replace draft policies and preview labels; verify business contacts, analytics and SEO.

## Boundaries

- `site.config.js` is intended for public non-secret configuration only. NEVER add API secret keys to it.
- Do not enable `checkoutEnabled` based solely on a generic external URL without an actual cart-aware secure checkout integration.
- Never treat `localStorage` as authoritative proof of orders or payment.
