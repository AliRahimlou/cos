import Link from "next/link";
import { Lock } from "lucide-react";
import { notFound } from "next/navigation";

import { AssessmentScreen } from "@/components/portal/assessment-screen";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireSessionUser } from "@/lib/auth/session";
import { findModule, getBestAssessmentAttempt } from "@/lib/onboarding/progress";
import { getLearnerContext } from "@/lib/portal/loaders";
import { cn } from "@/lib/utils";

export default async function ModuleQuizPage({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const { moduleId } = await params;
  const sessionUser = await requireSessionUser("learner");
  const context = await getLearnerContext(sessionUser.id);

  if (!context || !context.enrollment) {
    return null;
  }

  const { course, enrollment, summary } = context;
  const courseModule = findModule(course, moduleId);

  if (!courseModule?.quiz) {
    notFound();
  }

  const moduleSummary = summary.modules.find((item) => item.id === courseModule.id)!;
  const allLessonsComplete = courseModule.lessons.every((lesson) =>
    enrollment.progress.completedLessonIds.includes(lesson.id),
  );
  const bestAttempt = getBestAssessmentAttempt(enrollment.progress, courseModule.quiz.id);

  if (!allLessonsComplete || moduleSummary.locked) {
    return (
      <Card className="rounded-[2rem] border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Lock className="h-5 w-5" />
            Module quiz locked
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-6 text-slate-600">
          <p>
            Finish every lesson in this module and make sure the manager lock is cleared before
            launching the quiz.
          </p>
          <Link
            href={`/training/${courseModule.id}`}
            className={cn(buttonVariants({ variant: "outline" }), "rounded-2xl")}
          >
            Return to Module
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <AssessmentScreen
      assessment={courseModule.quiz}
      assessmentType="module_quiz"
      moduleId={courseModule.id}
      heading={`${courseModule.title} Quiz`}
      description="This module quiz is graded and saved to the shared onboarding store so both you and your manager can review performance and next steps."
      bestScore={bestAttempt?.scorePercent ?? null}
    />
  );
}
