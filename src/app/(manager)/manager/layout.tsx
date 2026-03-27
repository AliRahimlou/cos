import { AppShell } from "@/components/portal/app-shell";
import { requireSessionUser } from "@/lib/auth/session";

export default async function ManagerLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await requireSessionUser("manager");

  return (
    <AppShell
      user={user}
      title="COS Manager Dashboard"
      description="Review onboarding performance, support coaching conversations, manage access, and oversee learning across your team."
    >
      {children}
    </AppShell>
  );
}
