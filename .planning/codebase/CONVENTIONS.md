# Coding Conventions

**Analysis Date:** 2026-05-20

## Naming Patterns

**Files:**
- React components: PascalCase, `.tsx` extension (e.g., `ThemeSwitch.tsx`, `SectionHeading.tsx`)
- Feature sub-sections use `index.tsx` as the entry point with sibling files for sub-components (e.g., `src/components/Home/Contact/index.tsx`, `src/components/Home/Contact/SubmitButton.tsx`)
- Utility/hook files: camelCase, `.ts` extension (e.g., `useSectionInView.ts`, `utils.ts`, `hooks.ts`)
- Redux slices: camelCase with `Slice` suffix (e.g., `globalSlice.ts`, `projectSlice.ts`)
- Context files: kebab-case with `-context` suffix (e.g., `theme-context.tsx`, `active-section-context.tsx`)

**Functions / Components:**
- React components: PascalCase default exports (e.g., `export default function ThemeSwitch()`)
- Custom hooks: camelCase with `use` prefix (e.g., `useSectionInView`, `useTheme`, `useActiveSectionContext`)
- Event handlers: camelCase with `handle` prefix (e.g., `handleSubmit`, `handleSidebarOpen`, `handleLinkClick`)
- Redux action creators: camelCase with `set` prefix (e.g., `setSidebarOpen`, `setShowProjectImageModal`)

**Variables:**
- camelCase throughout (`activeSection`, `timeOfLastClick`, `gRecaptchaToken`)
- Boolean state flags: descriptive names without `is`/`has` prefix when context is clear (e.g., `loading`, `sidebarOpen`)

**Types / Interfaces:**
- PascalCase with `Type` or `Props` suffix for context/prop types (e.g., `ThemeContextType`, `ThemeContextProviderProps`, `SectionHeadingProps`)
- Interface names use `Data` suffix for data shapes (e.g., `ExperienceData`, `LinkData`, `ProjectData`)
- Defined in `src/lib/types.ts` for shared types

**Directories:**
- Feature directories: PascalCase (e.g., `Home/`, `Projects/`, `Experience/`)
- Shared/utility directories: lowercase (e.g., `common/`, `layout/`, `context/`, `lib/`, `actions/`)

## Code Style

**Formatting:**
- No Prettier config present; formatting is not formally enforced
- Indentation: 2 spaces (observed in all files)
- Semicolons: present in most files; inconsistent in a few (e.g., `ImageCarousel.tsx` omits them)
- Quotes: double quotes in JSX attributes and most strings; single quotes in some files (`'use client'`, `Sidebar.tsx`)
- Trailing commas: generally present in multi-line objects and arrays

**Linting:**
- No `.eslintrc` config file present; relies on Next.js built-in ESLint defaults (`next lint` script in `package.json`)
- TypeScript strict mode enabled in `tsconfig.json` (`"strict": true`)
- `skipLibCheck: true` — third-party type errors are suppressed

## TypeScript Usage

**Strict Mode:** Enabled. All new code must satisfy strict TypeScript checks.

**Path Aliases:**
- `@/*` maps to `./src/*` (configured in `tsconfig.json`)
- Use `@/` imports throughout; never use relative paths crossing major directories

**Type Patterns:**
- Shared interfaces live in `src/lib/types.ts`
- Context types are co-located with their provider file
- Redux state types are inferred from the store (`RootState`, `AppDispatch`, `AppStore` in `src/lib/store.ts`)
- Typed Redux hooks are wrapped in `src/lib/hooks.ts`:
  ```typescript
  export const useAppDispatch: () => AppDispatch = useDispatch;
  export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
  ```

**Known Weakness — `any` usage:**
- The translation object `t` is typed as `any` across most components (e.g., `Intro.tsx`, `Skills.tsx`, `Contact/index.tsx`, `sendEmail.ts`)
- Some `params` objects use `Record<any, any>` (e.g., `layout.tsx`)
- `useRef<any>` appears in `Projects/index.tsx`
- New code should prefer typed alternatives; the `t` translation object should eventually be typed from the dictionary shape

## Component Patterns

