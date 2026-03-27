import Link from "next/link";
import { ArrowRight, Lock, PlayCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { requireSessionUser } from "@/lib/auth/session";
import { isLessonComplete } from "@/lib/onboarding/progress";
import { getLearnerContext } from "@/lib/portal/loaders";
import { cn } from "@/lib/utils";

export default async function TrainingPage() {
  const sessionUser = await requireSessionUser("learner");
  const context = await getLearnerContext(sessionUser.id);

  if (!context) {
    return null;
  }

  const { course, enrollment, summary } = context;

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Badge className="rounded-full px-3 py-1">Training Modules</Badge>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
              Routed module flow built from the source deck
            </h2>
            <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-600">
              Each module is mapped to the normalized course model, carries source-slide metadata,
              and links into dedicated lesson routes instead of a local-state modules screen.
            </p>
          </div>
          <Link
            href={summary.nextHref ?? "/dashboard"}
            className={cn(buttonVariants({ variant: "default" }), "rounded-2xl")}
          >
            Resume Current Path
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {course.modules.map((module) => {
          const moduleSummary = summary.modules.find((item) => item.id === module.id)!;
          const nextLesson = module.lessons.find((lesson) =>
            enrollment ? !isLessonComplete(enrollment.progress, lesson.id) : true,
          );
          const entryHref = nextLesson
            ? `/training/${module.id}/lessons/${nextLesson.id}`
            : `/training/${module.id}`;

          return (
            <Card key={module.id} className="rounded-[2rem] border-0 shadow-lg">
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <Badge variant="secondary" className="rounded-full px-3 py-1">
                    {module.estimatedMinutes} min
                  </Badge>
                  <span className="text-sm text-slate-500">{moduleSummary.progressPercent}%</span>
                </div>
                <CardTitle className="text-2xl">{module.title}</CardTitle>
                <p className="text-sm leading-6 text-slate-600">{module.description}</p>
              </CardHeader>
              <CardContent className="space-y-5">
                <Progress value={moduleSummary.progressPercent} className="h-2" />
                <div className="grid gap-2 text-sm text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>Lessons</span>
                    <span>
                      {moduleSummary.completedLessons}/{moduleSummary.totalLessons}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Quiz</span>
                    <span>{moduleSummary.quizPassed ? "Passed" : "Pending"}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href={entryHref}
                    className={cn(buttonVariants({ variant: "default" }), "rounded-2xl")}
                  >
                    {moduleSummary.locked ? <Lock className="mr-2 h-4 w-4" /> : <PlayCircle className="mr-2 h-4 w-4" />}
                    {moduleSummary.locked ? "View Lock State" : "Open Module"}
                  </Link>
                  <Link
                    href={`/training/${module.id}`}
                    className={cn(buttonVariants({ variant: "outline" }), "rounded-2xl")}
                  >
                    Module Details
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
