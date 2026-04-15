# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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