**Directive Usage:**
- Client components declare `"use client"` at the top of the file
- Server components (default in Next.js App Router) have no directive
- Server actions declare `"use server"` at the top (e.g., `src/actions/sendEmail.ts`)
- Pattern: layout and page components are server components; interactive components are client components

**Component Structure:**
```typescript
"use client";

import React from "react";
// external imports
// internal @/ imports

export default function ComponentName({ prop }: { prop: Type }) {
  // hooks first
  // derived state / memos
  // handlers
  // return JSX
}
```

**Props:**
- Inline type annotations on props are preferred over separate `Props` type for simple components
- Dedicated `Props` type used when there are multiple consumers or complex shapes

**Context Pattern:**
- `createContext<Type | null>(null)` with a null guard in the consumer hook:
  ```typescript
  export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === null) {
      throw new Error("useTheme must be used within a ThemeContextProvider");
    }
    return context;
  }
  ```
- Context files export: the default Provider component + the named consumer hook
- Located in `src/context/`

**Redux Pattern:**
- Redux Toolkit slices in `src/lib/features/<domain>/<domain>Slice.ts`
- `createSlice` with `initialState` object, `reducers` map, and named export of actions
- Use `useAppDispatch` and `useAppSelector` (never raw `useDispatch`/`useSelector`)

## CSS / Styling Approach

**Primary:** Tailwind CSS v3 with `darkMode: "class"` strategy

**Dark mode:** toggled by adding/removing the `dark` class on `<html>` via `ThemeContextProvider`; dark variants use `dark:` prefix in class strings

**Custom CSS:**
- Global styles in `src/app/globals.css` — minimal; only Tailwind directives plus a few overrides:
  - CSS custom property: `--line-color` for theme-aware borders
  - Utility class `.borderBlack` composed with `@apply border border-black/10`
  - Third-party library overrides (react-vertical-timeline-component media queries)

**Conditional classes:** `clsx` is used for conditional/composed class strings:
```typescript
import clsx from "clsx";
className={clsx("base-classes", condition && "conditional-class", { "object-form": flag })}
```

**Inline styles:** Used only for Framer Motion dynamic values (e.g., `style={{ scale: scaleProgess, opacity: opacityProgess }}`); avoid for static styling

**No CSS Modules** — all styling is Tailwind utility classes or global CSS

## Import Organization

**Order (observed pattern):**
1. React and `"use client"` / `"use server"` directives (always first line)
2. External library imports (`framer-motion`, `clsx`, `react-icons`, `next/image`, etc.)
3. Internal `@/` imports — types, lib utilities, context, hooks
4. Relative imports (sibling/child components within the same feature directory)
5. CSS imports last (e.g., `import "react-multi-carousel/lib/styles.css"`)

**Path alias:** Always use `@/` for cross-directory imports; relative imports (`./`, `../`) only within the same feature folder.

**Named vs default exports:**
- Components: default export
- Utilities, hooks, types, Redux actions: named exports
- Redux slice reducers: default export (required by `configureStore`)

## Animation

**Framer Motion** is used throughout for entrance/exit animations:
- `motion.div`, `motion.section`, `motion.li` wrappers for animated elements
- Standard entrance pattern: `initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }}`
- Scroll-triggered: `whileInView` + `viewport={{ once: true }}`
- Spring physics used for interactive elements (nav indicator, wave emoji)

## Error Handling

**Server actions** return `{ data, error }` shape — never throw to the client:
```typescript
try {
  data = await resend.emails.send(...)
} catch (error: unknown) {
  return { error: getErrorMessage(error) };
}
return { data };
```

**Client-side errors:** Surfaced via `react-hot-toast` (`toast.error(...)`, `toast.success(...)`)

**Utility:** `getErrorMessage(error: unknown): string` in `src/lib/utils.ts` normalizes unknown errors to strings

## Comments

- Commented-out code is common throughout (e.g., disabled nav items, old image component in `Intro.tsx`)
- Inline comments explain intent sparingly (`// we need to keep track of this to disable the observer temporarily`)
- No JSDoc/TSDoc annotations present
- Chinese-language comments appear in layout files (`// 頁面上方漸層`)

---

*Convention analysis: 2026-05-20*
