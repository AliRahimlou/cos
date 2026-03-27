import Link from "next/link";
import { ArrowRight, PlayCircle, TrendingUp } from "lucide-react";

import { MetricRing } from "@/components/portal/metric-ring";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button-variants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { requireSessionUser } from "@/lib/auth/session";
import { getLearnerContext } from "@/lib/portal/loaders";
import { cn } from "@/lib/utils";

export default async function DashboardPage() {
  const sessionUser = await requireSessionUser("learner");
  const context = await getLearnerContext(sessionUser.id);

  if (!context) {
    return null;
  }

  const { course, summary } = context;
  const nextModule = summary.modules.find((module) => !module.completed) ?? summary.modules[0];

  if (!summary.assigned || !summary.enrollment) {
    return (
      <Card className="rounded-[2rem]">
        <CardHeader>
          <CardTitle>No onboarding assignment yet</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-6 text-muted-foreground">
          <p>
            Your learner account is active, but no onboarding program is currently assigned. A
            manager can assign one from the Users screen.
          </p>
          <Link
            href="/results"
            className={cn(buttonVariants({ variant: "outline" }), "rounded-2xl")}
          >
            View current status
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <Card className="glass-surface-strong relative overflow-hidden rounded-[2rem] shadow-[var(--glass-shadow-lg)]">
          <div className="pointer-events-none absolute inset-0 glass-highlight" />
          <CardContent className="relative space-y-6 p-7">
            <div>
              <p className="text-sm text-muted-foreground">Welcome back</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
                {summary.courseTitle}
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
                Continue the {summary.courseDepartment} onboarding path, keep quiz performance on
                track, and move through the preserved content model in a routed learning flow.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <MetricRing
                value={summary.completionPercent}
                label="Completion"
                helper={`${summary.completedModules} of ${summary.totalModules} modules complete`}
              />
              <MetricRing
                value={summary.quizAverage ?? 0}
                label="Quiz Average"
                helper={summary.quizAverage !== null ? "Best saved quiz attempts" : "No graded quizzes yet"}
              />
              <MetricRing
                value={summary.totalModules === 0 ? 0 : Math.round(((summary.totalModules - summary.openModules) / summary.totalModules) * 100)}
                label="Module Coverage"
                helper={`${summary.openModules} modules still open`}
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href={summary.nextHref ?? "/training"}
                className={cn(buttonVariants({ variant: "default" }), "rounded-2xl")}
              >
                Continue Training
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/quizzes"
                className={cn(buttonVariants({ variant: "secondary" }), "rounded-2xl")}
              >
                Review Quizzes
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem]">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href={summary.nextHref ?? "/training"} className="block rounded-2xl border border-[var(--glass-border)] bg-foreground/5 p-4 text-sm font-medium transition hover:bg-foreground/10">
              Resume training
            </Link>
            <Link href={nextModule ? `/training/${nextModule.id}` : "/training"} className="block rounded-2xl border border-[var(--glass-border)] bg-foreground/5 p-4 text-sm font-medium transition hover:bg-foreground/10">
              Open next module
            </Link>
            {course.finalAssessment ? (
              <Link href="/assessment/final" className="block rounded-2xl border border-[var(--glass-border)] bg-foreground/5 p-4 text-sm font-medium transition hover:bg-foreground/10">
                Check final assessment status
              </Link>
            ) : null}
            <Link href="/results" className="block rounded-2xl border border-[var(--glass-border)] bg-foreground/5 p-4 text-sm font-medium transition hover:bg-foreground/10">
              Review results and history
            </Link>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {summary.modules.slice(0, 3).map((module) => (
          <Card key={module.id} className="rounded-[2rem]">
            <CardContent className="space-y-4 p-6">
              <div className="flex items-center justify-between gap-4">
                <Badge variant="secondary" className="rounded-full px-3 py-1">
                  {module.completedLessons}/{module.totalLessons} lessons
                </Badge>
                <span className="text-sm text-muted-foreground">{module.progressPercent}%</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">{module.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{module.description}</p>
              </div>
              <Progress value={module.progressPercent} className="h-2" />
              <Link
                href={`/training/${module.id}`}
                className={cn(buttonVariants({ variant: "outline" }), "w-full rounded-2xl")}
              >
                <PlayCircle className="mr-2 h-4 w-4" />
                Open Module
              </Link>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="rounded-[2rem]">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {summary.recentActivity.length ? (
              summary.recentActivity.map((activity) => (
                <div key={activity.id} className="rounded-3xl border border-[var(--glass-border)] bg-foreground/5 px-4 py-4">
                  <p className="text-sm font-medium text-foreground">{activity.message}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    {new Date(activity.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm leading-6 text-muted-foreground">
                No tracked activity yet. Start the first lesson to create a progress trail in the
                shared onboarding store.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-[2rem]">
          <CardHeader>
            <CardTitle>Course Snapshot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>Total modules</span>
              <span className="font-medium text-foreground">{course.modules.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Final assessment</span>
              <span className="font-medium text-foreground">
                {course.finalAssessment ? (summary.finalUnlocked ? "Unlocked" : "Locked") : "Not configured"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Current status</span>
              <span className="font-medium text-foreground">{summary.status}</span>
            </div>
            <div className="rounded-3xl border border-[var(--glass-border)] bg-foreground/5 p-4 text-foreground/80">
              <div className="mb-2 flex items-center gap-2 font-medium text-foreground">
                <TrendingUp className="h-4 w-4" />
                Recommended next action
              </div>
              <p className="leading-6">
                {summary.nextHref
                  ? `Continue at ${summary.nextHref}.`
                  : "You are blocked by assignment or lock state. Contact your manager."}
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
