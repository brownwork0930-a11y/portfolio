# Codebase Structure

**Analysis Date:** 2026-05-20

## Directory Layout

```
amsterdam/                          # Project root
├── src/
│   ├── actions/                    # Next.js Server Actions (email, reCAPTCHA)
│   ├── app/                        # Next.js App Router root
│   │   ├── [lang]/                 # Dynamic locale segment (only route)
│   │   │   ├── layout.tsx          # Root layout (server): providers, chrome
│   │   │   └── page.tsx            # Home page (server): section composition
│   │   ├── i18n/                   # i18n config and dictionary loader
│   │   │   ├── dictionaries/       # Per-locale JS translation objects
│   │   │   │   ├── en-us.js
│   │   │   │   ├── zh-tw.js
│   │   │   │   ├── zh-cn.js
│   │   │   │   └── index.js        # getDictionary() loader (use server)
│   │   │   ├── I18nProvider.tsx    # react-i18next client provider
│   │   │   └── index.ts            # Language list and defaults
│   │   ├── favicon.ico
│   │   ├── globals.css             # Tailwind base + global styles
│   │   ├── GReCaptchaProvider.tsx  # Google reCAPTCHA v3 provider wrapper
│   │   └── StoreProvider.tsx       # Redux store client provider
│   ├── components/
│   │   ├── Home/                   # Page section components
│   │   │   ├── About.tsx
│   │   │   ├── BackToTop.tsx
│   │   │   ├── Intro.tsx
│   │   │   ├── Skills.tsx
│   │   │   ├── SoftSkills.tsx
│   │   │   ├── Contact/
│   │   │   │   ├── index.tsx       # Contact form with reCAPTCHA + Server Action
│   │   │   │   └── SubmitButton.tsx
│   │   │   ├── Experience/
│   │   │   │   ├── index.tsx       # Experience section wrapper
│   │   │   │   └── Timeline.tsx    # react-vertical-timeline-component
│   │   │   └── Projects/
│   │   │       ├── index.tsx       # Projects list + image lightbox modal
│   │   │       ├── Project.tsx     # Individual project card (scroll animation)
│   │   │       └── ImageCarousel.tsx  # Mobile image carousel (react-multi-carousel)
│   │   ├── common/                 # Shared/reusable primitives
│   │   │   ├── LocaleSwitch.tsx    # Locale <select> dropdown
│   │   │   ├── Modal.tsx           # Generic modal overlay
│   │   │   ├── SectionDivider.tsx  # Animated horizontal divider
│   │   │   ├── SectionHeading.tsx  # Consistent section title element
│   │   │   └── ThemeSwitch.tsx     # Light/dark toggle
│   │   └── layout/                 # Persistent chrome components
│   │       ├── Footer.tsx
│   │       ├── Header.tsx          # Top nav (desktop) + hamburger (mobile)
│   │       ├── Sidebar.tsx         # Mobile slide-in navigation drawer
│   │       └── SideScroller.tsx    # Fixed right-side section nav arrows
│   ├── context/                    # React context providers
│   │   ├── active-section-context.tsx  # Scroll-tracked active nav section
│   │   ├── route-params-content.tsx    # Pass server params to client components
│   │   └── theme-context.tsx           # Light/dark theme + localStorage
│   ├── email/
│   │   └── contact-form-email.tsx  # React Email template for contact form
│   ├── lib/                        # Shared utilities, types, data, store
│   │   ├── consts.ts               # Email address constants
│   │   ├── hooks.ts                # Typed useAppDispatch / useAppSelector
│   │   ├── store.ts                # Redux store factory (makeStore)
│   │   ├── types.ts                # Shared TypeScript interfaces
│   │   ├── useData.tsx             # Async data factory: nav links, projects, etc.
│   │   ├── useSectionInView.ts     # IntersectionObserver hook for active section
│   │   ├── utils.ts                # validateString, validateEmail, getErrorMessage, handleDownloadFile
│   │   └── features/
│   │       ├── global/
│   │       │   └── globalSlice.ts  # Redux: sidebarOpen state + scroll lock
│   │       └── project/
│   │           └── projectSlice.ts # Redux: image modal state
│   └── middleware.ts               # Locale detection + redirect edge middleware
├── public/
│   ├── images/                     # Project screenshot PNGs (imported in useData.tsx)
│   ├── resumes/                    # Locale-specific PDF resumes (en-us, zh-tw, zh-cn)
│   ├── next.svg
│   └── vercel.svg
├── next.config.mjs                 # Next.js config (remote image domains)
├── tailwind.config.ts              # Tailwind config
├── postcss.config.mjs
├── tsconfig.json
└── package.json
```

## Directory Purposes

