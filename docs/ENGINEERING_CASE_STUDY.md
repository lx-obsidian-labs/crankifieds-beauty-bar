# Engineering case study — Crankified's Beauty Bar

## Product problem

A boutique studio needs an online presence that communicates premium service while coordinating appointments, customer enquiries and small retail order requests. A static brochure alone cannot address booking conflicts or back-office workflows.

## Solution architecture

- **Frontend:** Next.js 16 App Router, React 19, Tailwind CSS 4.
- **Data:** Postgres through the Neon serverless driver; a git-ignored local JSON fallback is documented for development.
- **Booking:** Service, add-ons, time selection and customer details, with studio confirmation rather than immediate online payment.
- **Operations:** Admin-facing views for appointments, orders, referrals and enquiries.
- **Content:** Typed service, product and studio configuration files to keep the initial release editable without a CMS.

## Engineering decisions

1. **Request-based bookings:** The studio remains responsible for confirming requests; the interface must not imply that an unconfirmed slot is guaranteed.
2. **Single source for business rules:** Opening hours, booking horizon, notice and buffer periods are configured in `src/lib/site.ts`.
3. **No invented contact channels:** Unconfirmed phone, WhatsApp and social details remain blank, and links should be hidden until verified.
4. **Release gates:** GitHub Actions runs dependency installation, type checking, linting and a production build.

## Architecture sketch

```text
Visitor (Next.js pages)
  |-- Services / editorial homepage
  |-- Booking request --------> booking validation / persistence
  |-- Vault order request ----> order persistence
  |-- Contact / referrals ----> enquiry persistence
                                  |
                                  +--> Postgres (production)
                                  +--> JSON fallback (local development)
Studio administrator ------------> management interface
```

## Verification and limitations

The repository declares `npm run typecheck`, `npm run lint` and `npm run build`. Their presence and the CI workflow do **not** establish passing results; inspect Actions for evidence.

Before production acceptance, verify simultaneous booking submissions, authentication/session handling, data retention and privacy notices, accessibility, responsive layouts, and actual notification delivery. The studio's contact details, pricing, testimonials and product claims require owner approval. Stock images are placeholders.

## Portfolio evidence to capture

- Desktop and mobile screenshots with dates and viewport sizes.
- Successful CI run URLs and build logs.
- Booking conflict test showing a rejected overlapping appointment.
- Admin authorization tests, including unauthorized access attempts.
- Owner-approved copy and a documented production deployment.

This case study describes the codebase and intended system behavior; it does not claim unverified commercial results.
