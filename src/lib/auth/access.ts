import type { UserRole } from "./types";

const LEARNER_PREFIXES = [
  "/dashboard",
  "/training",
  "/quizzes",
  "/assessment",
  "/results",
  "/onboarding/sales-rep",
] as const;

const MANAGER_PREFIXES = ["/manager"] as const;

function matchesPrefix(pathname: string, prefixes: readonly string[]) {
  return prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function getHomeRouteForRole(role: UserRole) {
  return role === "manager" ? "/manager" : "/dashboard";
}

export function isLearnerRoute(pathname: string) {
  return matchesPrefix(pathname, LEARNER_PREFIXES);
}

export function isManagerRoute(pathname: string) {
  return matchesPrefix(pathname, MANAGER_PREFIXES);
}

export function resolveProtectedRedirect(pathname: string, role: UserRole | null) {
  if (pathname === "/login") {
    return role ? getHomeRouteForRole(role) : null;
  }

  if (!role && (isLearnerRoute(pathname) || isManagerRoute(pathname))) {
    return "/login";
  }

  if (role === "learner" && isManagerRoute(pathname)) {
    return "/dashboard";
  }

  if (role === "manager" && isLearnerRoute(pathname)) {
    return "/manager";
  }

  return null;
}
