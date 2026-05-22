---
phase: quick-260522-rek
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/components/common/Modal.tsx
autonomous: false
requirements:
  - QUICK-260522-REK-01
must_haves:
  truths:
    - "When the project preview modal is open on desktop, scrolling the page (wheel/trackpad/keyboard) does not move the background content"
    - "When the project preview modal is open on mobile (including iOS Safari), touch-dragging the background does not scroll the underlying page"
    - "When the modal closes, the page scroll position is preserved (no jump to top)"
    - "When the modal closes, scrolling on the page works normally again"
    - "No horizontal layout shift occurs when the scrollbar disappears on desktop (or shift is acceptable/handled)"
  artifacts:
    - path: "src/components/common/Modal.tsx"
      provides: "Reusable modal with reliable cross-platform body scroll lock"
      contains: "useEffect"
  key_links:
    - from: "src/components/common/Modal.tsx"
      to: "document.body / document.documentElement"
      via: "useEffect side effect that toggles position:fixed + top offset on open/close"
      pattern: "position.*fixed|overflow.*hidden"
---

<objective>
Lock background page scrolling whenever the shared `Modal` component is open, so that opening the project preview modal (ProjectsModal) on desktop or mobile prevents the page behind it from scrolling. Restore scroll behavior and position on close.

Purpose: Current implementation only sets `document.body.style.overflowY = 'hidden'` and attaches a (non-firing) scroll listener to `document.body`. This does not prevent scrolling on iOS Safari and other mobile browsers, leading to a poor UX where the page behind the modal still scrolls.

Output: Updated `Modal.tsx` with a robust scroll-lock pattern that works on desktop and mobile, plus manual verification on both viewports.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@src/components/common/Modal.tsx
@src/components/Home/Projects/ProjectsModal.tsx
@src/lib/features/project/projectSlice.ts

<interfaces>
<!-- Modal contract — already established, do not change -->

From src/components/common/Modal.tsx:
```typescript
export default function Modal({
  children,
  show
}: {
  children: React.ReactNode;
  show: boolean;
}): JSX.Element | null;
```

The shared `Modal` is currently used only by `ProjectsModal` (project image preview). Any scroll-lock change in `Modal.tsx` will automatically apply to that usage. No callers need to change.

Existing (broken) scroll-lock logic in Modal.tsx (to be replaced):
```typescript
function disableOnScroll(event: Event) {
  event.preventDefault();
}

React.useEffect(() => {
  if (show) {
    document.body.style.overflowY = 'hidden'
    document.body.addEventListener('scroll', disableOnScroll, { passive: false });
  } else {
    document.body.style.overflowY = 'auto'
    document.body.removeEventListener('scroll', disableOnScroll)
  }
}, [show])
```

Problems:
1. `scroll` does not bubble to `document.body`; the listener never fires.
2. `overflow: hidden` on `<body>` alone does NOT lock scrolling on iOS Safari — the user can still drag the page.
3. On unmount or fast re-toggle, styles can desync (no cleanup return from the effect).
4. When modal opens, the current scroll position is not preserved if we later switch to `position: fixed` approach.
</interfaces>
</context>

<tasks>

