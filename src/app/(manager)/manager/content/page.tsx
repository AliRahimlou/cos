import {
  addModuleToCourseAction,
  createDepartmentProgramAction,
} from "@/app/actions/manager";
import { SourceSlideBadges } from "@/components/onboarding/source-slide-badges";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireSessionUser } from "@/lib/auth/session";
import { listCourses } from "@/lib/portal/store";

export default async function ContentPage() {
  await requireSessionUser("manager");
  const courses = await listCourses();

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-2">
        <Card className="rounded-[2rem]">
          <CardHeader>
            <CardTitle>Add Department / Program</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createDepartmentProgramAction} className="grid gap-4">
              <input
                name="department"
                placeholder="Department name"
                className="h-11 rounded-2xl border border-[var(--glass-border)] bg-background px-3 text-sm"
                required
              />
              <input
                name="title"
                placeholder="Program title"
                className="h-11 rounded-2xl border border-[var(--glass-border)] bg-background px-3 text-sm"
                required
              />
              <input
                name="audience"
                placeholder="Audience"
                className="h-11 rounded-2xl border border-[var(--glass-border)] bg-background px-3 text-sm"
                required
              />
              <textarea
                name="description"
                placeholder="Program description"
                className="min-h-28 rounded-2xl border border-[var(--glass-border)] bg-background px-3 py-3 text-sm"
                required
              />
              <input
                name="starterModuleTitle"
                placeholder="Starter module title"
                className="h-11 rounded-2xl border border-[var(--glass-border)] bg-background px-3 text-sm"
              />
              <input
                name="starterLessonTitle"
                placeholder="Starter lesson title"
                className="h-11 rounded-2xl border border-[var(--glass-border)] bg-background px-3 text-sm"
              />
              <textarea
                name="starterLessonDescription"
                placeholder="Starter lesson description"
                className="min-h-24 rounded-2xl border border-[var(--glass-border)] bg-background px-3 py-3 text-sm"
              />
              <textarea
                name="objectivesText"
                placeholder="Objectives, one per line"
                className="min-h-24 rounded-2xl border border-[var(--glass-border)] bg-background px-3 py-3 text-sm"
              />
              <textarea
                name="keyTakeawaysText"
                placeholder="Key takeaways, one per line"
                className="min-h-24 rounded-2xl border border-[var(--glass-border)] bg-background px-3 py-3 text-sm"
              />
              <Button className="rounded-2xl">Create Department Program</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem]">
          <CardHeader>
            <CardTitle>Add Module to Existing Program</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={addModuleToCourseAction} className="grid gap-4">
              <select
                name="courseId"
                defaultValue={courses[0]?.courseId}
                className="h-11 rounded-2xl border border-[var(--glass-border)] bg-background px-3 text-sm"
              >
                {courses.map((course) => (
                  <option key={course.courseId} value={course.courseId}>
                    {course.department} · {course.course.title}
                  </option>
                ))}
              </select>
              <input
                name="department"
                placeholder="Department label"
                className="h-11 rounded-2xl border border-[var(--glass-border)] bg-background px-3 text-sm"
                required
              />
              <input
                name="title"
                placeholder="Module title"
                className="h-11 rounded-2xl border border-[var(--glass-border)] bg-background px-3 text-sm"
                required
              />
              <input
                name="estimatedMinutes"
                type="number"
                min="5"
                defaultValue="20"
                className="h-11 rounded-2xl border border-[var(--glass-border)] bg-background px-3 text-sm"
                required
              />
              <textarea
                name="description"
                placeholder="Module description"
                className="min-h-24 rounded-2xl border border-[var(--glass-border)] bg-background px-3 py-3 text-sm"
                required
              />
              <input
                name="lessonTitle"
                placeholder="Initial lesson title"
                className="h-11 rounded-2xl border border-[var(--glass-border)] bg-background px-3 text-sm"
              />
              <textarea
                name="lessonDescription"
                placeholder="Initial lesson description"
                className="min-h-24 rounded-2xl border border-[var(--glass-border)] bg-background px-3 py-3 text-sm"
              />
              <textarea
                name="objectivesText"
                placeholder="Objectives, one per line"
                className="min-h-24 rounded-2xl border border-[var(--glass-border)] bg-background px-3 py-3 text-sm"
              />
              <textarea
                name="keyTakeawaysText"
                placeholder="Key takeaways, one per line"
                className="min-h-24 rounded-2xl border border-[var(--glass-border)] bg-background px-3 py-3 text-sm"
              />
              <Button className="rounded-2xl">Add Module</Button>
            </form>
          </CardContent>
        </Card>
      </section>

      <Card className="rounded-[2rem]">
        <CardHeader>
          <CardTitle>Program Library</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-6 text-muted-foreground">
          <p>
            Manage the COS learning library, add department programs, and expand course offerings
            without disrupting active onboarding paths.
          </p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {courses.map((course) => (
          <Card key={course.courseId} className="rounded-[2rem]">
            <CardHeader className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <Badge className="rounded-full px-3 py-1">{course.department}</Badge>
                <Badge variant="secondary" className="rounded-full px-3 py-1">
                  {course.protected ? "Core program" : "Custom program"}
                </Badge>
                <Badge variant="outline" className="rounded-full px-3 py-1">
                  {course.protected ? "COS Standard" : "Department"}
                </Badge>
              </div>
              <CardTitle className="text-2xl">{course.course.title}</CardTitle>
              <p className="text-sm leading-6 text-muted-foreground">{course.course.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="rounded-3xl border border-[var(--glass-border)] bg-foreground/5 p-4">
                  <p className="font-medium text-foreground">Course ID</p>
                  <p className="text-muted-foreground">{course.courseId}</p>
                </div>
                <div className="rounded-3xl border border-[var(--glass-border)] bg-foreground/5 p-4">
                  <p className="font-medium text-foreground">Modules</p>
                  <p className="text-muted-foreground">{course.course.modules.length}</p>
                </div>
                <div className="rounded-3xl border border-[var(--glass-border)] bg-foreground/5 p-4">
                  <p className="font-medium text-foreground">Final Questions</p>
                  <p className="text-muted-foreground">{course.course.finalAssessment?.questions.length ?? 0}</p>
                </div>
                <div className="rounded-3xl border border-[var(--glass-border)] bg-foreground/5 p-4">
                  <p className="font-medium text-foreground">Source</p>
                  <p className="text-muted-foreground">{course.protected ? "COS learning library" : "Department-managed content"}</p>
                </div>
              </div>

              <div className="space-y-3">
                {course.course.modules.map((module) => (
                  <div key={module.id} className="rounded-3xl border border-[var(--glass-border)] px-5 py-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-foreground">{module.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{module.description}</p>
                      </div>
                      {module.sourceSlides.length ? (
                        <SourceSlideBadges sourceSlides={module.sourceSlides} />
                      ) : (
                        <Badge variant="outline" className="rounded-full">
                          Custom module
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