**`src/actions/`:**
- Purpose: Next.js Server Actions callable directly from Client Components
- Contains: `sendEmail.ts` (Resend API), `verifyReCaptcha.ts` (Google token verification)
- Key files: `src/actions/sendEmail.ts`, `src/actions/verifyReCaptcha.ts`

**`src/app/[lang]/`:**
- Purpose: The single locale-parameterised route. All visible pages live here.
- Contains: `layout.tsx` (server, renders provider tree), `page.tsx` (server, composes sections)
- Key files: `src/app/[lang]/layout.tsx`, `src/app/[lang]/page.tsx`

**`src/app/i18n/`:**
- Purpose: Internationalisation configuration and dictionary loading
- Contains: Language constants, `getDictionary()` server loader, per-locale JS translation files, react-i18next client provider
- Key files: `src/app/i18n/index.ts`, `src/app/i18n/dictionaries/index.js`

**`src/components/Home/`:**
- Purpose: One component per portfolio section, rendered in scroll order from `page.tsx`
- Contains: `Intro`, `About`, `Skills`, `SoftSkills`, `Projects/`, `Experience/`, `Contact/`, `BackToTop`
- All are `"use client"` components that accept a `t` (translation) prop from the server

**`src/components/common/`:**
- Purpose: Stateless or lightly-stateful UI primitives shared across sections
- Contains: Heading, divider, modal, locale switch, theme switch

**`src/components/layout/`:**
- Purpose: Persistent chrome always visible regardless of scroll position
- Contains: `Header` (top bar), `Sidebar` (mobile drawer), `Footer`, `SideScroller` (fixed right nav)

**`src/context/`:**
- Purpose: React Context providers for cross-cutting client state
- Contains: Active section tracker, route params bridge, theme

**`src/email/`:**
- Purpose: React Email component used by the `sendEmail` Server Action
- Contains: `contact-form-email.tsx` — HTML email rendered server-side via Resend

**`src/lib/`:**
- Purpose: All shared logic — data, utilities, types, Redux store, and hooks
- Contains: `useData.tsx` (content factory), `store.ts` + `features/` (Redux), `types.ts`, `utils.ts`, `hooks.ts`, `useSectionInView.ts`, `consts.ts`

**`public/images/`:**
- Purpose: Static project screenshots served by Next.js and imported via `next/image` in `useData.tsx`
- Contains: PNGs grouped by project prefix (`cgc`, `fqc_admin`, `fqc_app`, `lotusrmp`, `rpgaming`)

**`public/resumes/`:**
- Purpose: Downloadable PDF resumes, one per supported locale
- Contains: `resume_en-us.pdf`, `resume_zh-tw.pdf`, `resume_zh-cn.pdf`
- Referenced via locale param: `/resumes/resume_${params.lang}.pdf`

## Key File Locations

**Entry Points:**
- `src/middleware.ts`: Edge middleware — locale detection and redirect
- `src/app/[lang]/layout.tsx`: Root layout — providers, chrome, metadata
- `src/app/[lang]/page.tsx`: Single page — all section components assembled

**Configuration:**
- `next.config.mjs`: Next.js image remote patterns
- `tailwind.config.ts`: Tailwind configuration
- `tsconfig.json`: TypeScript path aliases (`@/` → `src/`)
- `src/app/i18n/index.ts`: Supported locales, default locale

**Core Logic:**
- `src/lib/useData.tsx`: All portfolio content (nav, projects, experiences, skills)
- `src/lib/store.ts`: Redux store factory
- `src/lib/features/global/globalSlice.ts`: Sidebar UI state
- `src/lib/features/project/projectSlice.ts`: Project image modal state
- `src/context/active-section-context.tsx`: Scroll-driven active section
- `src/context/theme-context.tsx`: Light/dark mode

**Translations:**
- `src/app/i18n/dictionaries/en-us.js`
- `src/app/i18n/dictionaries/zh-tw.js`
- `src/app/i18n/dictionaries/zh-cn.js`

## Naming Conventions

**Files:**
- React components: PascalCase — `SectionHeading.tsx`, `LocaleSwitch.tsx`
- Sub-feature entry: `index.tsx` inside a PascalCase folder — `Contact/index.tsx`, `Projects/index.tsx`
- Hooks: camelCase with `use` prefix — `useSectionInView.ts`, `useData.tsx`
- Redux slices: camelCase with `Slice` suffix — `globalSlice.ts`, `projectSlice.ts`
- Utilities / constants: camelCase — `utils.ts`, `consts.ts`, `hooks.ts`
- Dictionaries: kebab-case locale codes — `en-us.js`, `zh-tw.js`, `zh-cn.js`

**Directories:**
- Components grouped by concern: PascalCase for feature groups (`Home/`, `layout/`), lowercase for generic groups (`common/`)
- Redux features: lowercase feature name under `src/lib/features/{featureName}/`

## Page / Route Breakdown