<task type="auto" tdd="false">
  <name>Task 1: Replace Modal scroll-lock with cross-platform, position-preserving implementation</name>
  <files>src/components/common/Modal.tsx</files>
  <behavior>
    - When `show` flips false -> true: capture current `window.scrollY`, apply styles to `document.body` that prevent both desktop and mobile (iOS Safari) scrolling.
    - When `show` flips true -> false (or component unmounts while open): restore original body styles and scroll the window back to the captured position (no jump to top).
    - If multiple modals were ever open simultaneously (currently not the case, but safe), the last-closed restore should still work because each Modal stores its own previous values via refs.
    - The scrollbar-disappearance horizontal shift on desktop should be compensated by padding-right equal to the previous scrollbar width (so layout doesn't jump).
  </behavior>
  <action>
    Edit `src/components/common/Modal.tsx`.

    1. Remove the existing broken effect: delete `disableOnScroll`, remove `document.body.addEventListener('scroll', ...)`, remove the naive `overflowY` toggle.

    2. Replace with a single `useEffect` keyed on `show` that implements the "fixed body" scroll-lock pattern (the standard cross-platform fix, including iOS Safari):

    ```typescript
    React.useEffect(() => {
      if (!show) return;

      const scrollY = window.scrollY;
      const body = document.body;
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

      // Snapshot styles to restore later
      const prev = {
        position: body.style.position,
        top: body.style.top,
        left: body.style.left,
        right: body.style.right,
        width: body.style.width,
        overflow: body.style.overflow,
        paddingRight: body.style.paddingRight,
      };

      // Lock: position fixed pins the page; top offset preserves visible scroll.
      // This is the only reliable way to stop iOS Safari from scrolling the background.
      body.style.position = 'fixed';
      body.style.top = `-${scrollY}px`;
      body.style.left = '0';
      body.style.right = '0';
      body.style.width = '100%';
      body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) {
        body.style.paddingRight = `${scrollbarWidth}px`;
      }

      return () => {
        body.style.position = prev.position;
        body.style.top = prev.top;
        body.style.left = prev.left;
        body.style.right = prev.right;
        body.style.width = prev.width;
        body.style.overflow = prev.overflow;
        body.style.paddingRight = prev.paddingRight;
        // Restore scroll position without smooth-scrolling
        window.scrollTo(0, scrollY);
      };
    }, [show]);
    ```

    3. Keep the existing `mounted` / `createPortal` logic and the memoized `content` JSX unchanged.

    4. Do not modify `ProjectsModal.tsx` — the fix is entirely in the shared `Modal`.

    Note: Using `position: fixed` + `top: -scrollY` is the well-known mobile-Safari-safe pattern (vs. just `overflow:hidden`, which iOS ignores). The cleanup is the return function of the effect so React handles fast toggles and unmounts correctly.
  </action>
  <verify>
    <automated>cd /Users/idea3c/conductor/workspaces/portfolio_brown/bucharest && npx tsc --noEmit -p tsconfig.json</automated>
  </verify>
  <done>
    - `src/components/common/Modal.tsx` no longer contains `disableOnScroll` or `document.body.addEventListener('scroll', ...)`.
    - The `useEffect` for `show` implements the position:fixed + top offset pattern with a cleanup return that restores styles and `window.scrollTo`.
    - `npx tsc --noEmit` passes with no new errors.
  </done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <name>Task 2: Verify background scroll lock on desktop and mobile</name>
  <what-built>
    Updated shared `Modal` component to lock background scroll using `position: fixed` + scroll-position preservation. This affects the project preview modal (`ProjectsModal`) opened from the Projects section.
  </what-built>
  <how-to-verify>
    Run the dev server: `npm run dev` and open the site at http://localhost:3000.

    Desktop checks (Chrome/Firefox/Safari at >=1024px width):
    1. Scroll down to the Projects section.
    2. Click a project image to open the preview modal.
    3. Try to scroll with mouse wheel, trackpad, arrow keys, Page Down, and spacebar — the background page MUST NOT move.
    4. Close the modal (X button). Verify the page is still scrolled to the same position (no jump to top, no visible content shift to the right).
    5. Confirm the page scrolls normally after close.

    Mobile checks (Chrome DevTools device toolbar AND a real iOS device if available):
    6. In DevTools, switch to an iPhone preset. Reload, scroll to Projects, open the modal.
    7. Touch-drag (simulated) on the dimmed background area — background MUST NOT scroll.
    8. Inside the modal, the carousel should still be swipeable / the modal content scrollable if it overflows.
    9. Close modal — scroll position preserved, page scrolls again normally.
    10. On a real iOS Safari device (if accessible): repeat steps 6–9. This is the critical platform that motivated the fix.

    Edge cases:
    11. Open modal, close it, immediately open it again — no styles left stuck (page still scrollable when modal closed).
    12. Open modal while page is scrolled near the very top (scrollY ~ 0) and near the bottom — restore works in both cases.
  </how-to-verify>
  <resume-signal>Type "approved" if all 12 checks pass, or describe which step failed and on what browser/device.</resume-signal>
</task>

</tasks>

<verification>
- TypeScript compiles cleanly (`npx tsc --noEmit`).
- Manual verification matrix in Task 2 all PASS.
- No regression in opening/closing the project image modal, including the carousel navigation.
</verification>

<success_criteria>
- Background page does not scroll while the project preview modal is open, on both desktop and mobile (including iOS Safari).
- Scroll position is preserved when the modal closes.
- No layout shift / horizontal jump on desktop when scrollbar disappears.
- No leftover inline styles on `<body>` after the modal closes.
</success_criteria>

<output>
After completion, create `.planning/quick/260522-rek-disable-background-scroll-when-project-p/260522-rek-SUMMARY.md` documenting:
- The single-file change in `src/components/common/Modal.tsx`
- Why `position: fixed` + top offset was chosen over `overflow: hidden`
- Verification matrix results from Task 2
</output>
