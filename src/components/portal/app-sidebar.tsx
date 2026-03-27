"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  Building2,
  ClipboardCheck,
  FileCheck2,
  LayoutDashboard,
  Settings2,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
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
  navItems: NavItem[];
  roleLabel: string;
};

export function AppSidebar({ navItems, roleLabel }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-full lg:w-80 lg:shrink-0">
      <div className="sticky top-6 rounded-[2rem] bg-slate-950 p-5 text-white shadow-2xl">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-white/10">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[0.7rem] uppercase tracking-[0.2em] text-slate-400">
              Creative Office Solutions
            </p>
            <h2 className="text-lg font-semibold">Training Portal</h2>
          </div>
        </div>

        <Badge className="mb-6 rounded-full bg-white/10 px-3 py-1 text-white hover:bg-white/10">
          {roleLabel}
        </Badge>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = iconMap[item.icon];
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                  active
                    ? "bg-white text-slate-950"
                    : "bg-white/5 text-white hover:bg-white/10",
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-300">
            Portal Status
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-100">
            Routed onboarding, role-aware dashboards, and shared progress tracking are live
            inside the app shell now.
          </p>
        </div>
      </div>
    </aside>
  );
}
