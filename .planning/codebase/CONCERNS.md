# Codebase Concerns

**Analysis Date:** 2026-05-20

---

## Accessibility Issues (a11y)

**Interactive elements missing accessible labels:**
- Issue: Navigation links in `src/components/layout/Header.tsx` use `<span>` with `onClick` instead of `<button>` or `<a>`. Keyboard navigation and screen readers will not treat them as interactive.
- Files: `src/components/layout/Header.tsx` (lines 65-78)
- Impact: Keyboard-only users and screen reader users cannot navigate the site using the nav links.
- Fix approach: Replace `<span onClick>` with `<button>` elements, or use `<a href={link.hash}>` anchors.

**Sidebar close button has no accessible label:**
- Issue: The close button in `src/components/layout/Sidebar.tsx` is a bare `<li onClick>` with only an icon child. No `aria-label` is present.
- Files: `src/components/layout/Sidebar.tsx` (line 24)
- Impact: Screen readers announce nothing meaningful for the close action.
- Fix approach: Add `aria-label="Close menu"` and change the element to a `<button>`.

**SideScroller arrows lack accessible labels:**
- Issue: The up/down arrow buttons in `src/components/layout/SideScroller.tsx` are `<div onClick>` elements with no ARIA roles or labels.
- Files: `src/components/layout/SideScroller.tsx` (lines 50-73)
- Impact: Keyboard-inaccessible, invisible to screen readers.
- Fix approach: Use `<button aria-label="Scroll to previous section">` and `<button aria-label="Scroll to next section">`.

**Image expand button lacks accessible label:**
- Issue: The expand icon in `src/components/Home/Projects/Project.tsx` uses `<div onClick>` with only `<FaExpandArrowsAlt />` icon and no label.
- Files: `src/components/Home/Projects/Project.tsx` (lines 122-126)
- Impact: Screen readers cannot identify this interactive element.
- Fix approach: Replace with `<button aria-label="Expand image">`.

**Modal has no focus trap or ARIA role:**
- Issue: `src/components/common/Modal.tsx` does not trap focus, does not set `role="dialog"`, does not set `aria-modal="true"`, and does not manage focus when opened or closed.
- Files: `src/components/common/Modal.tsx`
- Impact: Focus escapes the modal; screen reader users are not informed they are inside a dialog.
- Fix approach: Add `role="dialog"`, `aria-modal="true"`, an `aria-labelledby` referencing a heading, and a focus-trap mechanism (e.g., `focus-trap-react` library or manual tabindex management).

**Intro section profile image is commented out but alt text references wrong name:**
- Issue: The commented-out `<Image>` in `src/components/Home/Intro.tsx` (line 42) has `alt="Ricardo portrait"` — a leftover from a template, not the portfolio owner's name.
- Files: `src/components/Home/Intro.tsx` (line 42)
- Impact: If the image block is re-enabled without review, the alt text will be wrong.
- Fix approach: Update alt text to the correct name before uncommenting.

**ThemeSwitch button has no visible label:**
- Issue: `src/components/common/ThemeSwitch.tsx` renders a button containing only an icon, with no `aria-label`.
- Files: `src/components/common/ThemeSwitch.tsx`
- Impact: Screen readers announce "button" with no context.
- Fix approach: Add `aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}`.

**HTML lang attribute missing on `<html>` element:**
- Issue: `src/app/[lang]/layout.tsx` renders `<html>` without a `lang` attribute. The route param `lang` is available but not applied.
- Files: `src/app/[lang]/layout.tsx` (line 42)
- Impact: Screen readers cannot determine the document language, affecting pronunciation and language-switching behavior.
- Fix approach: Change `<html>` to `<html lang={lang}>`.

---

## Security Considerations

**`dangerouslySetInnerHTML` used with content from translation files:**
- Issue: Three components render raw HTML strings via `dangerouslySetInnerHTML` with content drawn from dictionary files.
- Files:
  - `src/components/Home/Projects/Project.tsx` (line 68) — project description
  - `src/components/Home/Contact/index.tsx` (line 75) — contact text with injected email
  - `src/components/Home/Experience/Timeline.tsx` (line 49) — experience bullet points
