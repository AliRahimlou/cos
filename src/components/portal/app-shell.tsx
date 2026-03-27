import { cookies } from "next/headers";
import { BellDot } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { AppSidebar } from "@/components/portal/app-sidebar";
import { LogoutForm } from "@/components/portal/logout-form";
import { ThemeToggle } from "@/components/portal/theme-toggle";
import { getNavItems } from "@/lib/portal/navigation";
import { SIDEBAR_COOKIE_NAME, parseSidebarCollapsed } from "@/lib/portal/sidebar";
import { THEME_COOKIE_NAME, parsePortalTheme } from "@/lib/portal/theme";
import type { SessionUser } from "@/lib/auth/types";

type AppShellProps = {
  user: SessionUser;
  title: string;
  description: string;
  children: React.ReactNode;
};

export async function AppShell({ user, title, description, children }: AppShellProps) {
  const cookieStore = await cookies();
  const navItems = getNavItems(user.role);
  const initialTheme = parsePortalTheme(cookieStore.get(THEME_COOKIE_NAME)?.value);
  const initialCollapsed = parseSidebarCollapsed(cookieStore.get(SIDEBAR_COOKIE_NAME)?.value);

  return (
    <div className="min-h-screen bg-background px-4 py-4 md:px-6 md:py-6">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-6 lg:flex-row">
        <AppSidebar
          initialCollapsed={initialCollapsed}
          navItems={navItems}
          roleLabel={user.role === "manager" ? "Team Dashboard" : "Learning Portal"}
        />

        <div className="min-w-0 flex-1">
          <header className="glass-surface-strong relative mb-6 overflow-hidden rounded-[2rem] p-5">
            <div className="pointer-events-none absolute inset-0 glass-highlight" />
            <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-2">
                <Badge variant="secondary" className="rounded-full px-3 py-1">
                  {user.department}
                </Badge>
                <div>
                  <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                    {title}
                  </h1>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                    {description}
                  </p>
                </div>
              </div>

              <div className="glass-surface flex flex-col gap-3 rounded-[1.5rem] p-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-foreground text-background">
                    <BellDot className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{user.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {user.title} · {user.email}
                    </p>
                  </div>
                </div>
                <ThemeToggle initialTheme={initialTheme} />
                <LogoutForm />
              </div>
            </div>
          </header>

          <main className="space-y-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
