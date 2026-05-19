# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 12-rule

These rules apply to every task in this project unless explicitly overridden.
Bias: caution over speed on non-trivial work. Use judgment on trivial tasks.

### Rule 1 — Think Before Coding

State assumptions explicitly. If uncertain, ask rather than guess.
Present multiple interpretations when ambiguity exists.
Push back when a simpler approach exists.
Stop when confused. Name what's unclear.

### Rule 2 — Simplicity First

Minimum code that solves the problem. Nothing speculative.
No features beyond what was asked. No abstractions for single-use code.
Test: would a senior engineer say this is overcomplicated? If yes, simplify.

### Rule 3 — Surgical Changes

Touch only what you must. Clean up only your own mess.
Don't "improve" adjacent code, comments, or formatting.
Don't refactor what isn't broken. Match existing style.

### Rule 4 — Goal-Driven Execution

Define success criteria. Loop until verified.
Don't follow steps. Define success and iterate.
Strong success criteria let you loop independently.

### Rule 5 — Use the model only for judgment calls

Use me for: classification, drafting, summarization, extraction.
Do NOT use me for: routing, retries, deterministic transforms.
If code can answer, code answers.

### Rule 6 — Token budgets are not advisory

Per-task: 4,000 tokens. Per-session: 30,000 tokens.
If approaching budget, summarize and start fresh.
Surface the breach. Do not silently overrun.

### Rule 7 — Surface conflicts, don't average them

If two patterns contradict, pick one (more recent / more tested).
Explain why. Flag the other for cleanup.
Don't blend conflicting patterns.

### Rule 8 — Read before you write

Before adding code, read exports, immediate callers, shared utilities.
"Looks orthogonal" is dangerous. If unsure why code is structured a way, ask.

### Rule 9 — Tests verify intent, not just behavior

Tests must encode WHY behavior matters, not just WHAT it does.
A test that can't fail when business logic changes is wrong.

### Rule 10 — Checkpoint after every significant step

Summarize what was done, what's verified, what's left.
Don't continue from a state you can't describe back.
If you lose track, stop and restate.

### Rule 11 — Match the codebase's conventions, even if you disagree

Conformance > taste inside the codebase.
If you genuinely think a convention is harmful, surface it. Don't fork silently.

### Rule 12 — Fail loud

"Completed" is wrong if anything was skipped silently.
"Tests pass" is wrong if any were skipped.
Default to surfacing uncertainty, not hiding it.

## Commands

```bash
npm start          # Dev server at http://localhost:4200
npm run build      # Production build
npm test           # Unit tests (Vitest, watch mode)
npm run test:ci    # Unit tests (run once)
npm run test:gate  # Unit tests with coverage
npm run e2e        # Playwright e2e tests
npm run lint       # ESLint
npm run format     # Prettier auto-format
npm run check      # Prettier format check
```

**Run a single test file:**

```bash
npm test -- --run src/app/shared/components/atomic-button/atomic-button.spec.ts
```

## Architecture

Angular 21 app using standalone components, signals, and Angular Material. No NgModules.

**Routing:** Lazy-loaded feature routes defined in `src/app/app.routes.ts`. Includes a custom hover-based route preloading strategy (`HoverRoutePreloadDirective`).

**Structure:**

- `src/app/shared/components/` — Reusable atomic components (atomic-button, atomic-breadcrumb, atomic-link)
- `src/app/pages/` — Lazy-loaded showcase/feature pages
- `src/app/shared/directives/` — Custom directives
- `src/app/shared/preloading/` — Hover-based preloading strategy and state service

**File conventions:**

- Components omit the `.component` segment: `atomic-button.ts`, not `atomic-button.component.ts`
- Exported types live in a sibling `.types.ts` file (e.g., `atomic-button.types.ts`)
- Utility/helper logic lives in a sibling `.utils.ts` file (e.g., `atomic-link.utils.ts`)
- To enable hover preloading on a route, add `data: { preloadOnHover: true, preloadKey: '<name>' }` to its route definition

## Angular Coding Conventions

These apply to all components and services:

- **Standalone components only** — no NgModules
- **`input()` / `output()`** signals instead of `@Input` / `@Output` decorators
- **`inject()`** for DI instead of constructor parameters
- **`computed()`** for derived state
- **`ChangeDetectionStrategy.OnPush`** on every component
- **Native control flow** (`@if`, `@for`, `@switch`) — not `*ngIf`, `*ngFor`
- **`host` object** instead of `@HostBinding` / `@HostListener`
- **Class/style bindings** instead of `ngClass` / `ngStyle`
- **Reactive forms** over template-driven forms
- **`providedIn: 'root'`** for singleton services

## Accessibility

All components must pass AXE checks and meet WCAG AA. Use semantic HTML (`nav`, `ol`, `li`, `button`, `a`) and proper ARIA attributes.

## Testing Patterns

Tests use Vitest with Angular TestBed. Standard structure:

```typescript
const setup = async () => {
  await TestBed.configureTestingModule({
    imports: [ComponentUnderTest],
    providers: [provideRouter([])],
  }).compileComponents();
  const fixture = TestBed.createComponent(ComponentUnderTest);
  return { fixture, component: fixture.componentInstance };
};
```

Use host components (via `@Component`) to test content projection. Coverage thresholds: 95% lines/statements/functions, 80% branches.
