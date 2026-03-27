# Onboarding App Audit

## Audit Date

- Date: 2026-03-27
- Repo: `/Users/alirahimlou/myapps/cos`
- Framework: Next.js 16.2.1
- Package manager: `npm`

## 1. Current Route Map

Current filesystem routes before this remediation:

- `/`
  Source: `src/app/page.tsx`
  Behavior: unconditional redirect to `/onboarding/sales-rep`
- `/onboarding/sales-rep`
  Source: `src/app/onboarding/sales-rep/page.tsx`
  Behavior: renders the standalone sales onboarding course experience

There are no routed pages for:

- `/login`
- `/dashboard`
- `/training`
- `/quizzes`
- `/assessment/final`
- `/results`
- `/manager`
- `/manager/team`
- `/manager/analytics`
- `/manager/users`

## 2. Current Layout / Provider Stack

- Root layout only: `src/app/layout.tsx`
- No route-group layouts
- No auth/session provider
- No persistence provider
- No role-aware shell
- No route-aware sidebar/header shell

The app currently renders each page directly inside the root layout body without a dashboard shell or protected sections.

## 3. Existing Auth and Role Model

- No auth stack exists
- No login route exists
- No session/cookie handling exists
- No role model exists
- No route protection exists
- No middleware/proxy exists

Result:

- The app cannot distinguish learner vs manager
- There is no post-login routing because there is no login flow
- Manager-only areas do not exist in the routed app

## 4. Existing Training / Content Structures

Existing usable onboarding infrastructure is present:

- PPTX extraction artifact:
  `src/content/onboarding/sales-rep/source/deck-extraction.json`
- Curated course model:
  `src/content/onboarding/sales-rep/course.ts`
- Course types:
  `src/lib/onboarding/types.ts`
- Scoring and progress helpers:
  `src/lib/onboarding/progress.ts`
- Local progress storage wrapper:
  `src/lib/onboarding/progress-store.ts`
- Onboarding UI components:
  `src/components/onboarding/*`

This means the repo already has:

- structured lessons
- knowledge checks
- module quizzes
- final assessment
- source slide traceability

What it does not yet have:

- real app routing around that content
- learner dashboard
- manager dashboard
- auth
- shared persistence across users
- manager analytics and controls

## 5. Current Dashboard / Quiz / Manager Code

There is no routed dashboard or manager implementation in `src/app`.

There is, however, a mockup file in the workspace:

- `cos_training_portal.jsx`

That file contains the intended IA and UX concepts:

- `LoginView`
- `DashboardHome`
- `TrainingView`
- `QuizzesView`
- `AnalyticsView`
- `TeamView`
- sidebar navigation with:
  - dashboard
  - training
  - quizzes
  - analytics
  - team

Important finding:

- This mockup is local-state driven and not connected to the App Router.
- It was not ported into real routes.
- It appears to be a design/vision mockup, not a partially wired app.

## 6. Exact Root Cause of the “Only Modules Page Is Visible” Behavior

The modules-only behavior is caused by three concrete implementation facts:

1. `src/app/page.tsx` hard redirects every visit to `/onboarding/sales-rep`.
2. `/onboarding/sales-rep` is the only functional routed screen besides `/`.
3. The intended login/dashboard/analytics/team experience exists only inside `cos_training_portal.jsx` as component-local state and was never converted into route-based pages.

This is not a styling bug or a hidden dashboard.

It is a routing and app-architecture issue:

- root landing is hardcoded to the training route
- no real dashboards exist in the route tree
- no auth or role routing exists
- the mockup nav is not connected to the router

## 7. Gap Analysis: Current App vs Intended Onboarding Platform

Current app:

- single onboarding route
- standalone course page
- local-device progress only
- no login
- no user model
- no manager tools

Target app:

- public login
- learner dashboard
- training overview
- lesson routes
- quizzes routes
- final assessment route
- results route
- manager dashboard
- team and analytics routes
- user controls and progress oversight
- shared persistence
- role-based access and redirects

## 8. Recommended Route Map

Recommended App Router structure for this repo:

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

Recommended route groups:

- `src/app/(public)/...`
- `src/app/(learner)/...`
- `src/app/(manager)/manager/...`

Recommended root behavior:

- unauthenticated user visiting `/` -> redirect to `/login`
- authenticated learner visiting `/` -> redirect to `/dashboard`
- authenticated manager visiting `/` -> redirect to `/manager`

## 9. Recommended Access-Control Model

Because the repo currently has no auth stack, the pragmatic implementation path is:

- add a minimal signed-cookie session layer
- add a `proxy.ts` request guard for top-level route gating
- keep authorization checks in server utilities and server actions
- support two roles:
  - `learner`
  - `manager`

## 10. Recommended Persistence Model

The current `localStorage` course store is not enough for manager analytics because manager views need shared, cross-user data.

Recommended persistence for the current repo size:

- add a server-side persistence abstraction
- back it with a local JSON file for development/local deployment
- keep the store isolated so it can later be swapped to a database without rewriting the UI

Persist at minimum:

- users
- roles
- assignments
- lesson completion
- assessment attempts
- scores
- progress percentage inputs
- manager overrides and lock states

## 11. Exact Files To Modify

These existing files need to change:

- `src/app/page.tsx`
- `src/app/onboarding/sales-rep/page.tsx`
- `src/app/layout.tsx`
- `src/lib/onboarding/types.ts`
- `src/lib/onboarding/progress.ts`
- `src/lib/onboarding/progress.test.ts`
- `docs/sales-rep-onboarding-extraction.md`

## 12. Exact Files To Add

Planned additions for the full onboarding platform:

- `src/proxy.ts`
- `src/app/(public)/login/page.tsx`
- `src/app/(learner)/layout.tsx`
- `src/app/(learner)/dashboard/page.tsx`
- `src/app/(learner)/training/page.tsx`
- `src/app/(learner)/training/[moduleId]/page.tsx`
- `src/app/(learner)/training/[moduleId]/lessons/[lessonId]/page.tsx`
- `src/app/(learner)/quizzes/page.tsx`
- `src/app/(learner)/quizzes/[moduleId]/page.tsx`
- `src/app/(learner)/assessment/final/page.tsx`
- `src/app/(learner)/results/page.tsx`
- `src/app/(manager)/manager/layout.tsx`
- `src/app/(manager)/manager/page.tsx`
- `src/app/(manager)/manager/team/page.tsx`
- `src/app/(manager)/manager/analytics/page.tsx`
- `src/app/(manager)/manager/users/page.tsx`
- `src/app/(manager)/manager/content/page.tsx`
- `src/app/actions/auth.ts`
- `src/app/actions/onboarding.ts`
- `src/app/actions/manager.ts`
- `src/components/portal/*`
- `src/lib/auth/*`
- `src/lib/portal/*`
- `data/onboarding-state.json`
- `docs/onboarding-content-map.md`

## 13. Audit Conclusion

The missing dashboard/login/manager experience is not hidden elsewhere in the app. The current app only exposes the training flow because the root route is explicitly redirected there and the intended UX exists only in a disconnected mockup file.

The remediation should therefore:

- replace the root redirect with role-aware landing logic
- add real auth and role checks
- add route-based learner and manager shells
- move the sales onboarding content into that routed shell
- replace local-only course persistence with shared server-side persistence
