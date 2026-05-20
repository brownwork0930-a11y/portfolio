# Testing Patterns

**Analysis Date:** 2026-05-20

## Test Framework

**Runner:** None — no testing framework is installed or configured.

**Assertion Library:** None

**Test Config Files:** None (no `jest.config.*`, `vitest.config.*`, `playwright.config.*`, or `cypress.json` present)

**Run Commands:**
```bash
# No test commands available
# package.json scripts: dev, build, start, lint
```

## Test File Organization

**Location:** No test files exist anywhere in the repository.

**Naming:** No `.test.ts`, `.test.tsx`, `.spec.ts`, or `.spec.tsx` files found.

**Test Directories:** No `__tests__/`, `tests/`, `e2e/`, `cypress/`, or `playwright/` directories exist.

## Coverage

**Requirements:** None enforced — no coverage tooling configured.

**Coverage Command:** Not available.

## Types of Tests Present

| Type | Status |
|------|--------|
| Unit tests | Not present |
| Integration tests | Not present |
| E2E tests | Not present |
| Component tests | Not present |
| API/Action tests | Not present |

## What Exists Instead of Tests

**Only quality-related tooling present:**
- `next lint` — runs Next.js built-in ESLint (no custom rules configured)
- TypeScript strict mode (`"strict": true` in `tsconfig.json`) provides compile-time type checking
- No runtime validation beyond TypeScript types and manual input guards in `src/lib/utils.ts`

## Test Coverage Gaps

**Utility Functions — `src/lib/utils.ts`:**
- `validateString`, `validateEmail`, `getErrorMessage`, `handleDownloadFile` are pure/near-pure functions and the highest-value starting point for unit tests
- Risk: Email validation regex and string length guards are used in the contact form and server action; regressions here silently break form submission

**Server Actions — `src/actions/sendEmail.ts`, `src/actions/verifyReCaptcha.ts`:**
- No tests for input validation paths, error branches, or successful send flow
- Risk: Changes to validation logic or error shape would not be caught before deployment

**Redux Slices — `src/lib/features/global/globalSlice.ts`, `src/lib/features/project/projectSlice.ts`:**
- Slice reducers are pure functions and straightforward to unit-test
- `setSidebarOpen` in `globalSlice.ts` has a side effect (mutates `document.body.style` and adds DOM event listeners) that is untested
- Risk: The DOM side-effect logic in a reducer is non-standard and fragile

**Custom Hooks — `src/lib/useSectionInView.ts`:**
- Depends on `react-intersection-observer` and the active section context; behavior (which section becomes active on scroll) is untested
- Risk: Scroll-tracking regressions are invisible until manual QA

**i18n / Dictionary — `src/app/i18n/dictionaries/`:**
- No tests verify that all locale keys (`en-us`, `zh-tw`, `zh-cn`) are complete and consistent
- Risk: A missing translation key causes a runtime `undefined` render with no error thrown

**Middleware — `src/middleware.ts`:**
- Locale detection and redirect logic is untested
- Risk: Edge cases (missing `Accept-Language` header, unsupported locale values) not verified

## Recommendations

**Immediate (highest ROI):**

1. Install a test runner. Vitest is recommended for this Next.js + TypeScript stack:
   ```bash
   npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom
   ```
   Add to `package.json` scripts: `"test": "vitest"`, `"test:coverage": "vitest run --coverage"`

2. Write unit tests for `src/lib/utils.ts` — all four functions are pure and require no mocking.

3. Write unit tests for Redux slices in `src/lib/features/` — reducers are pure functions; mock `document` for the `setSidebarOpen` side effect.

**Medium priority:**

4. Add i18n completeness tests — iterate all keys in one locale dictionary and assert the same keys exist in all others.

5. Add server action tests with mocked `resend` and `fetch` clients to verify validation error paths.

**Longer term:**

6. Add component tests with React Testing Library for interactive components (`Contact/index.tsx`, `Header.tsx`, `ThemeSwitch.tsx`).

7. Add E2E tests with Playwright for the contact form submission flow (the only user-facing side effect).

---

*Testing analysis: 2026-05-20*
