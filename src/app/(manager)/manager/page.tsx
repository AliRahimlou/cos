import Link from "next/link";
import { AlertTriangle, ArrowRight, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { requireSessionUser } from "@/lib/auth/session";
import { getManagerContext } from "@/lib/portal/loaders";
import { cn } from "@/lib/utils";

export default async function ManagerDashboardPage() {
  await requireSessionUser("manager");
  const { records, overview } = await getManagerContext();
  const coachingLearners = records.filter((record) => record.needsCoaching).slice(0, 4);

  return (
    <div className="space-y-6">
      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Active Learners", `${overview.activeLearners}`],
          ["Avg Completion", `${overview.avgCompletion}%`],
          ["Avg Quiz Score", `${overview.avgQuizScore}%`],
          ["Needs Coaching", `${overview.needsCoaching}`],
        ].map(([label, value]) => (
          <Card key={label} className="rounded-[2rem] border-0 shadow-lg">
            <CardContent className="p-6">
              <p className="text-sm text-slate-500">{label}</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">{value}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <Card className="rounded-[2rem] border-0 bg-gradient-to-br from-slate-950 to-slate-800 text-white shadow-lg">
          <CardContent className="space-y-6 p-7">
            <div>
              <p className="text-sm text-slate-300">Manager Console</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                Team onboarding performance at a glance
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
                This dashboard is now backed by the shared portal store, so user assignment changes,
                resets, assessment attempts, and completion state all reflect across learner and
                manager routes.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-3xl bg-white/10 p-4">
                <p className="text-sm text-slate-300">Completed Learners</p>
                <p className="mt-1 text-3xl font-semibold">{overview.completedLearners}</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-4">
                <p className="text-sm text-slate-300">Recent Activity Events</p>
                <p className="mt-1 text-3xl font-semibold">{overview.recentActivity.length}</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-4">
                <p className="text-sm text-slate-300">At-Risk Learners</p>
                <p className="mt-1 text-3xl font-semibold">{coachingLearners.length}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/manager/users"
                className={cn(buttonVariants({ variant: "default" }), "rounded-2xl")}
              >
                Open User Controls
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/manager/analytics"
                className={cn(buttonVariants({ variant: "secondary" }), "rounded-2xl")}
              >
                View Analytics
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Needs Coaching</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {coachingLearners.length ? (
              coachingLearners.map((record) => (
                <div key={record.user.id} className="rounded-3xl bg-amber-50 px-4 py-4 text-amber-950">
                  <div className="mb-1 flex items-center gap-2 font-medium">
                    <AlertTriangle className="h-4 w-4" />
                    {record.user.name}
                  </div>
                  <p className="text-sm leading-6">
                    {record.completionPercent}% complete · Quiz average {record.quizAverage ?? 0}%
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm leading-6 text-slate-600">
                No learners currently meet the needs-coaching threshold.
              </p>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="rounded-[2rem] border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Team Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {records.map((record) => (
              <div key={record.user.id} className="rounded-3xl border border-slate-200 px-5 py-4">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-slate-950">{record.user.name}</h3>
                    <p className="text-sm text-slate-500">{record.user.title}</p>
                  </div>
                  <Badge className="rounded-full">{record.status}</Badge>
                </div>
                <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                  <span>Course completion</span>
                  <span>{record.completionPercent}%</span>
                </div>
                <Progress value={record.completionPercent} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {overview.recentActivity.length ? (
              overview.recentActivity.map((activity) => (
                <div key={activity.id} className="rounded-3xl bg-slate-50 px-4 py-4">
                  <div className="mb-1 flex items-center gap-2 font-medium text-slate-950">
                    <Users className="h-4 w-4" />
                    {activity.learnerName}
                  </div>
                  <p className="text-sm leading-6 text-slate-600">{activity.message}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">
                    {new Date(activity.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm leading-6 text-slate-600">No tracked activity yet.</p>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
