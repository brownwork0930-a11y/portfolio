# Architecture

**Analysis Date:** 2026-05-20

## Pattern Overview

**Overall:** Next.js 14 App Router — single-page portfolio with server-side i18n routing

**Key Characteristics:**
- One URL-routed page (`/[lang]`) renders all portfolio sections as a long-scroll SPA
- Server Components fetch locale data at the layout and page level; Client Components own interactivity
- State is split across three layers: Redux (global UI), React Context (theme + active section), and server-fetched data props
- No API routes — external side-effects (email, reCAPTCHA) are handled via Next.js Server Actions

## Layers

**Routing & Middleware:**
- Purpose: Detect browser locale, redirect bare paths to `/{lang}/`, persist lang cookie
- Location: `src/middleware.ts`
- Contains: `middleware()` function, `accept-language` locale resolution
- Depends on: `src/app/i18n/index.ts` (language list and defaults)
- Used by: Next.js edge runtime on every non-asset request

**App Shell (Server Components):**
- Purpose: Server-render layout, fetch dictionary and nav data, inject providers
- Location: `src/app/[lang]/layout.tsx`, `src/app/[lang]/page.tsx`
- Contains: Root HTML structure, provider tree, section composition
- Depends on: `src/lib/useData.tsx` (data factory), `src/app/i18n/dictionaries/` (translations)
- Used by: All page renders under `/[lang]`

**Provider Tree (Client Components wrapping server shell):**
- Purpose: Bridge server-rendered shell to client-side state and third-party SDKs
- Location: `src/app/GReCaptchaProvider.tsx`, `src/app/StoreProvider.tsx`, `src/app/i18n/I18nProvider.tsx`
- Contains: Redux `<Provider>`, `<GoogleReCaptchaProvider>`, react-i18next init
- Depends on: `src/lib/store.ts`
- Used by: `src/app/[lang]/layout.tsx`

**Context Layer:**
- Purpose: Cross-component reactive state that doesn't warrant Redux
- Location: `src/context/`
- Contains: `active-section-context.tsx` (scroll-tracked active nav item), `theme-context.tsx` (light/dark + localStorage), `route-params-content.tsx` (pass server params to deep client components)
- Depends on: React `createContext` / `useState`
- Used by: Header, SideScroller, section components, Intro

**Redux Store:**
- Purpose: UI state that multiple sibling components read/write
- Location: `src/lib/store.ts`, `src/lib/features/`
- Contains: `globalSlice` (sidebar open/close + body scroll lock), `projectSlice` (image modal visibility, image list, initial slide index)
- Depends on: `@reduxjs/toolkit`
- Used by: Header, Sidebar, Project, Projects

**Section Components (Client Components):**
- Purpose: Render each portfolio section, register with `useSectionInView`
- Location: `src/components/Home/`
- Contains: `Intro`, `About`, `Skills`, `SoftSkills`, `Projects`, `Experience`, `Contact`, `BackToTop`
- Depends on: Context, Redux, translation props (`t`), `useSectionInView`
- Used by: `src/app/[lang]/page.tsx`

**Layout Components:**
- Purpose: Persistent chrome rendered outside `{children}`
- Location: `src/components/layout/`
- Contains: `Header` (desktop nav + locale/theme switcher), `Sidebar` (mobile slide-in nav), `Footer`, `SideScroller` (fixed right-side section navigator)
- Depends on: ActiveSectionContext, Redux (sidebar state), ThemeContext
- Used by: `src/app/[lang]/layout.tsx`

**Common / Shared Components:**
- Purpose: Reusable primitives used across multiple sections
- Location: `src/components/common/`
- Contains: `SectionHeading`, `SectionDivider`, `LocaleSwitch`, `ThemeSwitch`, `Modal`
- Depends on: ThemeContext, framer-motion, next/navigation

**Server Actions:**
- Purpose: Secure server-side execution of email sending and reCAPTCHA verification
- Location: `src/actions/`
- Contains: `sendEmail.ts` (Resend API call), `verifyReCaptcha.ts` (Google verification)
- Depends on: `RESEND_API_KEY` env var, `NEXT_PUBLIC_GOOGLE_RECAPTCHA_KEY`, `src/lib/consts.ts`
- Used by: `src/components/Home/Contact/index.tsx`

**Data Layer:**
- Purpose: Single source of truth for all portfolio content, keyed by locale
- Location: `src/lib/useData.tsx`
- Contains: nav links, projects array (with image imports), experience timeline, skills, soft skills
- Depends on: `src/app/i18n/dictionaries/` for translated strings, `public/images/` for static images
- Used by: `src/app/[lang]/layout.tsx` and `src/app/[lang]/page.tsx`

