import type { UserRole } from "@/lib/auth/types";

export type NavItem = {
  href: string;
  label: string;
  icon:
    | "dashboard"
    | "training"
    | "quizzes"
    | "results"
    | "analytics"
    | "team"
    | "users"
    | "content";
};

const learnerNav: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/training", label: "Training", icon: "training" },
  { href: "/quizzes", label: "Quizzes", icon: "quizzes" },
  { href: "/assessment/final", label: "Final Test", icon: "quizzes" },
  { href: "/results", label: "Results", icon: "results" },
];

const managerNav: NavItem[] = [
  { href: "/manager", label: "Dashboard", icon: "dashboard" },
  { href: "/manager/team", label: "Team", icon: "team" },
  { href: "/manager/analytics", label: "Analytics", icon: "analytics" },
  { href: "/manager/users", label: "Users", icon: "users" },
  { href: "/manager/content", label: "Content", icon: "content" },
];

export function getNavItems(role: UserRole) {
  return role === "manager" ? managerNav : learnerNav;
}
