# Technology Stack

**Analysis Date:** 2026-05-20

## Languages

**Primary:**
- TypeScript 5.x - All application source files under `src/`
- TSX (TypeScript + JSX) - React component files throughout `src/components/`, `src/app/`

**Secondary:**
- JavaScript - i18n dictionary files at `src/app/i18n/dictionaries/`
- CSS - Global styles at `src/app/globals.css`

## Runtime

**Environment:**
- Node.js v22.22.2

**Package Manager:**
- npm
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- Next.js 14.2.5 - Full-stack React framework; App Router with dynamic `[lang]` segment at `src/app/[lang]/`
- React 18.x - UI rendering
- React DOM 18.x - DOM bindings

**Styling:**
- Tailwind CSS 3.4.1 - Utility-first CSS; config at `tailwind.config.ts`; dark mode via `class` strategy
- PostCSS 8.x - CSS processing; config at `postcss.config.mjs`

**State Management:**
- Redux Toolkit 2.2.6 - Global state via slices at `src/lib/features/`
- React Redux 9.1.2 - React bindings; store provided via `src/app/StoreProvider.tsx`

**Animation:**
- Framer Motion 11.3.2 - UI animations and transitions

**Internationalization:**
- i18next 23.11.5 - Core i18n engine
- react-i18next 14.1.2 - React bindings; provider at `src/app/i18n/I18nProvider.tsx`
- accept-language 3.0.18 - Server-side locale detection in `src/middleware.ts`

**Email:**
- @react-email/components 0.0.21 - Email template components; template at `src/email/contact-form-email.tsx`
- Resend 3.4.0 - Email delivery API; invoked in `src/actions/sendEmail.ts`

**UI / Component Libraries:**
- react-icons 5.2.1 - Icon sets (FaBook, FaBriefcase, CgWorkAlt, etc.) used across components
- react-hot-toast 2.4.1 - Toast notifications; rendered via `<Toaster>` in layout
- react-multi-carousel 2.8.5 - Project image carousels at `src/components/Home/Projects/ImageCarousel.tsx`
- react-vertical-timeline-component 3.6.0 - Experience timeline at `src/components/Home/Experience/Timeline.tsx`
- react-intersection-observer 9.13.0 - Scroll-based section tracking in `src/lib/useSectionInView.ts`
- clsx 2.1.1 - Conditional class name utility
- axios 1.7.2 - HTTP client; used in `src/actions/verifyReCaptcha.ts` to call Google reCAPTCHA API

**Security:**
- react-google-recaptcha-v3 1.10.1 - Google reCAPTCHA v3 client; provider at `src/app/GReCaptchaProvider.tsx`

## Build / Dev Tools

- Next.js CLI (`next dev`, `next build`, `next start`, `next lint`) - All scripts in `package.json`
- TypeScript compiler (tsc via Next.js) - Config at `tsconfig.json`; strict mode enabled; path alias `@/*` → `./src/*`
- ESLint - Lint via `next lint` (Next.js built-in config)

## Key Dependencies Summary

| Package | Version | Purpose |
|---|---|---|
| `next` | 14.2.5 | Framework, routing, SSR/SSG, Server Actions |
| `react` / `react-dom` | ^18 | UI rendering |
| `@reduxjs/toolkit` + `react-redux` | 2.2.6 / 9.1.2 | Global state management |
| `framer-motion` | ^11.3.2 | Animations |
| `tailwindcss` | ^3.4.1 | Utility CSS |
| `i18next` + `react-i18next` | ^23 / ^14 | Multilingual support (en-us, zh-tw, zh-cn) |
| `resend` | ^3.4.0 | Transactional email sending |
| `@react-email/components` | ^0.0.21 | React-based email templates |
| `react-google-recaptcha-v3` | ^1.10.1 | Bot protection on contact form |
| `axios` | ^1.7.2 | HTTP client for reCAPTCHA verification |
| `react-multi-carousel` | ^2.8.5 | Project image carousels |
| `react-vertical-timeline-component` | ^3.6.0 | Work experience timeline |
| `react-intersection-observer` | ^9.13.0 | Scroll-based section activation |
| `react-hot-toast` | ^2.4.1 | Toast notifications |
| `react-icons` | ^5.2.1 | Icon library |
| `clsx` | ^2.1.1 | Conditional className helper |
| `accept-language` | ^3.0.18 | Server locale negotiation |

## Configuration

**Environment:**
- `.env.local` present at project root - contains `RESEND_API_KEY`, `GOOGLE_RECAPTCHA_SECRET`, `NEXT_PUBLIC_GOOGLE_RECAPTCHA_KEY`
- Runtime env vars accessed via `process.env.*` in server actions and provider components

**Build:**
- `next.config.mjs` - Allows remote images from `images.unsplash.com`
- `tsconfig.json` - Strict TypeScript, module resolution `bundler`, path alias `@/*`
- `tailwind.config.ts` - Dark mode via `class`, scoped to `src/` tree
- `postcss.config.mjs` - Tailwind CSS plugin only

## Platform Requirements

**Development:**
- Node.js v22+ (confirmed runtime version)
- npm for dependency management

**Production:**
- Compatible with any Node.js hosting platform (Vercel recommended by Next.js defaults)
- Requires environment variables: `RESEND_API_KEY`, `GOOGLE_RECAPTCHA_SECRET`, `NEXT_PUBLIC_GOOGLE_RECAPTCHA_KEY`

---

*Stack analysis: 2026-05-20*
