import { AppShell } from "@/components/portal/app-shell";
import { requireSessionUser } from "@/lib/auth/session";

export default async function LearnerLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await requireSessionUser("learner");

  return (
    <AppShell
      user={user}
      title="Sales Rep Onboarding"
      description="Move through the COS onboarding program from your dashboard, finish lessons in sequence, and track quiz and final assessment performance in one routed learner workspace."
    >
      {children}
    </AppShell>
  );
}