**i18n Dictionaries:**
- Purpose: All user-visible strings for each locale
- Location: `src/app/i18n/dictionaries/` (`en-us.js`, `zh-tw.js`, `zh-cn.js`)
- Contains: Flat JS objects exported as default; loaded via `getDictionary(locale)`
- Depends on: Nothing
- Used by: Layout, page, `useData`, Server Actions for error messages

## Data Flow

**Page Render (Server):**

1. Middleware reads `Accept-Language` header, redirects `/` to `/{lang}`
2. `src/app/[lang]/layout.tsx` (Server Component) calls `getDictionary(lang)` and `useData(lang)` to fetch all content
3. Layout renders provider tree injecting `links`, `t`, and `params` as props
4. `src/app/[lang]/page.tsx` (Server Component) receives `projectsData`, `skillsData`, etc. as props and renders section components

**Client Interaction:**

1. User scrolls — `useSectionInView` (`react-intersection-observer`) fires, calls `setActiveSection` in `ActiveSectionContext`
2. Header and SideScroller read `activeSection` from context and highlight the matching nav item
3. User clicks nav link — `handleLinkClick` calls `scrollIntoView` and updates `activeSection` + `timeOfLastClick`
4. User opens mobile menu — dispatches `setSidebarOpen(true)` to Redux, which also locks `body` scroll
5. User clicks project image — dispatches `setModalImageList` + `setShowProjectImageModal(true)` to Redux; `Projects` renders a `react-multi-carousel` inside `Modal`

**Contact Form Submission:**

1. Client calls `executeRecaptcha('contactForm')` from `react-google-recaptcha-v3`
2. Token sent to `verifyReCaptcha` Server Action
3. On success, `sendEmail` Server Action calls Resend API with a React Email template
4. `react-hot-toast` surfaces success/error feedback

**Locale Switch:**

1. `LocaleSwitch` calls `router.push('/{newLang}')` via `next/navigation`
2. Next.js re-renders the `[lang]` page with the new segment, fetching a fresh dictionary

**State Management:**

- **ActiveSectionContext** — scroll-driven active nav section (string key + timestamp)
- **ThemeContext** — `"light" | "dark"` persisted to `localStorage`; applies `dark` class to `<html>`
- **RouteParamsContext** — passes `params` (including `lang`) from Server Component to deep client components without prop-drilling
- **Redux `globalSlice`** — `sidebarOpen: boolean | ''`; also manages body overflow lock
- **Redux `projectSlice`** — `showProjectImageModal`, `modalImageList`, `initalModalImageIndex` for the project image lightbox

## Key Abstractions

**`useData(lang)`:**
- Purpose: Single async factory that returns all portfolio data bound to a locale
- Location: `src/lib/useData.tsx`
- Pattern: Async server function (not a React hook despite the name); called only in Server Components

**`useSectionInView(sectionName, threshold)`:**
- Purpose: Attach an IntersectionObserver ref to a section; update `activeSection` context when visible
- Location: `src/lib/useSectionInView.ts`
- Pattern: Custom hook returning `{ ref }` — attach to section's outermost element

**`getDictionary(locale)`:**
- Purpose: Dynamic import of locale JS module, marked `"use server"`
- Location: `src/app/i18n/dictionaries/index.js`
- Pattern: Map of locale strings to async importers; returns `null` for unknown locales

## Entry Points

**Middleware:**
- Location: `src/middleware.ts`
- Triggers: Every non-asset HTTP request
- Responsibilities: Locale detection, redirect to localised path, set `lang` cookie

**Root Layout:**
- Location: `src/app/[lang]/layout.tsx`
- Triggers: Any render under `/[lang]`
- Responsibilities: Fetch dictionary + nav links, set metadata, render full provider and chrome tree

**Home Page:**
- Location: `src/app/[lang]/page.tsx`
- Triggers: GET `/[lang]` (the only page)
- Responsibilities: Fetch section data, compose all section components in scroll order

## Error Handling

**Strategy:** Server Actions return `{ data, error }` objects; client reads the discriminated union and calls `toast.error()` or `toast.success()`

**Patterns:**
- `getErrorMessage(error)` utility in `src/lib/utils.ts` normalises unknown thrown values to strings
- Input validated in `sendEmail.ts` before Resend API call using `validateString` / `validateEmail`
- `executeRecaptcha` guarded with null-check before form submission proceeds

## Cross-Cutting Concerns

**Logging:** `console.log` only (dev-mode active section logging in `active-section-context.tsx`); no structured logger
**Validation:** Inline in `src/actions/sendEmail.ts` using `src/lib/utils.ts` helpers
**Authentication:** None — public portfolio site; reCAPTCHA v3 used only to protect the contact form
**Animations:** Framer Motion throughout section reveals and header entrance; scroll-linked scale/opacity on project cards via `useScroll` + `useTransform`

---

*Architecture analysis: 2026-05-20*