- Impact: If the translation files are ever user-editable or fetched from an external source, this is an XSS vector. Currently the content is static and committed to the repo, so the immediate risk is low.
- Fix approach: Sanitize HTML strings with DOMPurify before rendering, or restructure content to avoid raw HTML entirely.

**Hardcoded recipient email in source code:**
- Issue: `src/lib/consts.ts` contains two email addresses as plain constants: `contactEmail` (displayed publicly) and `resendApiRecipientEmail` (used as the Resend API destination).
- Files: `src/lib/consts.ts`
- Impact: `resendApiRecipientEmail` is committed to git and visible in the public repository. The contact display email is intentional, but the Resend recipient should be moved to an environment variable.
- Fix approach: Move `resendApiRecipientEmail` to `.env.local` as `RESEND_RECIPIENT_EMAIL` and read it in `src/actions/sendEmail.ts` via `process.env`.

**Email subject line hardcoded in Traditional Chinese:**
- Issue: `src/actions/sendEmail.ts` line 32 has a hardcoded Chinese subject `"個人形象網站 - 來信"`.
- Files: `src/actions/sendEmail.ts` (line 32)
- Impact: Minor — the subject is always in one language regardless of the sender's locale. Not a security risk but a maintenance concern.
- Fix approach: Pass the subject from the translation dictionary `t` object already available in the action signature.

---

## Technical Debt

**`t: any` type used throughout the component tree:**
- Issue: All components that receive the translation dictionary type it as `any`. Examples: `src/components/Home/Contact/index.tsx`, `src/components/Home/About.tsx`, `src/components/Home/Experience/index.tsx`, `src/components/layout/Footer.tsx`, and `src/app/[lang]/page.tsx`.
- Impact: No type-checking on dictionary key access. Typos in translation keys will only surface at runtime.
- Fix approach: Generate or manually define a TypeScript type from the dictionary structure in `src/app/i18n/dictionaries/en-us.js` and use it as the `t` prop type.

**`useData` is an `async` function named as a hook:**
- Issue: `src/lib/useData.tsx` uses the `useData` naming convention implying a React hook, but it is actually an async server-side data function (no hooks inside, called with `await` in Server Components).
- Files: `src/lib/useData.tsx`
- Impact: Naming confusion — React's rules of hooks linting will flag or incorrectly analyze it, and new developers may misuse it.
- Fix approach: Rename to `getPortfolioData(lang)` or similar to reflect its server-utility nature.

**Orphaned image files in `public/images/`:**
- Issue: Five PNG files with long filenames containing spaces are present in `public/images/` but not imported anywhere in the codebase:
  - `rmp-dev.lotuspharm.com_d_management_users(1920x1080) (1).png`
  - `rmp-dev.lotuspharm.com_d_management_users(1920x1080) (2).png`
  - `rmp-dev.lotuspharm.com_d_management_users(1920x1080) (4).png`
  - `rmp-dev.lotuspharm.com_d_management_users(1920x1080) (5).png`
  - `rmp-dev.lotuspharm.com_d_management_users(1920x1080) (6).png`
  - `rpgaming_mobile.png` (imported in `useData.tsx` but commented out)
- Files: `public/images/`, `src/lib/useData.tsx` (line 18)
- Impact: Dead weight in the repo and build output. Filenames with spaces and parentheses can also cause URL encoding issues if ever referenced directly.
- Fix approach: Delete unused files; rename any retained images to URL-safe lowercase-hyphenated names.

**`globalSlice` initial state uses empty string for boolean:**
- Issue: `src/lib/features/global/globalSlice.ts` declares `sidebarOpen: ''` (empty string) as the initial state, but all consumers check `globalSlice.sidebarOpen` as a boolean truthy/falsy value. The type is inconsistent.
- Files: `src/lib/features/global/globalSlice.ts` (line 4)
- Impact: TypeScript cannot infer a proper type; comparisons like `globalSlice.sidebarOpen ? ... : ...` work by accident.
- Fix approach: Change initial state to `sidebarOpen: false` and type it `boolean`.

