import { AppShell } from "@/components/portal/app-shell";
import { requireSessionUser } from "@/lib/auth/session";

export default async function ManagerLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await requireSessionUser("manager");

  return (
    <AppShell
      user={user}
      title="Manager Console"
      description="Review learner progress, identify coaching needs, control assignments and attempts, and inspect the course content map that now powers the onboarding app."
    >
      {children}
    </AppShell>
  );
}
