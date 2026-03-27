import Link from "next/link";
import { ArrowRight, PlayCircle, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
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
      <Card className="rounded-[2rem] border-0 shadow-lg">
        <CardHeader>
          <CardTitle>No onboarding assignment yet</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-6 text-slate-600">
          <p>
            Your learner account is active, but the sales onboarding course is not currently
            assigned. A manager can assign it from the Users screen.
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
        <Card className="rounded-[2rem] border-0 bg-gradient-to-br from-slate-950 to-slate-800 text-white shadow-lg">
          <CardContent className="space-y-6 p-7">
            <div>
              <p className="text-sm text-slate-300">Welcome back</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                Sales Rep Training Console
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
                Pick up where you left off, keep quiz performance on track, and work through the
                COS onboarding deck in a structured lesson flow instead of a standalone modules
                page.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-3xl bg-white/10 p-4">
                <p className="text-sm text-slate-300">Completion</p>
                <p className="mt-1 text-3xl font-semibold">{summary.completionPercent}%</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-4">
                <p className="text-sm text-slate-300">Quiz Average</p>
                <p className="mt-1 text-3xl font-semibold">{summary.quizAverage ?? 0}%</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-4">
                <p className="text-sm text-slate-300">Open Modules</p>
                <p className="mt-1 text-3xl font-semibold">{summary.openModules}</p>
              </div>
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

        <Card className="rounded-[2rem] border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href={summary.nextHref ?? "/training"} className="block rounded-2xl bg-slate-50 p-4 text-sm font-medium transition hover:bg-slate-100">
              Resume training
            </Link>
            <Link href={nextModule ? `/training/${nextModule.id}` : "/training"} className="block rounded-2xl bg-slate-50 p-4 text-sm font-medium transition hover:bg-slate-100">
              Open next module
            </Link>
            <Link href="/assessment/final" className="block rounded-2xl bg-slate-50 p-4 text-sm font-medium transition hover:bg-slate-100">
              Check final assessment status
            </Link>
            <Link href="/results" className="block rounded-2xl bg-slate-50 p-4 text-sm font-medium transition hover:bg-slate-100">
              Review results and history
            </Link>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {summary.modules.slice(0, 3).map((module) => (
          <Card key={module.id} className="rounded-[2rem] border-0 shadow-lg">
            <CardContent className="space-y-4 p-6">
              <div className="flex items-center justify-between gap-4">
                <Badge variant="secondary" className="rounded-full px-3 py-1">
                  {module.completedLessons}/{module.totalLessons} lessons
                </Badge>
                <span className="text-sm text-slate-500">{module.progressPercent}%</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-950">{module.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{module.description}</p>
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
        <Card className="rounded-[2rem] border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {summary.recentActivity.length ? (
              summary.recentActivity.map((activity) => (
                <div key={activity.id} className="rounded-3xl bg-slate-50 px-4 py-4">
                  <p className="text-sm font-medium text-slate-950">{activity.message}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">
                    {new Date(activity.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm leading-6 text-slate-600">
                No tracked activity yet. Start the first lesson to create a progress trail in the
                shared onboarding store.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Course Snapshot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-600">
            <div className="flex items-center justify-between">
              <span>Total modules</span>
              <span className="font-medium text-slate-950">{course.modules.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Final assessment</span>
              <span className="font-medium text-slate-950">
                {summary.finalUnlocked ? "Unlocked" : "Locked"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Current status</span>
              <span className="font-medium text-slate-950">{summary.status}</span>
            </div>
            <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-4 text-emerald-950">
              <div className="mb-2 flex items-center gap-2 font-medium">
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
