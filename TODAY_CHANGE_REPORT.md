# AU-STELLAR LIFE — Development Handoff Report

**Date:** July 11, 2026  
**Repository:** `CodeEnigmatic/rebuilding-us-coaching`  
**Branch:** `main`  
**Latest commit:** `400401c` — `Add merch storefront and refine member experience`

## Project status

The project is now a React 19 + TypeScript + Vite website. It builds successfully with `npm run build`, is responsive for mobile layouts, and the committed working tree was clean after the latest GitHub push.

The site is currently a public brand and early-enrollment experience. It is **not yet** a live paid-member application: payment processing, authentication, protected Academy content, order fulfillment, coaching intake, and Discord automation still require backend integrations.

## Major changes completed today

### React migration and brand restructure

- Migrated the previous single-file TypeScript website from `src/main.ts` into React.
- Added `src/main.tsx` and `src/App.tsx`.
- Added reusable components, Academy data, and TypeScript models.
- Updated the page title to `AU-STELLAR LIFE | The Pursuit of Human Excellence`.
- Added a responsive sticky site header and smooth anchor navigation.

### Public website flow

The public page now presents content in this general order:

1. AU-STELLAR LIFE hero artwork
2. AU-STELLAR identity/meaning infographic
3. Vision statement
4. Individual framework infographic and invitation
5. Relationship framework infographic and invitation
6. Community framework infographic and invitation
7. Philosophy
8. Merchandise storefront
9. Rebuilding Us book section
10. Rebuilding Us YouTube section
11. Contact section
12. Academy membership-tier presentation

### Academy membership model

The membership structure was changed to cumulative access:

- **Tier 1 — Individual:** AU-STELLAR Individual only
- **Tier 2 — Relationship:** everything in Tier 1 plus AU-STELLAR Relationship
- **Tier 3 — Community:** everything in Tiers 1 and 2 plus AU-STELLAR Community

Public curriculum lessons were removed from the rendered app and from the active JavaScript dependency graph. Tier pricing is intentionally shown as **Pricing Coming Soon** until prices are decided.

The longer Academy curriculum still exists in `src/data/academy.ts`, but it is not currently imported by the public app. It should eventually move behind authenticated, server-enforced member access.

### Merchandise storefront

Added two shirts at **$30 each**:

- Life Is a Gym Tee
- AU-STELLAR LIFE Ethos Tee

Storefront behavior includes:

- Product imagery and descriptions
- Sizes S, M, L, XL, and 2XL
- Add-to-cart behavior
- Separate shirt/size variants
- Quantity increase and decrease controls
- Live subtotal calculation
- Mobile-responsive product and cart layouts
- Shipping/tax messaging

The checkout button is intentionally disabled as **Secure Checkout Coming Soon**. Card details must not be collected directly in the React client. A server-side Stripe Checkout integration is the recommended next step.

Current shirt economics discussed:

- Sale price: $30
- Estimated production cost: $20
- Gross difference before other expenses: $10
- Standard Stripe domestic-card fee at 2.9% + $0.30: about $1.17 on a $30 purchase
- Approximate remainder after production and Stripe: $8.83 before packaging, shipping, taxes, returns, or damage
- Recommendation: charge shipping separately at the initial $30 price

### YouTube restoration

Recovered the original YouTube information from Git history and restored:

- Navigation item: `Watch`
- Channel: `https://www.youtube.com/@Rebuilding.US.Project`
- Featured video: `https://www.youtube.com/embed/dGXy3vbmy5Y?si=OIVFS6cfGxwcgTJl`
- Responsive, lazy-loaded video embed

### Images and performance

Added and used these primary brand assets:

- `src/assets/aulogo.jpg`
- `src/assets/austellarlife.jpg`
- `src/assets/austellar-identity.jpg`
- `src/assets/austellar.individual.jpg`
- `src/assets/austellar.relationship.jpg`
- `src/assets/austellar.community.jpg`
- `src/assets/gymislife.jpg`
- `src/assets/austellarlife-ethos.jpg`

The six major website images were resized/compressed from approximately 2.7 MB to approximately 1.6 MB total, a reduction of about 41%. The two merch images were also optimized to roughly 205–240 KB each.

Images use responsive sizing and preserve their aspect ratios without cropping essential infographic content.

### Background and visual styling

- Replaced the previous site background with the AU Gold logo.
- Reduced the background logo size and prevented tiling.
- Background remains centered and fixed.
- Added responsive styles for category panels, Academy tiers, merch cards, cart controls, and YouTube content.

## Domain, hosting, and email decisions

Preferred primary domain:

- `austellarlife.com`

Optional defensive/redirect domain:

- `liveaustellarlife.com`

Both appeared unregistered during a Verisign RDAP check, but availability is not guaranteed until checkout completes.

Recommended infrastructure:

- **Registrar/DNS:** Cloudflare Registrar
- **Hosting:** Cloudflare Pages free plan
- **Source deployment:** GitHub `main` branch
- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Business email:** Google Workspace, with `hello@austellarlife.com` as the suggested primary address

Suggested future aliases:

- `academy@austellarlife.com`
- `coaching@austellarlife.com`
- `support@austellarlife.com`

Security recommendations include enabling authenticator/passkey two-factor authentication, saving recovery codes offline, enabling auto-renewal and transfer lock, using DNSSEC, and retaining an external personal email as the registrar recovery address.

## Known launch blockers and placeholders

- The public Contact link uses `Liveaustellarlife@gmail.com`; migrate it to a domain mailbox when business email is configured.
- Academy tier prices have not been decided.
- Academy enrollment buttons are disabled.
- Merch checkout is disabled.
- No payment processor is connected.
- No order database, inventory system, fulfillment workflow, confirmation email, refund policy, shipping policy, or return policy exists yet.
- No member authentication or authorization exists.
- Academy content is not yet delivered through a protected member app.
- No coaching intake/support-request workflow exists.
- No Discord server automation or paid-member role synchronization exists.
- The domain has not yet been purchased or connected.
- Cloudflare Pages has not yet been connected to the GitHub repository.

## Recommended next steps

1. Purchase `austellarlife.com`.
2. Create and secure the Cloudflare account.
3. Connect the GitHub repository to Cloudflare Pages.
4. Deploy with `npm run build` and output directory `dist`.
5. Attach `austellarlife.com` and redirect `www` to the primary domain.
6. Create the business email and replace the placeholder contact address.
7. Add shipping and return policies before accepting merchandise orders.
8. Create Stripe products for both $30 shirts and connect secure Checkout.
9. Add server-side order recording and Stripe webhook verification.
10. Decide Academy tier prices.
11. Add authentication, subscriptions, and protected Academy access using a backend such as Supabase plus Stripe.
12. Add coaching/support intake to member profiles.
13. Create the Discord server and automate tier-based roles through OAuth and a bot.

## Git history from today

- `86d4d05` — `Restructure site around AU-STELLAR academy vision`
- `400401c` — `Add merch storefront and refine member experience`

The latest pushed GitHub state includes the merch storefront, cumulative Academy tiers, optimized images, restored YouTube section, and responsive styling.
