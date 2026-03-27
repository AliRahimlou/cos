import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireSessionUser } from "@/lib/auth/session";
import { getManagerContext } from "@/lib/portal/loaders";

function average(values: number[]) {
  if (values.length === 0) {
    return 0;
  }

  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

export default async function AnalyticsPage() {
  await requireSessionUser("manager");
  const { courses, records, overview } = await getManagerContext();

  const moduleAnalytics = courses.map((courseRecord) => {
    const matchingRecords = records.filter((record) => record.courseId === courseRecord.courseId);
    const completedCount = matchingRecords.filter((record) => record.status === "Completed").length;
    const averageProgressValue = average(matchingRecords.map((record) => record.completionPercent));

    return {
      id: courseRecord.courseId,
      title: courseRecord.course.title,
      department: courseRecord.department,
      completedCount,
      averageProgress: averageProgressValue,
    };
  });

  return (
    <div className="space-y-6">
      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-[2rem]">
          <CardHeader>
            <CardTitle>Module Completion Matrix</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {moduleAnalytics.map((module) => (
              <div key={module.id} className="rounded-3xl border border-[var(--glass-border)] px-5 py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-semibold text-foreground">{module.title}</h3>
                  <Badge className="rounded-full">{module.completedCount} complete</Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {module.department} · Average progress across assigned learners: {module.averageProgress}%
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-[2rem]">
          <CardHeader>
            <CardTitle>Assessment Trends</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-6 text-muted-foreground">
            <div className="rounded-3xl border border-[var(--glass-border)] bg-foreground/5 p-4">
              <p className="font-medium text-foreground">Average quiz score</p>
              <p className="mt-1">{overview.avgQuizScore}% across best saved module attempts.</p>
            </div>
            <div className="rounded-3xl border border-[var(--glass-border)] bg-foreground/5 p-4">
              <p className="font-medium text-foreground">Needs-coaching threshold</p>
              <p className="mt-1">
                Learners are flagged when quiz performance falls below 80% or failed final attempts
                appear in the saved record.
              </p>
            </div>
            <div className="rounded-3xl border border-[var(--glass-border)] bg-foreground/5 p-4">
              <p className="font-medium text-foreground">Completion distribution</p>
              <p className="mt-1">
                {overview.completedLearners} of {overview.activeLearners} assigned learners are fully
                complete.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <Card className="rounded-[2rem]">
        <CardHeader>
          <CardTitle>Recent Activity Feed</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {overview.recentActivity.map((activity) => (
            <div key={activity.id} className="rounded-3xl border border-[var(--glass-border)] px-5 py-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-foreground">{activity.learnerName}</p>
                  <p className="text-sm text-muted-foreground">{activity.message}</p>
                </div>
                <Badge variant="secondary" className="rounded-full">
                  {new Date(activity.createdAt).toLocaleDateString()}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
