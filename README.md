# Crankified's Beauty Bar

**Development stage:** Active Development — functionality exists, but release readiness is not independently verified.  
**Verification:** Typecheck, lint and build gates configured in GitHub Actions; successful runs are not yet confirmed.  
**Next milestone:** Verify the PostgreSQL exclusion constraint against concurrent booking requests and existing data, add admin authorization tests, and verify mobile and accessibility behavior. Database-level overlap prevention is implemented but has not yet been independently integration-tested.

Project maturity is not a quality rating. Planned features are excluded from defect counts; implemented behavior and security are assessed against evidence. [Evaluation rubric](https://github.com/lx-obsidian-labs/lx-obsidian-labs/blob/main/PORTFOLIO_EVALUATION.md).

A premium, appointment-led website for Crankified's Beauty Bar in Ermelo:
hair, lashes and nails, plus a small vault of brand-new and pre-owned iPhones,
sneakers and accessories.

Built with Next.js 16 (App Router), React 19, Tailwind CSS 4 and Postgres
(Neon serverless driver). Deploys to Vercel.

## What is included

- **Marketing site** — home, service menu with prices, studio story, referral
  programme, FAQ and policies.
- **Booking** — a four-step flow (service → extras → date/time → details) with
  real availability: opening hours, Sundays closed, 60-day horizon, two-hour
  minimum notice, 15-minute buffer and double-booking protection. Nothing is
  charged online; every booking is a request the studio confirms.
- **Appointment pages** — a shareable `/appointment/REF` page and an `.ics`
  download for the client's calendar.
- **The Vault** — filterable product catalogue with condition grades, variants
  (storage, size) and an order-request drawer. Orders take 1–3 days.
- **Referrals** — claim form for three completed referrals, with a choice of
  three complimentary services.
- **Studio desk** — passcode-protected `/admin` for appointments, orders,
  referral claims and contact messages, with status actions.
- **Contact form** — stored in the database so the site works even before phone
  and WhatsApp details are published.

## Engineering evidence

- [Architecture and limitations](docs/ENGINEERING_CASE_STUDY.md)
- [CI verification workflow](.github/workflows/verify.yml)
- [Booking configuration](src/lib/site.ts)

## Local development

```bash
npm install
cp .env.example .env.local   # then edit values
npm run dev
```

Open http://localhost:3000. The owner desk is at `/admin`.

Without `DATABASE_URL`, local development writes to `.data/store.json` (git-ignored). In Vercel/AWS Lambda environments, database operations now fail closed when `DATABASE_URL` is missing rather than acknowledging temporary storage as durable. Configure and verify a persistent database before deploying.

```bash
npm run typecheck
npm run lint
npm run build
```

## Editing content

All copy lives in typed data files — no CMS login required:

| File | What it controls |
| --- | --- |
| `src/lib/site.ts` | **Contact details**, hours, policies, booking rules, delivery note |
| `src/lib/services.ts` | Service menu, prices, durations, add-ons, referral rewards |
| `src/lib/products.ts` | Vault catalogue, conditions, variants and prices |
| `src/lib/images.ts` | Photography URLs (replace with the studio's own shoot) |
| `src/app/page.tsx` | Home page sections and testimonials |

### Contact details

`phone`, `whatsapp`, `email`, `instagram` and `tiktok` are blank in
`src/lib/site.ts` on purpose. Empty values hide those links rather than point
them somewhere wrong. Add a number in international format without spaces
(`+27821234567`) and the WhatsApp buttons appear across the site.

### Booking rules

In `src/lib/site.ts` → `booking`:

- `horizonDays` — how far ahead clients can book (default 60)
- `minimumNoticeMinutes` — same-day notice (default 120)
- `bufferMinutes` — reset time between clients (default 15)
- `slotStepMinutes` — appointment start grid (default 30)

Opening hours are the `hours` array below it. Set `open`/`close` to `null` to
close a day.

## Database

Any Postgres works. Create a Neon project, copy the connection string into
`DATABASE_URL`, and the tables (`bookings`, `orders`, `referrals`, `inquiries`)
are created automatically on first write.

```bash
vercel env add DATABASE_URL production
vercel env add ADMIN_PASSCODE production
vercel env add ADMIN_SESSION_SECRET production
```

## Deploying

```bash
vercel link
vercel env add DATABASE_URL production
vercel env add ADMIN_PASSCODE production
vercel --prod
```

A strong passcode can be generated with:

```bash
node -e "console.log(require('crypto').randomBytes(24).toString('base64url'))"
```

Generate a **separate** session signing secret (do not reuse the passcode):

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

Set the generated value as `ADMIN_SESSION_SECRET` in every environment that serves administrator logins. Missing or short secrets disable administrator authentication; rotating the secret invalidates existing sessions. Do not commit credentials or signing secrets. The process-local login limiter is not sufficient for multi-instance production deployments; configure a shared or edge rate limiter before public launch. Verify authentication and booking concurrency against the deployed service.

## Notes

- Photography is interim stock imagery from Unsplash, chosen to hold the art
  direction until the studio's own shoot is available. Swap URLs in
  `src/lib/images.ts`.
- Testimonials on the home page are placeholders and should be replaced with
  verified client reviews.
- Prices, policies and referral rules are set as a sensible starting point and
  should be confirmed by the owner.