**`initalModalImageIndex` typo in Redux slice name:**
- Issue: The action and state key is spelled `initalModalImageIndex` (missing 'i') in `src/lib/features/project/projectSlice.ts`, exported action, and all call sites.
- Files: `src/lib/features/project/projectSlice.ts`, `src/components/Home/Projects/Project.tsx`, `src/components/Home/Projects/ImageCarousel.tsx`, `src/components/Home/Projects/index.tsx`
- Impact: Low functional impact, but the typo propagates to all consumers and is a maintainability issue.
- Fix approach: Rename to `initialModalImageIndex` across the slice and all call sites in one coordinated change.

**DOM manipulation inside a Redux reducer:**
- Issue: `src/lib/features/global/globalSlice.ts` calls `document.body.style.overflowY` and `document.body.addEventListener` directly inside the `setSidebarOpen` reducer. Redux reducers must be pure functions.
- Files: `src/lib/features/global/globalSlice.ts` (lines 13-21)
- Impact: Breaks Redux's pure-reducer contract; causes SSR errors if the reducer is ever executed server-side; makes the state untestable in isolation.
- Fix approach: Move the scroll-lock side effects to the `Sidebar` component using `useEffect` watching `sidebarOpen` state, the same pattern already used in `src/components/common/Modal.tsx`.

**Scroll lock logic duplicated across two files:**
- Issue: The scroll-lock/unlock pattern (`document.body.style.overflowY`, `addEventListener('scroll', ...)`) is implemented twice: inside the Redux reducer in `src/lib/features/global/globalSlice.ts` and inside the Modal component in `src/components/common/Modal.tsx`.
- Files: `src/lib/features/global/globalSlice.ts`, `src/components/common/Modal.tsx`
- Impact: Dual scroll-locking when both modal and sidebar are open can create race conditions where one unlock releases the other's lock.
- Fix approach: Extract a `useScrollLock(active: boolean)` custom hook and use it in both `Sidebar` and `Modal`.

**Carousel `responsive` config duplicated:**
- Issue: The identical `responsive` breakpoint object is defined twice with the same values.
- Files: `src/components/Home/Projects/ImageCarousel.tsx` (lines 13-31) and `src/components/Home/Projects/index.tsx` (lines 19-37)
- Impact: Any breakpoint change requires editing two locations.
- Fix approach: Extract to a shared constant in `src/lib/consts.ts` or a dedicated `src/components/Home/Projects/carouselConfig.ts`.

**`carouselRef.current` used as `useEffect` dependency:**
- Issue: `src/components/Home/Projects/index.tsx` uses `carouselRef.current` as a `useEffect` dependency (line 53). Ref `.current` values are mutable and React does not track them for dependency purposes — the effect may never re-run as expected.
- Files: `src/components/Home/Projects/index.tsx` (lines 48-53)
- Impact: The initial slide index for the modal carousel may not update correctly after the first mount.
- Fix approach: Remove `carouselRef.current` from the dependency array; control the carousel slide imperatively inside an event handler instead, or use the `Carousel` component's `afterChange` / `beforeChange` callbacks.

**`Skills` and `SoftSkills` are near-identical components:**
- Issue: `src/components/Home/Skills.tsx` and `src/components/Home/SoftSkills.tsx` share identical animation variant objects, identical `<ul>/<motion.li>` structure, and identical styling. `SoftSkills` also incorrectly registers its `useSectionInView` hook as `"Skills"` (the same key as the Hard Skills section).
- Files: `src/components/Home/Skills.tsx`, `src/components/Home/SoftSkills.tsx`
- Impact: Active section detection for Soft Skills is broken — scrolling to it will mark "Skills" active, not "Soft Skills". Two files must be kept in sync for any styling change.
- Fix approach: Merge into a single `SkillList` component accepting `sectionKey`, `heading`, and `data` props. Fix the `useSectionInView` call in `SoftSkills` to use a distinct key.

