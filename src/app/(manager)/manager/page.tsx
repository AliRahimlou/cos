import Link from "next/link";
import { AlertTriangle, ArrowRight, Users } from "lucide-react";

import { MetricRing } from "@/components/portal/metric-ring";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button-variants";
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
          <Card key={label} className="rounded-[2rem]">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="mt-2 text-3xl font-semibold text-foreground">{value}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <Card className="glass-surface-strong relative overflow-hidden rounded-[2rem] shadow-[var(--glass-shadow-lg)]">
          <div className="pointer-events-none absolute inset-0 glass-highlight" />
          <CardContent className="relative space-y-6 p-7">
            <div>
              <p className="text-sm text-muted-foreground">COS Leadership View</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
                Team onboarding performance at a glance
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
                Review completion, identify coaching opportunities, and keep every learner moving
                through onboarding with clear operational visibility.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <MetricRing
                value={overview.activeLearners === 0 ? 0 : Math.round((overview.completedLearners / overview.activeLearners) * 100)}
                label="Completion Rate"
                helper={`${overview.completedLearners} of ${overview.activeLearners} learners complete`}
              />
              <MetricRing
                value={overview.avgQuizScore}
                label="Quiz Health"
                helper={`${overview.recentActivity.length} recent events tracked`}
              />
              <MetricRing
                value={overview.activeLearners === 0 ? 0 : Math.round((coachingLearners.length / overview.activeLearners) * 100)}
                label="Coaching Load"
                helper={`${coachingLearners.length} learners need attention`}
              />
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

        <Card className="rounded-[2rem]">
          <CardHeader>
            <CardTitle>Needs Coaching</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {coachingLearners.length ? (
              coachingLearners.map((record) => (
                <div key={record.user.id} className="rounded-3xl border border-[var(--glass-border)] bg-foreground/5 px-4 py-4 text-foreground">
                  <div className="mb-1 flex items-center gap-2 font-medium">
                    <AlertTriangle className="h-4 w-4" />
                    {record.user.name}
                  </div>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {record.completionPercent}% complete · Quiz average {record.quizAverage ?? 0}%
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm leading-6 text-muted-foreground">
                No learners currently meet the needs-coaching threshold.
              </p>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="rounded-[2rem]">
          <CardHeader>
            <CardTitle>Team Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {records.map((record) => (
              <div key={record.user.id} className="rounded-3xl border border-[var(--glass-border)] px-5 py-4">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-foreground">{record.user.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {record.user.title} · {record.courseTitle}
                    </p>
                  </div>
                  <Badge className="rounded-full">{record.status}</Badge>
                </div>
                <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
                  <span>Course completion</span>
                  <span>{record.completionPercent}%</span>
                </div>
                <Progress value={record.completionPercent} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-[2rem]">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {overview.recentActivity.length ? (
              overview.recentActivity.map((activity) => (
                <div key={activity.id} className="rounded-3xl border border-[var(--glass-border)] bg-foreground/5 px-4 py-4">
                  <div className="mb-1 flex items-center gap-2 font-medium text-foreground">
                    <Users className="h-4 w-4" />
                    {activity.learnerName}
                  </div>
                  <p className="text-sm leading-6 text-muted-foreground">{activity.message}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    {new Date(activity.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm leading-6 text-muted-foreground">No tracked activity yet.</p>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
