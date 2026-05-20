# External Integrations

**Analysis Date:** 2026-05-20

## APIs & External Services

**Email Delivery:**
- Resend - Sends contact form submissions as transactional emails
  - SDK/Client: `resend` ^3.4.0
  - Auth: `RESEND_API_KEY` (server-side env var)
  - Implementation: `src/actions/sendEmail.ts` (Next.js Server Action)
  - Sender address: `onboarding@resend.dev` (Resend's onboarding domain)
  - Recipient: hardcoded to `keiko15678@gmail.com` via `src/lib/consts.ts`

**Bot Protection:**
- Google reCAPTCHA v3 - Protects contact form from automated submissions
  - Client SDK: `react-google-recaptcha-v3` ^1.10.1
  - Client key env var: `NEXT_PUBLIC_GOOGLE_RECAPTCHA_KEY` (public, exposed to browser)
  - Secret key env var: `GOOGLE_RECAPTCHA_SECRET` (server-side only)
  - Client provider: `src/app/GReCaptchaProvider.tsx` (wraps entire app in layout)
  - Server verification: `src/actions/verifyReCaptcha.ts` — posts to `https://www.google.com/recaptcha/api/siteverify`
  - Threshold: score > 0.5 required to pass verification

**Image CDN:**
- Unsplash - External image hosting allowed via Next.js remote pattern
  - Hostname: `images.unsplash.com`
  - Configured in: `next.config.mjs` under `images.remotePatterns`

## Data Storage

**Databases:**
- None - No database integration detected

**File Storage:**
- Local filesystem - Project/portfolio images served from `public/images/`
- No cloud file storage (S3, Cloudinary, etc.) detected

**Caching:**
- None - No external cache layer detected; relies on Next.js built-in caching

## Authentication & Identity

**Auth Provider:**
- None - No user authentication system (no NextAuth, Clerk, Supabase Auth, etc.)
- The site is a public-facing portfolio with no login flows

## Fonts

**Google Fonts:**
- Inter (via `next/font/google`) - Loaded in `src/app/[lang]/layout.tsx`
- Subset: `latin`
- Served through Next.js font optimization (no external network request at runtime)

## Monitoring & Observability

**Error Tracking:**
- None detected - No Sentry, Datadog, or similar error tracking

**Analytics:**
- None detected - No Google Analytics, Plausible, or similar

**Logs:**
- Console-based only; no structured logging service

## Internationalization

**Locale Detection:**
- Server-side: `accept-language` header parsing in `src/middleware.ts`
- Cookie-based persistence: `lang` cookie set by middleware
- Supported locales: `en-us`, `zh-tw` (default), `zh-cn`
- Dictionary files: `src/app/i18n/dictionaries/en-us.js`, `zh-tw.js`, `zh-cn.js`

## CI/CD & Deployment

**Hosting:**
- Not explicitly configured - no `vercel.json`, `netlify.toml`, or Dockerfile detected
- Compatible with Vercel (Next.js 14 App Router project)

**CI Pipeline:**
- None detected - no `.github/workflows/`, CircleCI, or similar config

## Webhooks & Callbacks

**Incoming:**
- None detected

**Outgoing:**
- None detected

## Environment Configuration

**Required env vars:**

| Variable | Side | Purpose |
|---|---|---|
| `RESEND_API_KEY` | Server | Authenticate with Resend email API |
| `GOOGLE_RECAPTCHA_SECRET` | Server | Verify reCAPTCHA tokens server-side |
| `NEXT_PUBLIC_GOOGLE_RECAPTCHA_KEY` | Client | Initialize reCAPTCHA widget in browser |

**Secrets location:**
- `.env.local` at project root (gitignored; not read for security)

---

*Integration audit: 2026-05-20*
