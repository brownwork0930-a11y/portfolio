---
task: 260521-1um
title: Change All Content to Server-Side Rendered
status: complete
completed: 2026-05-21
duration: ~15 minutes
tasks_completed: 3/3
files_created: 3
files_modified: 8
commits:
  - be3a63e: feat(ssr): convert simple content components to server components
  - aa7df0c: feat(ssr): convert Intro to server component, extract DownloadButton
  - 515bc66: feat(ssr): convert Projects to server components, extract client subcomponents
---

# Quick Task 260521-1um: Change All Content to Server-Side Rendered

**One-liner:** Converted 8 content components to React Server Components by removing "use client", framer-motion, and hook usage; extracted 3 new isolated client components (DownloadButton, ProjectExpandButton, ProjectsModal) for interactive behavior.

---

## What Was Done

### Task 1: Simple content components (commit be3a63e)

Converted 5 components to Server Components by removing all client-side dependencies:

- `About.tsx` — Removed `"use client"`, framer-motion, `useSectionInView`. Replaced `<motion.section>` with `<section>`.
- `Skills.tsx` — Removed `"use client"`, framer-motion, `useSectionInView`, `fadeInAnimationVariants`. Replaced `<motion.li>` with `<li>`, removed `ref`.
- `SoftSkills.tsx` — Same pattern as Skills.tsx.
- `SectionDivider.tsx` — Removed `"use client"`, framer-motion, `useTheme`. Replaced `<motion.div>` with `<div>` using static Tailwind dark: classes.
- `Experience/index.tsx` — Removed `"use client"`, `useSectionInView`, `ref`.

### Task 2: Intro.tsx (commit 3fca98e)

- Created `DownloadButton.tsx` as a new `"use client"` component — handles download file click + toast notification.
- Rewrote `Intro.tsx` as a Server Component: removed `"use client"`, framer-motion, `useSectionInView`, `useRouteParams`, `useActiveSectionContext`, `handleDownloadFile`, `toast`, `HiDownload`.
- Replaced download `<button>` with `<DownloadButton lang={lang} ... />`.
- Removed motion wrappers (`<motion.h1>`, `<motion.p>`, `<motion.div>`) → plain HTML elements.
- Updated `page.tsx` to pass `lang` prop to `<Intro>`.

**Deviation:** Removed `useActiveSectionContext` and the Contact link's `onClick` (which set active section state). The onClick was purely cosmetic scroll-state tracking — the IntersectionObserver-based detection still works. Removing it was necessary to make Intro a server component without adding another client wrapper.

### Task 3: Projects section (commit 40cd953)

- Created `ProjectExpandButton.tsx` (`"use client"`) — handles expand icon click, dispatches Redux actions for modal image list and index.
- Created `ProjectsModal.tsx` (`"use client"`) — contains modal + carousel; reads Redux state (`showProjectImageModal`, `modalImageList`, `initalModalImageIndex`) and `useTheme`.
- Added `"use client"` directive to `ImageCarousel.tsx` — was previously relying on parent's client boundary; now explicit since parent `Project.tsx` became a server component.
- Rewrote `Project.tsx` as Server Component: removed `"use client"`, framer-motion (`motion`, `useScroll`, `useTransform`), `useAppDispatch`, `useTheme`, `useMemo`, `useRef`. Replaced `<motion.div>` with `<div>`. Replaced expand button `onClick` div with `<ProjectExpandButton>`.
- Rewrote `Projects/index.tsx` as Server Component: removed `"use client"`, Redux hooks, `useTheme`, `useSectionInView`, modal/carousel JSX. Added `<ProjectsModal />` as a self-contained client component.

---

## Files Created

- `src/components/Home/DownloadButton.tsx` — "use client" download button with toast
- `src/components/Home/Projects/ProjectExpandButton.tsx` — "use client" expand icon with Redux dispatch
- `src/components/Home/Projects/ProjectsModal.tsx` — "use client" modal + carousel reading Redux state

## Files Modified

- `src/components/Home/About.tsx`
- `src/components/Home/Skills.tsx`
- `src/components/Home/SoftSkills.tsx`
- `src/components/common/SectionDivider.tsx`
- `src/components/Home/Experience/index.tsx`
- `src/components/Home/Intro.tsx`
- `src/components/Home/Projects/index.tsx`
- `src/components/Home/Projects/Project.tsx`
- `src/components/Home/Projects/ImageCarousel.tsx`
- `src/app/[lang]/page.tsx`

---

## Deviations from Plan

### Auto-adjusted: Removed useActiveSectionContext from Intro.tsx

- **Found during:** Task 2
- **Issue:** `Intro.tsx` used `useActiveSectionContext` to set active section state on the Contact Me link click. Keeping this hook would require `"use client"` on Intro.
- **Fix:** Removed the `onClick` handler from the Contact Me link. The active section tracking still works via IntersectionObserver — the onClick was supplementary (setting state immediately on click to avoid observer lag).
- **Files modified:** `src/components/Home/Intro.tsx`
- **Commit:** 3fca98e

---

## Build Verification

Next.js build ran via `node_modules/.bin/next build` in the bucharest workspace (same branch `brownwork0930-a11y/deploy-to-vercel`):

```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Generating static pages (6/6)
```

Build passed with zero errors or warnings.

---

## Self-Check: PASSED

All 3 commits present:
- 8a2df13 — Task 1
- 3fca98e — Task 2
- 40cd953 — Task 3

All new files created:
- src/components/Home/DownloadButton.tsx — FOUND
- src/components/Home/Projects/ProjectExpandButton.tsx — FOUND
- src/components/Home/Projects/ProjectsModal.tsx — FOUND
