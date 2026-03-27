import {
  resetProgressAction,
  updateActiveCourseAction,
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
  const { courses, records } = await getManagerContext();

  return (
    <Card className="rounded-[2rem]">
      <CardHeader>
        <CardTitle>User Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {records.map((record) => {
          const courseRecord = courses.find((course) => course.courseId === record.courseId);

          if (!courseRecord) {
            return null;
          }

          return (
            <div key={record.user.id} className="rounded-[2rem] border border-[var(--glass-border)] p-5">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div className="xl:max-w-[30rem]">
                  <h3 className="text-lg font-semibold text-foreground">{record.user.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {record.user.email} · {record.user.title}
                  </p>
                  <div className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                    <p>Status: {record.status}</p>
                    <p>Program: {record.courseTitle}</p>
                    <p>Completion: {record.completionPercent}%</p>
                    <p>Quiz average: {record.quizAverage ?? "No attempts yet"}</p>
                    <p>Final score: {record.finalScore ?? "Not taken"}</p>
                    <p>Department: {record.courseDepartment}</p>
                  </div>
                </div>

                <div className="grid gap-2 xl:w-[34rem]">
                  <form action={updateActiveCourseAction} className="glass-surface grid gap-2 rounded-3xl p-4">
                    <input type="hidden" name="userId" value={record.user.id} />
                    <label htmlFor={`course-${record.user.id}`} className="text-sm font-medium text-foreground">
                      Active program
                    </label>
                    <select
                      id={`course-${record.user.id}`}
                      name="courseId"
                      defaultValue={record.courseId}
                      className="h-11 rounded-2xl border border-[var(--glass-border)] bg-background px-3 text-sm"
                    >
                      {courses.map((course) => (
                        <option key={course.courseId} value={course.courseId}>
                          {course.department} · {course.course.title}
                        </option>
                      ))}
                    </select>
                    <Button variant="outline" className="rounded-2xl">
                      Set Active Program
                    </Button>
                  </form>

                  <div className="grid gap-2 sm:grid-cols-2">
                    <form action={updateAssignmentAction}>
                      <input type="hidden" name="userId" value={record.user.id} />
                      <input type="hidden" name="courseId" value={record.courseId} />
                      <input type="hidden" name="assigned" value={String(!record.assigned)} />
                      <Button variant="outline" className="w-full rounded-2xl">
                        {record.assigned ? "Unassign Program" : "Assign Program"}
                      </Button>
                    </form>

                    <form action={updateCourseLockAction}>
                      <input type="hidden" name="userId" value={record.user.id} />
                      <input type="hidden" name="courseId" value={record.courseId} />
                      <input type="hidden" name="locked" value={String(!record.locked)} />
                      <Button variant="outline" className="w-full rounded-2xl">
                        {record.locked ? "Unlock Program" : "Lock Program"}
                      </Button>
                    </form>

                    {courseRecord.course.finalAssessment ? (
                      <form action={updateFinalOverrideAction}>
                        <input type="hidden" name="userId" value={record.user.id} />
                        <input type="hidden" name="courseId" value={record.courseId} />
                        <input
                          type="hidden"
                          name="unlocked"
                          value={String(!record.enrollment?.finalAssessmentUnlocked)}
                        />
                        <Button variant="outline" className="w-full rounded-2xl">
                          {record.enrollment?.finalAssessmentUnlocked ? "Relock Final" : "Unlock Final"}
                        </Button>
                      </form>
                    ) : (
                      <div className="flex items-center rounded-2xl border border-dashed border-[var(--glass-border)] px-4 py-3 text-sm text-muted-foreground">
                        No final assessment configured
                      </div>
                    )}

                    <form action={updateCompletionAction}>
                      <input type="hidden" name="userId" value={record.user.id} />
                      <input type="hidden" name="courseId" value={record.courseId} />
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
                      <input type="hidden" name="courseId" value={record.courseId} />
                      <Button variant="destructive" className="w-full rounded-2xl">
                        Reset Attempts and Progress
                      </Button>
                    </form>
                  </div>
                </div>
              </div>

              <details className="mt-5 rounded-3xl border border-[var(--glass-border)] bg-foreground/5 p-4">
                <summary className="cursor-pointer text-sm font-medium text-foreground">
                  Module lock controls
                </summary>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {courseRecord.course.modules.map((module) => {
                    const locked = record.enrollment?.lockedModuleIds.includes(module.id) ?? false;

                    return (
                      <form key={module.id} action={updateModuleLockAction} className="glass-surface rounded-3xl p-4">
                        <input type="hidden" name="userId" value={record.user.id} />
                        <input type="hidden" name="courseId" value={record.courseId} />
                        <input type="hidden" name="moduleId" value={module.id} />
                        <input type="hidden" name="locked" value={String(!locked)} />
                        <div className="mb-3">
                          <p className="font-medium text-foreground">{module.title}</p>
                          <p className="text-sm text-muted-foreground">
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
          );
        })}
      </CardContent>
    </Card>
  );
}
