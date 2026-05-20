# CLAUDE.md — Workflow Protocol

## Permissions Policy

- **Research and Plan phases:** All file reads are pre-approved — do not ask for permission to read any file.
- **Write and Test phases:** All tool executions are pre-approved (reads, writes, builds, file/folder access, server commands) — do not ask for permission for any tool call, just execute.
- **When phases are skipped or combined**, apply the most permissive policy of the skipped phases — never pause to ask for permission.

## Before Any Work

- **Always read `.claude/rules/LESSON.md`** (if it exists) before starting any phase below. Learn from past mistakes.

## Workflow Phases

### 1. Research

- Deeply explore the codebase with precision — understand the relevant files, patterns, utilities, and architecture.
- Draft findings and a preliminary plan.
- **Do NOT implement anything.**
- **After research, write findings to `.claude/[YYYY-MM-DD]/task[number].md`** (e.g., `.claude/2026-03-18/task1.md`). **Exactly one file per issue or feature** — do not combine multiple issues into a single task file. All task files live under the `.claude/` folder.
- The user may edit these files during the research phase — **re-read them before proceeding** to pick up any corrections or guidance.
- **When there are multiple possible solutions, list them with numbered options** (e.g., 1, 2, 3) for easier reference and discussion.

### 2. Plan

- Provide a detailed execution plan for the feature or bug fix.
- Include files to modify, functions to reuse, and a verification strategy.
- **Do NOT implement anything.**
- **Update the task file for each item** to record its current phase (e.g., `phase: plan`).
- **When there are multiple approaches or alternatives, list them with numbered options** (e.g., 1, 2, 3) for easier reference and discussion.

### 3. Write

- Implement **only when explicitly told to proceed**.
- When implementing, do not ask for permissions on read, write, build, file/folder access, or any other tool execution — just do it.
- After implementation, verify with appropriate tests (unit, integration, or e2e).
- Run tests and confirm they pass before reporting.
- **Update the task file for each item** to record its current phase (e.g., `phase: write` → `phase: done`).
- **Use subagents for parallelizable work:** When the implementation can be split into independent units (e.g. separate components on the frontend, or controller / service / entity / queue on the backend), spawn multiple subagents to work on them simultaneously. Collect and merge their outputs before moving to the Test phase.

### 4. Test

- Pull up the relevant test skills before testing.
- Check if a dev server is already running. If it is, **kill it** and spawn your own.
- After testing is complete, **always shut down the dev server**.
- **Before running any test, write out all test cases first** in the task file. List every case to be verified (e.g., TC-1, TC-2, ...) with a brief description.
- **Then test against each case** and record results in a table or checklist:
  - Case ID, description, result (PASS/FAIL)
  - For failures: what failed, the fix applied, retry result
  - Continue until all cases pass
- The task file must show the **complete test matrix**: all cases vs. results, retries, and fixes — not just a summary.
- **Post-test code review via subagent:** Once all test cases pass, spawn a subagent to perform a code review of every file changed in this task. If the subagent finds errors or issues, the main agent must fix them and re-run the full test phase before proceeding to Report.

### 5. Report

- Draft a summary of what was implemented, files changed, and test results.

## Mistake Tracking

If a mistake is flagged during any phase, **immediately write it to `.claude/rules/LESSON.md`**. Include:

- What went wrong
- Why it happened
- How to avoid it next time

`.claude/rules/LESSON.md` is read at the start of every phase to prevent repeated mistakes.

## Post-completion corrections

When a task is marked "done" but the user asks for changes and says things like "remember this", "add to memory", or similar — save the correction to **both** memory (feedback type) **and** `.claude/rules/LESSON.md`. These are patterns that were missed during implementation and must be captured as lessons to prevent repeating the same mistake.
