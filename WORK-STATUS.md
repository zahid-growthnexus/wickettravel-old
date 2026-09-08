# Wicket Travel — Work Status (2026-09-08)

Snapshot of everything done in this working session, for handoff before a
usage-limit pause. Everything below is committed to `main` in this repo.

## ✅ Done

**Five new pages, all real and functional, not mockups:**
- `/flights` — popular routes, cabin comparison, FAQ, the same real
  `FlightSearch` widget the homepage uses (hands off to the real booking
  portal). Hero rebuilt today to match the site's photo-hero pattern (was a
  flat text-only banner).
- `/hotels`, `/car-rentals` — honest "in partnership with Wicket Travel
  Holidays" showcase pages; the example search panels are clearly labeled
  as examples, with a real link out to the sister brand for the actual
  booking.
- `/visa` — the real Dubai/UAE visa enquiry form (not a copy — the same
  component `VisaBanner`'s homepage modal uses), inline on its own page
  with supporting content. Verified live against the real
  `/api/visa-enquiry` backend today (test submission returned a real
  reference number).
- `/parents-tickets` — revived the "community board" feature that had been
  quietly retired in favor of a phone-only CTA. Real dual-role (family /
  helper) form and a real live public feed, both wired to the existing
  `/api/parent-ticket` backend. **Important finding, not yet acted on:**
  the real backend publishes more than originally assumed — exact date,
  airline, and a shortened real name, not just a rough timeframe. The page
  copy now accurately describes what's actually public; whether the
  upstream anonymization itself should change is a decision for whoever
  owns that portal.

**Site-wide polish pass** (homepage, About, Contact): trimmed decorative
motion (kept the airline-logo marquee and functional transitions), removed
gradients that violated the project's own `PRODUCT.md` rules, self-hosted
40+ previously-hotlinked images, fixed a real hero/search-widget alignment
bug (confirmed by pixel measurement, not guessing).

**Navigation**: `Header.tsx` and `Footer.tsx` both fully repointed —
Flights/Hotels/Car Rental/Dubai Visa/Parents Tickets all link to their real
pages now, not homepage anchors or external redirects.

**SEO**: `Service` schema added to all 5 new pages, linked to the
homepage's `Organization` node. Fixed a real bug where every interior
page's social card (`og:image`, Twitter card) was silently broken because
Next.js merges `metadata` shallowly. Sitemap and robots.txt updated.

**Performance**: two oversized hero photos re-compressed (~50%/~28%
smaller, no visible quality loss), a wrong `sizes` attribute fixed, an
unnecessary image preload removed, a dead DNS-prefetch hint removed.

**Accessibility**: a real WCAG contrast failure fixed at the token level
(`text-on-sand`, was 3.95:1, now 4.89:1+), placeholder text contrast fixed
site-wide, one under-sized (40px) tap target corrected to 44px.

**Verified today, specifically per this handoff's request** — every
form/search widget still functions exactly as before all this work:
`FlightSearch`'s handoff to the real booking portal (code unchanged),
the real Visa enquiry form (live test: `#VQ-1079`, HTTP 201), the real
Parents Tickets live board (rendering real entries), the homepage's Visa
modal (still opens correctly with the shared form component), and the
Contact page form (present, correct field count).

Full production build passes clean (23/23 routes), zero ESLint errors.

## ⏳ Pending (known, not done)

- **Deals** has no dedicated page — nav still points to the homepage's
  `#deals` section. Not requested this round.
- **One hotlinked Unsplash image remains**, on `/about` (flagged by the SEO
  pass, deliberately left alone since `/about` wasn't in that pass's
  scope) — `next.config.ts`'s `remotePatterns` entry for `images.unsplash.com`
  still exists because of it.
- **`CallUsBand` and `ParentsBanner`** (homepage sections) sit back-to-back
  with near-identical structure and the same phone CTA. Fixing this
  properly means either reordering sections or adding real content —
  deliberately not done without your input, since inventing content to
  fill the gap isn't a call to make unilaterally.
- **The "darker navy" preference** the client mentioned early on was never
  pinned down to a concrete shade/reference — the site still uses this
  codebase's own original navy/orange tokens, unchanged.
- **Footer placeholder links** (Travel guides, How it works, Partners,
  Careers, Press, Help center, Manage booking, FAQs) are still `#` stubs —
  no pages exist for these yet.

## 💡 Recommended next

1. **Review everything live** — this is the natural next step before more
   work piles up unreviewed.
2. **Decide the Deals page** — dedicated page (matching the other 5) or
   leave as a homepage section.
3. **Real airline/rental-brand logo marks** — the airline wall and the
   car-rental partner wall both use typeset names, not logos, since no
   licensed marks have been supplied. This is a genuine trademark-risk
   blocker, not a design choice.
4. **Resolve the Parents Tickets privacy finding** above — worth a decision
   from whoever owns the upstream portal.
5. **`CallUsBand`/`ParentsBanner` differentiation** — needs a content
   decision, not a design guess.
6. A deeper performance pass exists as a lever if wanted later:
   `framer-motion` is pulled into every page via the shared motion
   primitives — a deliberate architectural choice, not a bug, but the
   single biggest shared JS cost on the site if it's ever worth revisiting.
