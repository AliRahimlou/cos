# Onboarding Preservation Audit

## Audit Context

- Date: 2026-03-27
- Repo: `/Users/alirahimlou/myapps/cos`
- Safety branch: `preserve-pptx-onboarding-audit`
- Package manager: `npm`
- Framework: Next.js 16.2.1 App Router
- Reference deck: `/Users/alirahimlou/myapps/cos/Sales Rep Onboarding Training Deck.pptx`
- UX / IA reference: `cos_training_portal.jsx`

## Safety and Recovery Findings

The repo was audited before additional implementation work:

- `git status --short`: clean before this pass
- `git branch --show-current`: `main`
- `git log --oneline --decorate --graph -n 30`: most relevant prior commits were `954fd85` and `5a05e8f`
- `git diff --name-status 5a05e8f..HEAD`: showed additions plus a root-page redirect change, but no deleted PPTX-derived files

Actions taken:

1. Created safety branch `preserve-pptx-onboarding-audit`
2. Audited git history for deleted or replaced PPTX-derived assets
3. Confirmed the onboarding content layer was added previously rather than overwritten
4. Extended the app shell, auth, manager controls, and multi-program support around the preserved content instead of replacing it

Recovery result:

- No PPTX-derived files required restoration from git history
- No hard reset or destructive recovery was used
- Protected content IDs and `sourceSlides` metadata were preserved

## Protected Asset Inventory

### `PROTECTED_EXISTING`

These files are treated as source-of-truth onboarding assets and were preserved untouched during this pass:

- `scripts/extract_sales_rep_onboarding.py`
- `src/content/onboarding/sales-rep/course.ts`
- `src/content/onboarding/sales-rep/source/deck-extraction.json`
- `public/onboarding/sales-rep/deck-assets/*`
- `src/lib/onboarding/types.ts`
- `src/lib/onboarding/progress.ts`
- `src/lib/onboarding/progress-store.ts`
- `src/components/onboarding/*`
- `docs/sales-rep-onboarding-extraction.md`

### `SAFE_TO_EXTEND`

These files form the application shell and integration layer around the preserved course content:

- `src/app/page.tsx`
- `src/app/layout.tsx`
- `src/app/onboarding/sales-rep/page.tsx`
- `src/app/actions/auth.ts`
- `src/app/actions/onboarding.ts`
- `src/app/actions/manager.ts`
- `src/app/(learner)/*`
- `src/app/(manager)/manager/*`
- `src/components/portal/*`
- `src/lib/auth/*`
- `src/lib/portal/*`

### `NEW_FILE_OK`

These files were added to support preservation-safe extensibility and UI upgrades:

- `src/content/onboarding/program-registry.ts`
- `src/components/portal/theme-toggle.tsx`
- `src/components/portal/metric-ring.tsx`
- `src/components/portal/completion-celebration.tsx`
- `docs/onboarding-preservation-audit.md`
- `docs/onboarding-content-preservation-map.md`

### `POSSIBLY_OVERWRITTEN`

- None confirmed after git history audit

## Exact Root Cause of the Modules-Only Behavior

The modules-only behavior came from routing, not from missing data:

1. `src/app/page.tsx` redirected `/` straight to `/onboarding/sales-rep`
2. `src/app/onboarding/sales-rep/page.tsx` was the only routed product surface
3. `cos_training_portal.jsx` contained `LoginView`, `DashboardHome`, `TrainingView`, `QuizzesView`, `AnalyticsView`, and `TeamView`, but only as local-state demo UI that was never ported into the App Router

So the learner always landed in training because:

- the root route was hardcoded to the training path
- no login route existed
- no learner dashboard route existed
- no manager route tree existed
- the mockup sidebar was not bound to the router

## Route Map

### Before

- `/` -> hard redirect to `/onboarding/sales-rep`
- `/onboarding/sales-rep` -> standalone modules/lessons/quizzes experience

### After

- `/` -> role-aware redirect to `/login`, `/dashboard`, or `/manager`
- `/login`
- `/dashboard`
- `/training`
- `/training/[moduleId]`
- `/training/[moduleId]/lessons/[lessonId]`
- `/quizzes`
- `/quizzes/[moduleId]`
- `/assessment/final`
- `/results`
- `/manager`
- `/manager/team`
- `/manager/analytics`
- `/manager/users`
- `/manager/content`
- `/onboarding/sales-rep` -> legacy compatibility redirect into the routed portal

