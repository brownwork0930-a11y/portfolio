---
phase: quick-260522-rek
plan: 01
subsystem: modal/scroll-lock
tags: [modal, scroll-lock, ios-safari, ux, bug-fix]
dependency_graph:
  requires: []
  provides: [cross-platform-scroll-lock]
  affects: [src/components/common/Modal.tsx, ProjectsModal]
tech_stack:
  added: []
  patterns: [position-fixed-scroll-lock]
key_files:
  created: []
  modified:
    - src/components/common/Modal.tsx
decisions:
  - Use position:fixed + top:-scrollY instead of overflow:hidden for iOS Safari compatibility
  - Snapshot and restore all mutated body styles in effect cleanup for correctness on fast toggles
metrics:
  duration: "~10 minutes"
  completed: "2026-05-22T11:50:02Z"
  tasks_completed: 1
  tasks_total: 1
  files_changed: 1
---

# Phase quick-260522-rek Plan 01: Disable Background Scroll When Project Preview Modal Opens

## One-liner

Replaced broken `overflow:hidden` + non-firing scroll listener with a `position:fixed` + `top:-scrollY` body lock pattern that reliably prevents background scroll on desktop and iOS Safari, with full style restoration and scroll-position preservation on close.

## What Was Built

A single-file fix in `src/components/common/Modal.tsx` that replaces the existing (non-functional) scroll-lock implementation with the cross-platform standard approach.

## Why `position:fixed` + top offset vs `overflow:hidden`

iOS Safari ignores `overflow:hidden` on `<body>` — the page behind a modal remains scrollable via touch-drag. The only reliable cross-platform fix is:

1. Capture `window.scrollY` before locking.
2. Set `body.style.position = 'fixed'` with `top = -${scrollY}px`. This pins the document at its current visible position and completely prevents any scrolling (desktop mouse wheel, keyboard, and iOS touch-drag all stopped).
3. In the cleanup return of the `useEffect`, restore all snapshotted body styles and call `window.scrollTo(0, scrollY)` to put the page back at the same position without a visible jump.

Scrollbar-width compensation (`paddingRight = scrollbarWidth`) is also applied on open so that the layout does not shift horizontally when the scrollbar disappears on desktop.

## Files Changed

| File | Change |
|------|--------|
| `src/components/common/Modal.tsx` | Replaced broken scroll-lock with position:fixed pattern |

## Removed (broken code)

- `disableOnScroll` function — the `scroll` event does not bubble to `document.body`, so the listener never fired.
- `document.body.addEventListener('scroll', disableOnScroll, { passive: false })` — dead code removed.
- Naive `overflowY = 'hidden' / 'auto'` toggle — ineffective on iOS Safari.

## Commits

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Replace Modal scroll-lock with cross-platform implementation | `1b85d93` | `src/components/common/Modal.tsx` |

## Verification

### Automated

- `npx tsc --noEmit` — PASS (no new TypeScript errors)

### Manual (checkpoint:human-verify — skipped per executor constraints)

The human will verify the following cases on the deployed site:

| Check | Description |
|-------|-------------|
| 1 | Desktop: scroll wheel/trackpad/keyboard does not move background while modal open |
| 2 | Desktop: close modal — page stays at same scroll position |
| 3 | Desktop: no horizontal layout shift when modal opens/closes |
| 4 | Desktop: page scrolls normally after close |
| 5 | Mobile (DevTools): touch-drag on dim background does not scroll page |
| 6 | Mobile: modal content still scrollable/swipeable inside |
| 7 | Mobile: close modal — scroll position preserved |
| 8 | iOS Safari (real device): touch-drag background blocked |
| 9 | Edge: rapid open/close leaves no stuck styles |
| 10 | Edge: works correctly when opened near scrollY=0 and near bottom |

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None.

## Self-Check: PASSED

- `src/components/common/Modal.tsx` — FOUND, modified
- Commit `1b85d93` — FOUND
- `disableOnScroll` removed — confirmed (grep returns nothing)
- `position:fixed` pattern present — confirmed
