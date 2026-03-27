import Link from "next/link";
import { ArrowRight, CheckCircle2, Lock } from "lucide-react";
import { notFound } from "next/navigation";

import { SourceSlideBadges } from "@/components/onboarding/source-slide-badges";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button-variants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { requireSessionUser } from "@/lib/auth/session";
import { findModule, isLessonComplete } from "@/lib/onboarding/progress";
import { getLearnerContext } from "@/lib/portal/loaders";
import { cn } from "@/lib/utils";

export default async function ModulePage({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const { moduleId } = await params;
  const sessionUser = await requireSessionUser("learner");
  const context = await getLearnerContext(sessionUser.id);

  if (!context) {
    return null;
  }

  const { course, enrollment, summary } = context;
  const courseModule = findModule(course, moduleId);

  if (!courseModule) {
    notFound();
  }

  const moduleSummary = summary.modules.find((item) => item.id === courseModule.id)!;
  const nextLesson = courseModule.lessons.find((lesson) =>
    enrollment ? !isLessonComplete(enrollment.progress, lesson.id) : true,
  );

  return (
    <div className="space-y-6">
      <section className="glass-surface-strong relative overflow-hidden rounded-[2rem] p-6">
        <div className="pointer-events-none absolute inset-0 glass-highlight" />
        <div className="relative flex flex-wrap items-center gap-3">
          <Badge className="rounded-full px-3 py-1">{courseModule.estimatedMinutes} min</Badge>
          {courseModule.sourceSlides.length ? (
            <SourceSlideBadges sourceSlides={courseModule.sourceSlides} />
          ) : (
            <Badge variant="outline" className="rounded-full px-3 py-1">
              Manager-authored
            </Badge>
          )}
          {moduleSummary.locked ? (
            <Badge variant="destructive" className="rounded-full px-3 py-1">
              Locked
            </Badge>
          ) : null}
        </div>
        <h2 className="relative mt-4 text-3xl font-semibold tracking-tight text-foreground">
          {courseModule.title}
        </h2>
        <p className="relative mt-3 max-w-4xl text-sm leading-7 text-muted-foreground">
          {courseModule.description}
        </p>
        <div className="relative mt-5 max-w-md">
          <Progress value={moduleSummary.progressPercent} className="h-2" />
        </div>
      </section>

      {moduleSummary.locked ? (
        <Card className="rounded-[2rem]">
          <CardContent className="flex items-start gap-3 p-6 text-sm leading-6 text-muted-foreground">
            <Lock className="mt-1 h-4 w-4 shrink-0" />
            This module is currently locked by a manager. Return to your dashboard or contact your
            manager to restore access.
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="rounded-[2rem]">
          <CardHeader>
            <CardTitle>Lessons</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {courseModule.lessons.map((lesson, index) => {
              const complete = enrollment
                ? isLessonComplete(enrollment.progress, lesson.id)
                : false;

              return (
                <div
                  key={lesson.id}
                  className="flex flex-col gap-3 rounded-3xl border border-[var(--glass-border)] px-5 py-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Lesson {index + 1}
                    </p>
                    <h3 className="mt-1 text-lg font-semibold text-foreground">{lesson.title}</h3>
                    {lesson.description ? (
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{lesson.description}</p>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge variant={complete ? "default" : "secondary"} className="rounded-full">
                      {complete ? "Completed" : "Pending"}
                    </Badge>
                    <Link
                      href={`/training/${courseModule.id}/lessons/${lesson.id}`}
                      className={cn(buttonVariants({ variant: "outline" }), "rounded-2xl")}
                    >
                      Open Lesson
                    </Link>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="rounded-[2rem]">
          <CardHeader>
            <CardTitle>Next Step</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-6 text-muted-foreground">
            <p>
              Work through each lesson in sequence, then launch the module quiz once every lesson in
              this module is complete.
            </p>
            <div className="rounded-3xl border border-[var(--glass-border)] bg-foreground/5 p-4">
              <div className="mb-2 flex items-center gap-2 font-medium text-foreground">
                <CheckCircle2 className="h-4 w-4" />
                Recommended action
              </div>
            <p>
              {nextLesson
                ? `Continue with ${nextLesson.title}.`
                  : courseModule.quiz
                    ? "All lessons are complete. Launch the module quiz next."
                    : "All lessons are complete. Review results or return to training."}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link
                href={
                  nextLesson
                    ? `/training/${courseModule.id}/lessons/${nextLesson.id}`
                    : courseModule.quiz
                      ? `/quizzes/${courseModule.id}`
                      : "/results"
                }
                className={cn(buttonVariants({ variant: "default" }), "w-full rounded-2xl")}
              >
                {nextLesson ? "Continue Lessons" : courseModule.quiz ? "Take Module Quiz" : "Open Results"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/training"
                className={cn(buttonVariants({ variant: "outline" }), "w-full rounded-2xl")}
              >
                Back to Modules
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
