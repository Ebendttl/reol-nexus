# REOL GLOBAL — Public Storefront
### Phase 2 Build Prompt for Antigravity: turning REOL Nexus into a full front-of-house + back-of-house platform

---

## 0. What you've got vs. what's missing

What's already built (visible in your screenshots) is the **back office**: the ledger, budgets, reports — REOL the owner's private command center. That's correctly gated behind login and should stay that way.

What's missing is the **front of house**: the actual public website a customer in Lagos finds on Google, scrolls through on their phone, and uses to decide "yes, I want REOL to cater my wedding / do my dry cleaning / take my Sunday lunch order." That site needs zero login, needs to look genuinely premium, and needs to convert browsers into enquiries/bookings.

You don't need two separate codebases for this — you need **one Next.js app with two distinct "faces"**: a public marketing face at the root domain, and the private dashboard tucked under `/dashboard`, both reading from the same Supabase backend. This keeps your data model unified (the event packages a customer browses publicly are the same `event_bookings`-adjacent data the Event Center manager works with privately) while keeping the visual language, navigation, and access rules completely separate.

---

## 1. Site Architecture

```
reol-nexus (same repo, same Next.js app)
│
├── (marketing) route group — PUBLIC, no auth, SEO-indexed
│   ├── /                     Homepage — hero, the 3 (soon 4+) business units, social proof
│   ├── /event-center          Hall types, packages, gallery, T&Cs, enquiry form
│   ├── /event-center/[slug]   Individual package/hall detail page
│   ├── /eatery                 Menu by category, signature dishes, gallery
│   ├── /laundry                Services & pricing tiers, turnaround times, deals
│   ├── /about                  The REOL story, the building, the brand
│   ├── /contact                Location/map, phone, WhatsApp CTA, contact form
│   └── /coming-soon            "What's next at REOL" — future business units teaser
│
├── (dashboard) route group — PRIVATE, auth-gated, what's already built
│   ├── /dashboard/overview
│   ├── /dashboard/record-data
│   ├── /dashboard/budgets
│   └── /dashboard/reports
│
└── (auth)
    └── /login                  Shared login, only dashboard routes require it
```

**Critical architectural decision:** the public pages are NOT static/hardcoded marketing copy that only a developer can update. They pull from new Supabase tables (`public_services`, `event_packages`, `menu_items` — already partially scaffolded, `laundry_services`, `testimonials`, `gallery_images`) so that, in a later phase, REOL or his staff can update the menu, add a new laundry deal, or publish a new event package from a simple admin CMS screen — without you touching code. This is what separates a real product from a one-off brochure site.

---

## 2. Design Direction — what "award-winning" looks like here

You asked me to take cues from popular African and global sites in these categories. Here's the synthesis to hand Antigravity, calibrated for a premium Lagos multi-service brand:

- **Hospitality/event energy** (think Eko Hotels & Suites, Transcorp Hilton, Terra Kulture, and globally Cvent/Bizzabo's event-imagery-led layouts): big, warm, full-bleed photography of the hall in use — lit, decorated, full of people — not stock-photo sterility. Bold serif or confident display typography for headlines paired with a clean sans-serif body.
- **Food/eatery energy** (think Jumia Food's category grid, ChopLife, and global fine-casual sites like Sweetgreen): mouth-watering dish photography in a clean grid, warm earthy accent tones for food categories, clear pricing in Naira, dietary/spice tags.
- **Laundry/service energy** (think Wash.ng, Diaspora-laundry-style apps, and global Cleanly/Rinse): crisp, trustworthy, almost clinical-clean visual language — lots of white space, clear turnaround-time badges, simple "drop off → we clean → pick up" iconography, transparent pricing tiers.
- **Unifying brand thread across all three:** REOL's own identity (the deep forest green / charcoal / warm gold palette already established in the dashboard) should reappear here as the "spine" connecting three visually distinct sub-brands, so a visitor always knows they're on a REOL property even as they move from Eatery to Laundry to Event Center. Each business unit gets its own accent color (already established: gold/amber for Event Center, a warm terracotta/red for Eatery, a cool blue for Laundry — consistent with the dashboard cards in your screenshots) layered on top of the shared REOL base identity.
- **Motion & polish:** subtle scroll-reveal animations, smooth image hover states on cards, a sticky/transparent-to-solid header on scroll, micro-interactions on CTA buttons — the kind of restrained motion that signals quality without feeling gimmicky.
- **Mobile-first, since this is where the actual customer decision happens:** thumb-friendly sticky "Enquire/Book Now" or "Order/Call" CTA on every page, WhatsApp-first contact pattern (extremely common and expected in the Nigerian market — a floating WhatsApp button is almost mandatory, not optional).

---

## 3. Page-by-Page Content Requirements

### Homepage
- Full-bleed hero (rotating or single striking image/video of the property) with a one-line brand promise and a primary CTA.
- "Three roofs, one address" section: three large visual cards (Event Center / Eatery / Laundry), each linking deeper, each with its own accent color and a one-line hook.
- Social proof: testimonials/reviews carousel, "as seen at" or notable past events strip if applicable.
- "Coming Soon" teaser strip near the footer hinting at future services (see Section 5).
- Footer: address/map embed, phone, WhatsApp, social links, opening hours.

### Event Center page
- Hero with the hall(s) in their best light.
- Hall/space types as cards (capacity, ideal use — wedding, corporate, birthday, conference), pulling from `event_packages`.
- Package tiers with what's included (decor level, catering options, duration, etc.) and starting prices or "request a quote."
- A clearly laid-out **Terms & Conditions** section (deposit policy, cancellation policy, what's included/excluded, damage policy) — collapsible/accordion style so it's available but not overwhelming.
- Gallery (past events, styled shoots).
- Enquiry form (date, event type, estimated guests, contact info) that writes to a `public_enquiries` table the Admin dashboard can later surface as a "Leads" tab.

### Eatery page
- Hero with signature dish photography.
- Menu organized by category (Starters, Mains, Drinks, Desserts, Specials) pulling from `menu_items`, each with name, short description, price, and a dietary/spice tag where relevant.
- "Today's Special" or chef's recommendation highlight block.
- Reservation/order-ahead CTA (can start as a WhatsApp/phone CTA in MVP, with a placeholder for full online ordering later).

### Laundry page
- Hero communicating speed/trust/cleanliness.
- Services as clear pricing tiers (Wash & Fold, Dry Cleaning, Express/Same-Day, Bulk/Corporate) pulling from `laundry_services`, with turnaround time badges.
- Simple 3-step "How it works" (Drop off / We clean / Pick up or Deliver) iconography section.
- Current deals/promos block (e.g., "First wash 20% off").
- Pickup/delivery enquiry form.

### Coming Soon page + homepage teaser
- A visually exciting "What's next at REOL" section/page with locked/blurred or illustrated placeholder cards for future business units (Shortlet rooms, Car Wash, Mini-mart, etc.), each with a "Notify me" email capture — turning the act of expansion itself into a marketing/anticipation moment rather than hiding it.

### About + Contact
- About: REOL's story, the building, the philosophy of "everything under one roof."
- Contact: embedded map, click-to-call, click-to-WhatsApp, a general enquiry form, opening hours per business unit (since Eatery/Laundry/Event Center may have different hours).

---

## 4. New Supabase Tables Needed (additive to the existing schema)

```
public_services        -- generic service/offering rows usable by any unit
  id, business_unit_id, title, description, image_url, price_label,
  is_featured, display_order, is_active

event_packages
  id, business_unit_id, name, hall_name, capacity, price_from,
  description, inclusions (jsonb array), image_url, display_order, is_active

event_terms
  id, business_unit_id, title, content, display_order

menu_items                -- extend the existing table from the dashboard schema
  + description, image_url, dietary_tags (jsonb), is_featured, display_order

laundry_services
  id, business_unit_id, name, description, turnaround_time, price_from,
  image_url, display_order, is_active

deals_promotions
  id, business_unit_id, title, description, discount_label,
  valid_from, valid_until, is_active

testimonials
  id, business_unit_id (nullable = general), author_name, content,
  rating, image_url, is_featured

gallery_images
  id, business_unit_id, image_url, caption, display_order

coming_soon_units
  id, name, description, icon, expected_launch_label, display_order

public_enquiries          -- captures ALL public form submissions (event/eatery/laundry/contact/coming-soon)
  id, business_unit_id (nullable), type (event_enquiry|laundry_pickup|eatery_order|contact|notify_me),
  full_name, phone, email, message, metadata (jsonb), status (new|contacted|converted|closed), created_at
```

`public_enquiries` is the bridge between the public site and the private dashboard — it should surface as a new "Leads" tab inside the existing Admin dashboard so every enquiry from the public website lands directly in front of the business owner or the relevant unit manager, closing the loop between marketing and operations.

---

## 5. THE ANTIGRAVITY IDE PROMPT (paste this in as the next instruction)

```
You are continuing work on the REOL Nexus codebase (the private business dashboard for REOL GLOBAL
SOLUTIONS LIMITED is already built under a dashboard route). Now build out the PUBLIC-FACING
marketing website for the same brand, in the same Next.js app, completely separate in look, feel,
and access rules from the private dashboard.

GOAL: An award-winning, mobile-first public website that makes a first-time visitor in Lagos
immediately understand and want to use REOL's three services — the Event Center, the Eatery, and
the Laundry — all operating under one address/brand, with a visible "more coming soon" growth
story. This site must require NO login, must be SEO-indexable, and must feel like three confident,
visually distinct sub-brands unified by one premium parent identity.

=== ARCHITECTURE ===
Use Next.js route groups to cleanly separate concerns within the existing app:
- A `(marketing)` route group for all public pages: `/`, `/event-center`, `/event-center/[slug]`,
  `/eatery`, `/laundry`, `/about`, `/contact`, `/coming-soon`. No auth required, fully SEO-optimized
  (proper metadata, Open Graph tags, sitemap.xml, robots.txt).
- Keep the existing `(dashboard)` route group exactly as-is, still auth-gated.
- Public pages must NOT share layout/navigation/header-footer components with the dashboard —
  they need their own distinct marketing layout, header, and footer.
- All public content (event packages, menu items, laundry services, deals, testimonials, gallery
  images, coming-soon teasers) must be data-driven from new Supabase tables, NOT hardcoded in
  JSX, so the content can eventually be managed from an admin CMS screen without code changes.
  Implement the following additive tables with RLS allowing public anonymous SELECT on active/
  published rows only, and restricted INSERT/UPDATE/DELETE to authenticated Admin/Unit Manager
  roles: public_services, event_packages, event_terms, an extended menu_items (add description,
  image_url, dietary_tags, is_featured, display_order), laundry_services, deals_promotions,
  testimonials, gallery_images, coming_soon_units, and a public_enquiries table that captures
  every form submission across the site (event enquiry, laundry pickup request, eatery order
  interest, general contact, "notify me" for coming-soon services) with a status pipeline
  (new/contacted/converted/closed) so it can later surface as a "Leads" tab inside the existing
  Admin dashboard.

=== DESIGN DIRECTION (this is the differentiator — take this seriously) ===
Reference points to channel (do not copy any specific site's exact layout or assets — synthesize
the FEEL): premium Nigerian/African hospitality sites like Eko Hotels & Suites and Transcorp
Hilton for warm, photography-led event/hospitality energy; African food-delivery/restaurant sites
like Jumia Food for clean, appetite-driving menu grids; and laundry-service apps like Wash.ng or
global equivalents like Rinse for crisp, trustworthy, transparent-pricing service pages.

Unifying brand: a confident parent identity in deep forest green, charcoal, and warm gold (matching
the already-established dashboard palette) acts as the spine across the whole site. Each business
unit then gets its own accent layered on top, consistent with the existing dashboard's unit colors:
warm gold/amber for Event Center, a warm terracotta/red for Eatery, a cool blue for Laundry — so a
visitor instantly orients to which "room of the house" they're in while always feeling it's one
REOL property.

Typography: a confident display/serif typeface for headlines paired with a clean modern sans-serif
for body copy — this should read premium and editorial, not like a generic SaaS template.

Imagery: large, full-bleed, high-quality photography-led sections (use tasteful, realistic
placeholder imagery for now where real photography isn't available) — halls in full use, food
close-ups, clean folded-laundry visuals — never generic stock-photo sterility.

Motion: subtle scroll-reveal animations on section entry, smooth hover states on cards (image
zoom/lift), a header that transitions from transparent-over-hero to solid-on-scroll, restrained
and tasteful micro-interactions on buttons/CTAs — polish without gimmickry.

Mobile-first non-negotiables: a persistent, thumb-reachable primary CTA on every page (varies by
page: "Enquire Now" on Event Center, "View Menu" / "Order via WhatsApp" on Eatery, "Schedule
Pickup" on Laundry); a floating WhatsApp contact button site-wide, since WhatsApp-first contact
is the dominant and expected pattern for this market in Nigeria; fast page loads (optimize all
images via next/image, lazy-load below-the-fold sections).

=== PAGES & CONTENT TO BUILD ===
1. Homepage: full-bleed hero with brand promise and primary CTA; a "three roofs, one address"
   section presenting Event Center / Eatery / Laundry as three large visually distinct cards
   linking to their respective pages; a testimonials carousel; a "Coming Soon" teaser strip near
   the footer; a footer with embedded map/location, phone, WhatsApp link, social links, and
   per-business-unit opening hours.
2. Event Center page (`/event-center`): hero imagery; hall/space type cards (capacity, ideal use
   case) and package tiers (inclusions, starting price or "request a quote") pulled from
   event_packages; a clearly laid out, accordion-style Terms & Conditions section (deposit policy,
   cancellation policy, inclusions/exclusions, damage policy) pulled from event_terms; a gallery
   grid; an enquiry form (event date, event type, estimated guest count, contact details) that
   writes to public_enquiries with type='event_enquiry'.
3. Optional event_packages detail page (`/event-center/[slug]`) for a single package/hall with
   richer description and gallery.
4. Eatery page (`/eatery`): hero with signature dish photography; menu grid organized by category
   (Starters, Mains, Drinks, Desserts, Specials) pulled from menu_items, each item showing name,
   short description, price in Naira, and dietary/spice tags where present; a "Today's Special"
   highlight block; an order/reservation CTA (WhatsApp/phone link for MVP).
5. Laundry page (`/laundry`): hero communicating speed and trust; service pricing tiers (Wash &
   Fold, Dry Cleaning, Express/Same-Day, Bulk/Corporate) pulled from laundry_services with
   turnaround-time badges; a simple 3-step "How it works" iconography section (Drop off → We
   clean → Pick up/Deliver); an active deals/promos block from deals_promotions; a pickup/
   delivery request form writing to public_enquiries with type='laundry_pickup'.
6. Coming Soon page (`/coming-soon`) plus homepage teaser strip: visually engaging cards for
   future business units pulled from coming_soon_units (e.g., Shortlet rooms, Car Wash,
   Mini-mart), each with an email-capture "Notify me" form writing to public_enquiries with
   type='notify_me' — frame growth as anticipation-building marketing, not an apology for what's
   missing.
7. About page (`/about`): the REOL story, the building, the "everything under one roof" philosophy.
8. Contact page (`/contact`): embedded map, click-to-call, click-to-WhatsApp, a general enquiry
   form (type='contact'), and per-unit opening hours.

=== NON-FUNCTIONAL REQUIREMENTS ===
- Full SEO setup: per-page metadata (title, description, Open Graph image), sitemap.xml,
  robots.txt, semantic HTML, accessible alt text on all imagery.
- Performance: target a Lighthouse performance score of 90+ on mobile; lazy-load images and
  below-the-fold sections; use next/image throughout.
- Accessibility: proper heading hierarchy, sufficient color contrast even with the accent colors,
  keyboard-navigable forms and menus.
- All public forms must validate client-side (React Hook Form + Zod, consistent with the existing
  dashboard's form patterns) and write cleanly into public_enquiries with the correct `type` and
  `business_unit_id`, so every submission is immediately actionable from the (future) Admin
  "Leads" view.
- The public site and the private dashboard must visually and structurally feel like two different
  experiences of the same trustworthy brand — a visitor moving from the homepage to attempting
  `/dashboard` should hit the existing auth gate with no public content leaking through.

=== DELIVERABLE FOR THIS SESSION ===
First scaffold the new Supabase tables and RLS policies described above as versioned migrations,
seed a handful of realistic placeholder rows for each table (a few event packages, menu items,
laundry services, testimonials, and coming-soon units) so the site has real-looking content to
render against, then build the (marketing) route group starting with the shared marketing layout
(header/footer/WhatsApp button), the Homepage, and the Event Center page fully working end-to-end,
before moving on to Eatery, Laundry, Coming Soon, About, and Contact in that order. Confirm the
new schema and the homepage's visual direction with me before proceeding to the remaining pages.
```

---

## 6. A Few Calls Worth Flagging

- **One app, two faces — not two repos.** Splitting the public site into a separate project would mean duplicating brand tokens, duplicating the Supabase client, and eventually drifting out of sync. Route groups inside the same Next.js app keep one source of truth while still letting the two experiences look and behave completely differently.
- **Content lives in the database, not in JSX.** It's tempting to hardcode the menu and event packages directly into React components for speed — resist this. The moment REOL wants to add a new dish or laundry deal, you don't want to be the bottleneck; data-driven content is what makes this maintainable past month one.
- **`public_enquiries` is the quiet hero of this whole addition.** Without it, the public site is just a brochure. With it, every WhatsApp-avoiding visitor who fills out a form becomes a tracked lead the business owner can see and act on inside the same dashboard he already checks daily — turning the marketing site into a genuine extension of the operations platform, not a bolt-on.
