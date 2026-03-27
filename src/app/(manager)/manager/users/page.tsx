import {
  resetProgressAction,
  updateAssignmentAction,
  updateCompletionAction,
  updateCourseLockAction,
  updateFinalOverrideAction,
  updateModuleLockAction,
} from "@/app/actions/manager";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireSessionUser } from "@/lib/auth/session";
import { getManagerContext } from "@/lib/portal/loaders";

export default async function UsersPage() {
  await requireSessionUser("manager");
  const { course, records } = await getManagerContext();

  return (
    <Card className="rounded-[2rem] border-0 shadow-lg">
      <CardHeader>
        <CardTitle>User Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {records.map((record) => (
          <div key={record.user.id} className="rounded-[2rem] border border-slate-200 p-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-950">{record.user.name}</h3>
                <p className="text-sm text-slate-500">
                  {record.user.email} · {record.user.title}
                </p>
                <div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                  <p>Status: {record.status}</p>
                  <p>Completion: {record.completionPercent}%</p>
                  <p>Quiz average: {record.quizAverage ?? "No attempts yet"}</p>
                  <p>Final score: {record.finalScore ?? "Not taken"}</p>
                </div>
              </div>

              <div className="grid gap-2 sm:grid-cols-2 xl:w-[30rem]">
                <form action={updateAssignmentAction}>
                  <input type="hidden" name="userId" value={record.user.id} />
                  <input type="hidden" name="assigned" value={String(!record.assigned)} />
                  <Button variant="outline" className="w-full rounded-2xl">
                    {record.assigned ? "Unassign Course" : "Assign Course"}
                  </Button>
                </form>

                <form action={updateCourseLockAction}>
                  <input type="hidden" name="userId" value={record.user.id} />
                  <input type="hidden" name="locked" value={String(!record.locked)} />
                  <Button variant="outline" className="w-full rounded-2xl">
                    {record.locked ? "Unlock Course" : "Lock Course"}
                  </Button>
                </form>

                <form action={updateFinalOverrideAction}>
                  <input type="hidden" name="userId" value={record.user.id} />
                  <input
                    type="hidden"
                    name="unlocked"
                    value={String(!record.enrollment?.finalAssessmentUnlocked)}
                  />
                  <Button variant="outline" className="w-full rounded-2xl">
                    {record.enrollment?.finalAssessmentUnlocked ? "Relock Final" : "Unlock Final"}
                  </Button>
                </form>

                <form action={updateCompletionAction}>
                  <input type="hidden" name="userId" value={record.user.id} />
                  <input
                    type="hidden"
                    name="completed"
                    value={String(!(record.managerMarkedComplete ?? false))}
                  />
                  <Button variant="outline" className="w-full rounded-2xl">
                    {record.managerMarkedComplete ? "Mark Incomplete" : "Mark Complete"}
                  </Button>
                </form>

                <form action={resetProgressAction} className="sm:col-span-2">
                  <input type="hidden" name="userId" value={record.user.id} />
                  <Button variant="destructive" className="w-full rounded-2xl">
                    Reset Attempts and Progress
                  </Button>
                </form>
              </div>
            </div>

            <details className="mt-5 rounded-3xl bg-slate-50 p-4">
              <summary className="cursor-pointer text-sm font-medium text-slate-950">
                Module lock controls
              </summary>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {course.modules.map((module) => {
                  const locked = record.enrollment?.lockedModuleIds.includes(module.id) ?? false;

                  return (
                    <form key={module.id} action={updateModuleLockAction} className="rounded-3xl border border-slate-200 bg-white p-4">
                      <input type="hidden" name="userId" value={record.user.id} />
                      <input type="hidden" name="moduleId" value={module.id} />
                      <input type="hidden" name="locked" value={String(!locked)} />
                      <div className="mb-3">
                        <p className="font-medium text-slate-950">{module.title}</p>
                        <p className="text-sm text-slate-500">
                          {locked ? "Currently locked" : "Currently unlocked"}
                        </p>
                      </div>
                      <Button variant="outline" className="w-full rounded-2xl">
                        {locked ? "Unlock Module" : "Lock Module"}
                      </Button>
                    </form>
                  );
                })}
              </div>
            </details>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