## Current Layout and Guard Stack

- Root layout: `src/app/layout.tsx`
  - theme bootstrap script
  - global design tokens and motion styles
- Learner layout: `src/app/(learner)/layout.tsx`
  - server auth check
  - learner shell
- Manager layout: `src/app/(manager)/manager/layout.tsx`
  - server auth check
  - manager shell
- Edge request guard: `src/proxy.ts`
  - redirects unauthenticated users to `/login`
  - redirects learners away from manager routes
  - redirects managers away from learner-only routes where needed

## Auth and Role Model

- Signed cookie auth via:
  - `src/lib/auth/token.ts`
  - `src/lib/auth/session.ts`
  - `src/lib/auth/access.ts`
- Supported roles:
  - `learner`
  - `manager`
- Demo accounts are seeded via `src/lib/portal/store.ts`
- Home redirects are role aware
- Server actions require manager role for management surfaces

## Persistence Model

- Shared server-side persistence is implemented in `src/lib/portal/store.ts`
- Runtime backing store: `data/onboarding-state.json`
- The JSON file is runtime-generated and ignored from git so the seed logic remains authoritative
- The portal store now supports:
  - users
  - active program per user
  - enrollments by course
  - lesson completion
  - module and final attempts
  - lock states
  - manager completion overrides
  - manager-created programs
  - manager-created module extensions

## How The Mockup Was Used Without Replacing The Deck Work

`cos_training_portal.jsx` was treated as an IA and visual reference, not as a source of business data.

What was taken from the mockup:

- login surface concept
- sidebar navigation model
- learner dashboard idea
- manager analytics/team console idea
- card-based visual rhythm

What was not taken from the mockup:

- module content
- question content
- progress/scoring semantics
- slide mappings
- course IDs

Those stayed tied to the preserved PPTX-derived data layer.

## Changes Applied In This Pass

### Preserved

- Sales deck extraction artifacts
- Sales course structure, lesson IDs, module IDs, quiz IDs, and final assessment IDs
- Existing scoring logic and `sourceSlides` traceability
- Existing learner-facing content renderer components

### Extended

- Multi-program registry around the protected sales program
- Role-aware routed app shell
- Manager controls for assignments, locks, resets, completion overrides, and active-program switching
- Manager content controls for creating departments/programs and adding modules as overlays
- Learner dashboard and results surfaces
- Collapsible sidebar, theme toggle, metric rings, and completion celebration

## Exact Files Modified or Added

### Extended existing files

- `src/app/page.tsx`
- `src/app/layout.tsx`
- `src/app/onboarding/sales-rep/page.tsx`
- `src/app/actions/onboarding.ts`
- `src/app/actions/manager.ts`
- `src/app/(learner)/*`
- `src/app/(manager)/manager/*`
- `src/components/portal/app-shell.tsx`
- `src/components/portal/app-sidebar.tsx`
- `src/components/portal/login-form.tsx`
- `src/components/portal/lesson-screen.tsx`
- `src/components/portal/assessment-screen.tsx`
- `src/lib/portal/store.ts`
- `src/lib/portal/types.ts`
- `src/lib/portal/loaders.ts`
- `src/lib/portal/metrics.ts`

### New files added in this pass

- `src/content/onboarding/program-registry.ts`
- `src/components/portal/theme-toggle.tsx`
- `src/components/portal/metric-ring.tsx`
- `src/components/portal/completion-celebration.tsx`
- `docs/onboarding-preservation-audit.md`
- `docs/onboarding-content-preservation-map.md`

## Validation Commands

- `git status --short`
- `git branch --show-current`
- `git log --oneline --decorate --graph -n 30`
- `git diff --name-status 5a05e8f..HEAD`
- `npm run lint`
- `npm test`
- `npm run build`

## Final Preservation Verdict

The existing PPTX-derived onboarding layer was preserved. The missing auth, dashboard, routing, manager, and multi-department capabilities were added around it. No protected source content needed to be rebuilt or restored, and the app no longer defaults to a modules-only entrypoint.