**Large commented-out code blocks throughout the codebase:**
- Issue: Multiple components contain large commented-out code blocks that represent removed features or abandoned approaches:
  - `src/components/Home/Intro.tsx` — full profile image block (lines 32-49), LinkedIn link (lines 115-122)
  - `src/components/Home/About.tsx` — previous `useSectionInView` ref and `useTranslation` hook (lines 10-11, 23)
  - `src/app/[lang]/layout.tsx` — commented-out `I18nextProvider` wrapper (lines 46, 70)
  - `src/lib/useData.tsx` — commented-out "Home" nav link (lines 36-41), commented-out skills (lines 163-166)
  - `src/components/Home/BackToTop.tsx` — import and usage of `FaArrowUp` icon (lines 3, 13)
- Impact: Increases cognitive load; creates ambiguity about intended state of features.
- Fix approach: Delete all commented-out blocks. Version control history preserves them if needed.

**`I18nProvider` is loaded but does not render children during initialization:**
- Issue: `src/app/i18n/I18nProvider.tsx` returns `null` while `i18n` is initializing (line 48: `i18n ? <I18nextProvider ...> : null`). This causes the entire page content to be invisible until i18n resolves.
- Files: `src/app/i18n/I18nProvider.tsx`
- Impact: Flash of blank content on every page load. The provider also has two active `console.log` statements left in for debugging.
- Fix approach: Render children immediately (since translations are already passed as `t` props from the server) or add a loading skeleton. Remove the `console.log` statements.

**Active console.log statements in production code:**
- Issue: Three debug `console.log` statements remain in production code paths.
- Files:
  - `src/context/active-section-context.tsx` (line 28) — logs every active section change
  - `src/app/i18n/I18nProvider.tsx` (lines 36, 40) — logs route params and the i18n instance
- Impact: Exposes internal state in browser console; minor performance overhead on every section scroll event.
- Fix approach: Remove all three `console.log` calls.

---

## Performance Concerns

**Unoptimized PNG images — very large file sizes:**
- Issue: Project screenshot images are stored as raw PNGs in `public/images/`. Several are extremely large:
  - `cgc.png` — 4.7 MB
  - `rpgaming_pc.png` — 3.6 MB
  - `cgc2.png` — 3.1 MB
  - `cgc_landing.png` / `cgc4.png` — ~2.9 MB each
- Files: `public/images/`
- Impact: First meaningful paint is blocked waiting for large image payloads even though Next.js `<Image>` optimizes on-demand. Total raw image weight is ~28 MB — initial build and deployment artifact is bloated.
- Fix approach: Convert all project screenshots to WebP or AVIF at 80–85% quality. Target ≤300 KB per image. Use a tool like `sharp`, `squoosh`, or `imagemin` in a one-time script.

**All project images loaded at `quality={95}` or `quality={100}`:**
- Issue: `src/components/Home/Projects/Project.tsx` (line 113) uses `quality={95}` for card thumbnails. `src/components/Home/Projects/index.tsx` (line 79) uses `quality={100}` for the modal lightbox.
- Impact: Next.js Image optimization runs but retains unnecessarily high quality, increasing response payload. `quality={100}` effectively disables compression.
- Fix approach: Use `quality={80}` for thumbnails. Reserve `quality={90}` for the full-size modal view.

**No `priority` flag on above-the-fold images:**
- Issue: No project images or intro-section images use `priority={true}` on the Next.js `<Image>` component.
- Files: `src/components/Home/Projects/Project.tsx`, `src/components/Home/Projects/ImageCarousel.tsx`
- Impact: LCP image(s) are lazy-loaded, delaying Largest Contentful Paint.
- Fix approach: Add `priority={true}` to the first visible project's first image.

**`setTimeout` used to defer modal state dispatch:**
- Issue: Both `src/components/Home/Projects/Project.tsx` (line 47) and `src/components/Home/Projects/ImageCarousel.tsx` (line 39) use a 100 ms `setTimeout` to dispatch `setShowProjectImageModal(true)` after setting the image list.
- Impact: Fragile timing-based coordination between two Redux dispatches. Under slow devices or heavy CPU load, 100 ms may not be sufficient.
- Fix approach: Batch both dispatches in a single reducer action or use a single dispatch with a combined payload (`setModalAndOpen({ imageList, initialIndex })`).

