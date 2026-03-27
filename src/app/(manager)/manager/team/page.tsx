import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TeamView } from "@/components/portal/team-view";
import { requireSessionUser } from "@/lib/auth/session";
import { getManagerContext } from "@/lib/portal/loaders";

export default async function TeamPage() {
  await requireSessionUser("manager");
  const { records } = await getManagerContext();

  return (
    <div className="space-y-6">
      <Card className="rounded-[2rem] border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Team Overview</CardTitle>
        </CardHeader>
        <CardContent className="text-sm leading-6 text-slate-600">
          Search learners by name, title, or status and inspect training completion, quiz averages,
          and the current next-step route for each learner.
        </CardContent>
      </Card>

      <TeamView
        records={records.map((record) => ({
          id: record.user.id,
          name: record.user.name,
          title: record.user.title,
          status: record.status,
          completionPercent: record.completionPercent,
          quizAverage: record.quizAverage,
          nextHref: record.nextHref,
        }))}
      />
    </div>
  );
}
