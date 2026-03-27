import { SourceSlideBadges } from "@/components/onboarding/source-slide-badges";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireSessionUser } from "@/lib/auth/session";
import { salesRepOnboardingCourse } from "@/content/onboarding/sales-rep/course";

export default async function ContentPage() {
  await requireSessionUser("manager");
  const course = salesRepOnboardingCourse;

  return (
    <div className="space-y-6">
      <Card className="rounded-[2rem] border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Content Administration Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-6 text-slate-600">
          <p>
            The onboarding app now renders from structured course data instead of hard-coded JSX
            screens. The PPTX extraction artifact, curated course model, and source-slide mappings
            live in the repo and are reflected throughout learner lessons and assessments.
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="font-medium text-slate-950">Course ID</p>
              <p>{course.id}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="font-medium text-slate-950">Modules</p>
              <p>{course.modules.length}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="font-medium text-slate-950">Final Questions</p>
              <p>{course.finalAssessment?.questions.length ?? 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {course.modules.map((module) => (
          <Card key={module.id} className="rounded-[2rem] border-0 shadow-lg">
            <CardHeader className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <Badge className="rounded-full px-3 py-1">{module.estimatedMinutes} min</Badge>
                <SourceSlideBadges sourceSlides={module.sourceSlides} />
              </div>
              <CardTitle className="text-2xl">{module.title}</CardTitle>
              <p className="text-sm leading-6 text-slate-600">{module.description}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {module.lessons.map((lesson) => (
                <div key={lesson.id} className="rounded-3xl border border-slate-200 px-5 py-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-slate-950">{lesson.title}</h3>
                      {lesson.description ? (
                        <p className="mt-1 text-sm text-slate-600">{lesson.description}</p>
                      ) : null}
                    </div>
                    <SourceSlideBadges sourceSlides={lesson.sourceSlides} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
