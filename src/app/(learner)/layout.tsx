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
      description="Complete your assigned COS learning path, track certification progress, and move through each lesson with clear next steps."
    >
      {children}
    </AppShell>
  );
}
