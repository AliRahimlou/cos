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
  const { course, records, overview } = await getManagerContext();

  const moduleAnalytics = course.modules.map((module) => {
    const moduleStates = records.map((record) => record.modules.find((item) => item.id === module.id)!);

    return {
      id: module.id,
      title: module.title,
      completedCount: moduleStates.filter((state) => state.completed).length,
      averageProgress: average(moduleStates.map((state) => state.progressPercent)),
    };
  });

  return (
    <div className="space-y-6">
      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-[2rem] border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Module Completion Matrix</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {moduleAnalytics.map((module) => (
              <div key={module.id} className="rounded-3xl border border-slate-200 px-5 py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-semibold text-slate-950">{module.title}</h3>
                  <Badge className="rounded-full">{module.completedCount} complete</Badge>
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  Average progress across learners: {module.averageProgress}%
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Assessment Trends</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-6 text-slate-600">
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="font-medium text-slate-950">Average quiz score</p>
              <p className="mt-1">{overview.avgQuizScore}% across best saved module attempts.</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="font-medium text-slate-950">Needs-coaching threshold</p>
              <p className="mt-1">
                Learners are flagged when quiz performance falls below 80% or failed final attempts
                appear in the saved record.
              </p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="font-medium text-slate-950">Completion distribution</p>
              <p className="mt-1">
                {overview.completedLearners} of {overview.activeLearners} assigned learners are fully
                complete.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <Card className="rounded-[2rem] border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Recent Activity Feed</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {overview.recentActivity.map((activity) => (
            <div key={activity.id} className="rounded-3xl border border-slate-200 px-5 py-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-slate-950">{activity.learnerName}</p>
                  <p className="text-sm text-slate-600">{activity.message}</p>
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