---

## Missing Features / Incomplete Implementations

**No Open Graph / social meta tags:**
- Issue: `src/app/[lang]/layout.tsx` defines only `title` and `description` in the `Metadata` object. No `openGraph`, `twitter`, `icons`, or `robots` fields are set.
- Files: `src/app/[lang]/layout.tsx` (lines 20-28)
- Impact: Social media shares show no preview image, no card title, and no description. Search engine indexing lacks structured signals.
- Fix approach: Add `openGraph` with at minimum `title`, `description`, `type: "website"`, and an `images` array. Add a `robots` entry and a proper favicon path.

**No `sitemap.xml` or `robots.txt`:**
- Issue: Neither file exists in the `public/` directory or as a Next.js 14 metadata route.
- Impact: Search engines have no structured crawl guidance.
- Fix approach: Add `src/app/sitemap.ts` (Next.js 14 metadata route) that returns entries for each supported locale. Add `src/app/robots.ts`.

**LinkedIn link is permanently commented out:**
- Issue: `src/components/Home/Intro.tsx` (lines 115-122) has a LinkedIn button fully commented out, hardcoded to `https://linkedin.com` as a placeholder.
- Files: `src/components/Home/Intro.tsx`
- Impact: A key professional networking link is absent. If the intent is to re-add it, the placeholder URL is not a real profile link.
- Fix approach: Either add the real LinkedIn URL as a constant in `src/lib/consts.ts` and uncomment the button, or remove the dead code block entirely.

**Profile photo is absent (placeholder commented out):**
- Issue: The intro hero section in `src/components/Home/Intro.tsx` has the profile image block fully commented out. The current intro shows name and email but no photo.
- Files: `src/components/Home/Intro.tsx` (lines 31-53)
- Impact: Reduces visual identity and professionalism of the portfolio.
- Fix approach: Add a real profile photo to `public/images/`, update the `<Image>` src and alt, and uncomment the block.

**`getDictionary` silently returns `null` for unknown locales:**
- Issue: `src/app/i18n/dictionaries/index.js` returns `null` when an unsupported locale is passed (line 13). All callers use the result without null-checking.
- Files: `src/app/i18n/dictionaries/index.js`, `src/app/[lang]/layout.tsx`, `src/app/[lang]/page.tsx`
- Impact: If the middleware fails to redirect and an unlisted locale reaches `getDictionary`, all `t.x` accesses will throw a runtime error.
- Fix approach: Return the fallback locale dictionary instead of `null`, or add null-guards at the call sites.

**Middleware redirect returns without a `Response`:**
- Issue: In `src/middleware.ts` line 22, when a `pathnameLocale` is detected the function sets a cookie and then returns with bare `return` (no response value) instead of `return response`.
- Files: `src/middleware.ts` (line 22)
- Impact: The `lang` cookie is never actually set for matched locale paths. The locale detection cookie is non-functional for direct locale URL visits.
- Fix approach: Change `return` to `return response` on line 22.

---

## Dependency Risks

**`next@14.2.5` — not the latest Next.js 14 patch:**
- Current: `14.2.5`. Next.js 14 patch releases beyond this have addressed security and performance issues.
- Impact: May be missing CVE patches.
- Fix approach: Run `npm update next` and review changelog before upgrading.

**`axios` as a runtime dependency for a single server action:**
- Issue: `axios` (`^1.7.2`) is a production dependency used only in `src/actions/verifyReCaptcha.ts` for one POST request.
- Files: `src/actions/verifyReCaptcha.ts`
- Impact: Adds ~50 KB to the server bundle for functionality achievable with the native `fetch` API, which is available in Next.js server actions.
- Fix approach: Replace `axios.post(...)` with `fetch(...)` and remove the `axios` dependency.