There is one real page. The `[lang]` dynamic segment controls locale; no other route segments exist.

| URL pattern | Handler | Description |
|---|---|---|
| `/` | `src/middleware.ts` | Redirects to `/{defaultLang}` |
| `/{lang}` | `src/app/[lang]/page.tsx` | Full portfolio SPA |
| `/{lang}/...anything` | `src/middleware.ts` | Would redirect; no sub-pages exist |

Supported `[lang]` values: `en-us`, `zh-tw` (default), `zh-cn`

Middleware excludes from processing: `/api`, `/_next/static`, `/_next/image`, `/assets`, `/favicon.ico`, `/sw.js`, `/site.webmanifest`, `/resumes`

## Component Organization

Sections rendered top-to-bottom in `page.tsx`:
1. `Intro` — name, CTA buttons, GitHub link, resume download
2. `SectionDivider`
3. `About` — bio text
4. `SectionDivider`
5. `Skills` — tech skill tags (animated with framer-motion)
6. `SoftSkills` — soft skill tags
7. `Projects` — project cards with scroll animation and image lightbox
8. `Experience` — vertical timeline (`react-vertical-timeline-component`)
9. `Contact` — contact form with reCAPTCHA v3 and Server Action email
10. `BackToTop` — scroll-to-top button

All section components:
- Are `"use client"` directives
- Accept `t` (translation dict) as a prop
- Call `useSectionInView(sectionName)` to register with the active-section tracker
- Use `id="sectionname"` for anchor scroll targets

## Public Assets Structure

```
public/
├── images/
│   ├── cgc.png          # Project screenshots — cgc project
│   ├── cgc2.png
│   ├── cgc3.png
│   ├── cgc4.png
│   ├── cgc_landing.png
│   ├── fqc_admin.png    # Project screenshots — fqc admin
│   ├── fqc_admin2.png
│   ├── fqc_admin3.png
│   ├── fqc_app.png      # Project screenshots — fqc mobile app
│   ├── fqc_app2.png
│   ├── fqc_app3.png
│   ├── lotusrmp.png     # Project screenshots — lotusrmp
│   ├── lotusrmp2.png
│   ├── lotusrmp3.png
│   ├── lotusrmp4.png
│   ├── rpgaming_mobile.png   # Project screenshots — rpgaming
│   ├── rpgaming_pc.png
│   ├── rpgaming_pc2.png
│   ├── rpgaming_pc3.png
│   └── rpgaming_pc4.png
├── resumes/
│   ├── resume_en-us.pdf
│   ├── resume_zh-cn.pdf
│   └── resume_zh-tw.pdf
├── next.svg
└── vercel.svg
```

Image naming pattern: `{projectSlug}[_variant][_suffix].png` — no spaces except legacy `rmp-dev.lotuspharm.com_...` screenshots which have spaces in filenames and are not referenced in `useData.tsx`.

Resume naming pattern: `resume_{locale}.pdf` — must match values in `src/app/i18n/index.ts` `languages` array.

## Where to Add New Code

**New portfolio section:**
- Component: `src/components/Home/{SectionName}.tsx`
- Register in page: `src/app/[lang]/page.tsx`
- Add nav link: `src/lib/useData.tsx` → `links` array
- Add translations: all three dictionary files in `src/app/i18n/dictionaries/`
- Add section key to call `useSectionInView('{SectionName}')` inside the component

**New project entry:**
- Add images to `public/images/`
- Import images in `src/lib/useData.tsx`
- Add entry to `projectsData` array in `src/lib/useData.tsx`
- Add translated strings to all three dictionary files

**New translation string:**
- Add the key to `src/app/i18n/dictionaries/en-us.js`, `zh-tw.js`, and `zh-cn.js`
- Access in Server Components via `getDictionary(lang)`, in Client Components via the `t` prop passed down from the server

**New Redux state:**
- Create `src/lib/features/{featureName}/{featureName}Slice.ts`
- Register reducer in `src/lib/store.ts`

**New common component:**
- Place in `src/components/common/{ComponentName}.tsx`

**New locale:**
- Add locale string to `languages` array in `src/app/i18n/index.ts`
- Add option to `languagesOptions` array in the same file
- Create `src/app/i18n/dictionaries/{locale}.js`
- Register in `src/app/i18n/dictionaries/index.js`
- Add `public/resumes/resume_{locale}.pdf`

## Special Directories

**`.planning/`:**
- Purpose: GSD planning documents and codebase analysis
- Generated: No (human/agent authored)
- Committed: Yes

**`.context/`:**
- Purpose: Project todos and working notes
- Generated: No
- Committed: Yes

**`.claude/`:**
- Purpose: Claude Code project instructions (`CLAUDE.md`)
- Generated: No
- Committed: Yes

---

*Structure analysis: 2026-05-20*
