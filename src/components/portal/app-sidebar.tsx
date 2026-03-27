"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import {
  BarChart3,
  BookOpen,
  Building2,
  ClipboardCheck,
  FileCheck2,
  LayoutDashboard,
  PanelLeftClose,
  PanelLeftOpen,
  Settings2,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  SIDEBAR_CHANGE_EVENT,
  SIDEBAR_COOKIE_NAME,
  SIDEBAR_STORAGE_KEY,
  parseSidebarCollapsed,
} from "@/lib/portal/sidebar";
import { cn } from "@/lib/utils";

import type { NavItem } from "@/lib/portal/navigation";

const iconMap = {
  dashboard: LayoutDashboard,
  training: BookOpen,
  quizzes: ClipboardCheck,
  results: FileCheck2,
  analytics: BarChart3,
  team: Users,
  users: Users,
  content: Settings2,
} as const;

type AppSidebarProps = {
  initialCollapsed: boolean;
  navItems: NavItem[];
  roleLabel: string;
};

function readSidebarCollapsed(fallbackCollapsed: boolean) {
  if (typeof window === "undefined") {
    return fallbackCollapsed;
  }

  const stored = window.localStorage.getItem(SIDEBAR_STORAGE_KEY);
  return stored === null ? fallbackCollapsed : parseSidebarCollapsed(stored);
}

function subscribeSidebarPreference(callback: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleChange = () => callback();
  window.addEventListener("storage", handleChange);
  window.addEventListener(SIDEBAR_CHANGE_EVENT, handleChange);

  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(SIDEBAR_CHANGE_EVENT, handleChange);
  };
}

export function AppSidebar({
  initialCollapsed,
  navItems,
  roleLabel,
}: AppSidebarProps) {
  const pathname = usePathname();
  const collapsed = useSyncExternalStore(
    subscribeSidebarPreference,
    () => readSidebarCollapsed(initialCollapsed),
    () => initialCollapsed,
  );

  function toggleCollapsed() {
    const nextValue = !collapsed;
    window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(nextValue));
    document.cookie = `${SIDEBAR_COOKIE_NAME}=${nextValue}; path=/; max-age=31536000; samesite=lax`;
    window.dispatchEvent(new Event(SIDEBAR_CHANGE_EVENT));
  }

  return (
    <aside className={cn("w-full lg:shrink-0", collapsed ? "lg:w-24" : "lg:w-80")}>
      <div className="glass-surface-strong relative sticky top-6 overflow-hidden rounded-[2rem] p-5 text-foreground transition-all duration-300">
        <div className="pointer-events-none absolute inset-0 rounded-[2rem] glass-highlight" />

        <div className={cn("relative mb-8 flex items-center", collapsed ? "justify-center" : "gap-3")}>
          <div className="flex h-12 w-12 items-center justify-center rounded-3xl border border-[var(--glass-border)] bg-foreground/10">
            <Building2 className="h-6 w-6" />
          </div>
          {!collapsed ? (
            <div>
              <p className="text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">
                Creative Office Solutions
              </p>
              <h2 className="text-lg font-semibold">Training Portal</h2>
            </div>
          ) : null}
        </div>

        <div className={cn("relative mb-6 flex items-center", collapsed ? "justify-center" : "justify-between gap-3")}>
          {!collapsed ? (
            <Badge className="rounded-full border border-[var(--glass-border)] bg-foreground/10 px-3 py-1 text-foreground hover:bg-foreground/15">
              {roleLabel}
            </Badge>
          ) : null}
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={toggleCollapsed}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="rounded-2xl border-[var(--glass-border)] bg-foreground/5 text-foreground hover:bg-foreground/10 hover:text-foreground"
          >
            {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </Button>
        </div>

        <nav className="relative space-y-2">
          {navItems.map((item) => {
            const Icon = iconMap[item.icon];
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center rounded-2xl px-4 py-3 text-sm font-medium transition",
                  collapsed ? "justify-center" : "gap-3",
                  active
                    ? "bg-foreground text-background"
                    : "bg-foreground/5 text-foreground hover:bg-foreground/10",
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="h-4 w-4" />
                {!collapsed ? <span>{item.label}</span> : null}
              </Link>
            );
          })}
        </nav>

        {!collapsed ? (
          <div className="relative mt-8 rounded-3xl border border-[var(--glass-border)] bg-foreground/5 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
              COS Platform
            </p>
            <p className="mt-2 text-sm leading-6 text-foreground/80">
              Onboarding, certifications, team reporting, and program management live in one COS
              learning experience.
            </p>
          </div>
        ) : null}
      </div>
    </aside>
  );
}