**`react-multi-carousel@^2.8.5` — last published 2022:**
- Issue: The package has not received updates in over two years. It relies on deprecated React patterns and has open accessibility issues in its GitHub repository.
- Files: `src/components/Home/Projects/ImageCarousel.tsx`, `src/components/Home/Projects/index.tsx`
- Impact: Potential compatibility issues with future React versions; known a11y gaps (no keyboard navigation in the carousel by default); no maintenance response for security reports.
- Fix approach: Evaluate `embla-carousel-react` or `keen-slider` as actively maintained, accessible alternatives.

**`react-vertical-timeline-component@^3.6.0` — unmaintained:**
- Issue: The package has had no releases since 2021 and has open issues for React 18 compatibility warnings.
- Files: `src/components/Home/Experience/Timeline.tsx`
- Impact: Produces React 18 `act()` deprecation warnings; no accessibility improvements planned by the maintainer.
- Fix approach: Implement a custom timeline with Tailwind CSS and Framer Motion (both already in the stack), eliminating this dependency.

**`@types/react-modal` in devDependencies but `react-modal` not installed:**
- Issue: `package.json` lists `@types/react-modal` as a devDependency but there is no `react-modal` in dependencies, and `react-modal` is not imported anywhere in the codebase.
- Files: `package.json`
- Impact: Unused devDependency; minor confusion about intent.
- Fix approach: Remove `@types/react-modal` from `package.json`.

**No lockfile visible in the repo root:**
- Issue: `package-lock.json` or `yarn.lock` presence was not confirmed (only `package.json` was found at the root).
- Impact: Without a lockfile committed, `npm install` may resolve different minor/patch versions across environments, leading to non-reproducible builds.
- Fix approach: Ensure `package-lock.json` is committed to version control (it is not listed in `.gitignore`).

---

## Scalability Concerns

**All portfolio content is hardcoded in source files:**
- Issue: Projects, experience entries, skills, and soft skills are all defined as inline data within translation dictionary JS files and `src/lib/useData.tsx`. Adding a new project requires editing multiple files across at least three dictionaries plus the data file.
- Files: `src/lib/useData.tsx`, `src/app/i18n/dictionaries/en-us.js`, `src/app/i18n/dictionaries/zh-tw.js`, `src/app/i18n/dictionaries/zh-cn.js`
- Impact: Low for a single-owner portfolio, but any content update requires a code deployment. All translation dictionaries must be updated in sync or content will be missing for some locales.
- Fix approach: For the current scale this is acceptable. If content update frequency increases, consider a headless CMS (e.g., Contentlayer with local MDX, or a free-tier Sanity/Notion integration).

**`useData` is called twice per page load:**
- Issue: `src/app/[lang]/layout.tsx` calls `await useData(lang)` to get `links`, and `src/app/[lang]/page.tsx` calls `await useData(lang)` again to get `projectsData`, `skillsData`, `experiencesData`, and `softSkillsData`. Both calls also invoke `getDictionary(lang)` internally.
- Files: `src/app/[lang]/layout.tsx` (line 38), `src/app/[lang]/page.tsx` (line 17)
- Impact: The dictionary is parsed and the data object is constructed twice per request. At current scale this is negligible. With React Server Component caching, `getDictionary` calls may be deduplicated, but `useData` itself is not memoized.
- Fix approach: Pass all required data down from `layout.tsx` as props, or restructure so `page.tsx` calls `useData` once and passes `links` up via a slot pattern.

---

## Test Coverage Gaps

**No tests exist:**
- Issue: No test files (`*.test.*` or `*.spec.*`) were found anywhere in the project. No test framework is configured in `package.json` (no Jest, Vitest, Playwright, or Cypress).
- Impact: All bug regressions — including the middleware cookie bug, the scroll-lock race condition, and the carousel index synchronization issue — are undetectable until they appear in production.
- Priority: Medium. For a portfolio site the risk is low, but server action logic (`sendEmail`, `verifyReCaptcha`) is especially worth unit-testing.
- Fix approach: Add Vitest for unit tests. At minimum, test `src/lib/utils.ts` (validation logic), `src/actions/verifyReCaptcha.ts` (score threshold logic), and `src/actions/sendEmail.ts` (input validation paths).

---

*Concerns audit: 2026-05-20*
