import { BellDot } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { AppSidebar } from "@/components/portal/app-sidebar";
import { LogoutForm } from "@/components/portal/logout-form";
import { getNavItems } from "@/lib/portal/navigation";
import type { SessionUser } from "@/lib/auth/types";

type AppShellProps = {
  user: SessionUser;
  title: string;
  description: string;
  children: React.ReactNode;
};

export function AppShell({ user, title, description, children }: AppShellProps) {
  const navItems = getNavItems(user.role);

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-4 md:px-6 md:py-6">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-6 lg:flex-row">
        <AppSidebar
          navItems={navItems}
          roleLabel={user.role === "manager" ? "Manager Console" : "Learner Workspace"}
        />

        <div className="min-w-0 flex-1">
          <header className="mb-6 rounded-[2rem] border border-white/70 bg-white/90 p-5 shadow-sm backdrop-blur">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-2">
                <Badge variant="secondary" className="rounded-full px-3 py-1">
                  {user.department}
                </Badge>
                <div>
                  <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
                    {title}
                  </h1>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                    {description}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
                    <BellDot className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-950">{user.name}</p>
                    <p className="text-sm text-slate-500">
                      {user.title} · {user.email}
                    </p>
                  </div>
                </div>
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
