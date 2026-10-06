# HiTech Soloutions — Premium Storefront Preview

A complete, responsive **multi-page storefront prototype** for the HiTech Pocket Mini Thermal Printer, built in dependency-free HTML, CSS and JavaScript. It uses original HiTech campaign imagery supplied in this conversation, carefully cropped and optimized as WebP.

## Quick start (no installation required)

1. Unzip the project.
2. Open `index.html` in Chrome, Edge, Firefox or Safari.
3. Browse all pages, click **The Printer**, add to bag, open the cart and switch the **For study / home / business / memories** use-case tabs.

For full localhost functionality, from this folder run:

```bash
python -m http.server 8765
```

Then open `http://localhost:8765/`.

## Included pages

Homepage, product details, solutions, how it works, FAQ, contact, cart, checkout setup, inspiration gallery, about, help/support, tracking placeholder, verified-review placeholder, shipping, returns, privacy and terms.

## Features included

- Premium responsive UI with semantic HTML, accessible accordions and a mobile menu
- Large HiTech printer imagery, product gallery and campaign galleries
- Interactive problem-solution selector
- Functional quantity selection and add/remove/update cart with browser-only localStorage
- Cart drawer and cart page sharing the same persisted state
- Product price and contact details controlled via a single config
- Contact message composer that copies the message rather than falsely claiming it was transmitted
- Honest checkout setup state, no fake payments or made-up order confirmation
- Reduced-motion support, responsive imagery, search descriptions, and selected `noindex` pages

## Configure before launch

Edit `site.config.js`:

- `product.price` — verified numeric selling price in Pakistani Rupees, e.g. `3499`
- `product.sku` — actual printer SKU or model number
- `contact.phone`, `contact.whatsapp`, `contact.email`, `contact.address`
- `social` URLs — official verified accounts
- `commerce` — **see warning below**

### Important: this preview does not process orders

The demo intentionally **does not accept payment or create orders**. Updating a product price does not magically enable checkout. Production use requires integration with a supported commerce platform, including trusted cart/checkout operations, stock control, order creation, delivery, policy and refund handling. Recommended: Shopify storefront/cart integration and hosted checkout. A raw checkout URL alone is not a substitute for validating cart totals with a commerce provider. Treat `commerce.checkoutUrl` as a test-only placeholder until secure provider-side integration is implemented.

### Product imagery and claims

The campaign images are **AI-generated concept visuals**, not documentary photos of a verified physical SKU. Replace with accurate official product images before selling. Do not promise adhesive thermal paper, shipping labels, specific mobile compatibility, battery life, included accessories or color printing without supplier verification.

### Business details and policies

Real contact details, shipping charges, delivery estimates, prices, inventory, refunds, privacy rules and payment methods are still pending. Policy pages are clearly marked draft. There are no invented testimonials, sales counts, guarantees or deadlines.

## Architecture

- `index.html` — main homepage
- `product.html` and other HTML files — static routes and metadata
- `site.js` — UI interactions (cart, menu, tabs, gallery, contact)
- `site.config.js` — centralized configurable business values
- `styles.css` — global responsive design system
- `assets/*.webp` — optimized visual assets
- `generate.py` — shared-layout page generator (edit then rerun)
- `build_assets.py` — original-image cropping pipeline (requires original campaign images)
- `docs/` — handoff, checks and implementation notes

This dependency-free delivery can be hosted on static hosting. For commercial ecommerce, migrate the UI to a Shopify theme or Next.js frontend connected to Shopify's active APIs, including a real order backend.

## Owner review before release

See `docs/OWNER_CHECKLIST.md` and `docs/COMMERCE_HANDOFF.md`.
