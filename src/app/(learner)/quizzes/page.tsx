import Link from "next/link";
import { Lock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireSessionUser } from "@/lib/auth/session";
import { getBestAssessmentAttempt, getModuleStatus } from "@/lib/onboarding/progress";
import { getLearnerContext } from "@/lib/portal/loaders";
import { cn } from "@/lib/utils";

export default async function QuizzesPage() {
  const sessionUser = await requireSessionUser("learner");
  const context = await getLearnerContext(sessionUser.id);

  if (!context || !context.enrollment) {
    return null;
  }

  const { course, enrollment, summary } = context;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {course.modules.map((module) => {
        if (!module.quiz) {
          return null;
        }

        const moduleSummary = summary.modules.find((item) => item.id === module.id)!;
        const moduleStatus = getModuleStatus(module, enrollment.progress);
        const bestAttempt = getBestAssessmentAttempt(enrollment.progress, module.quiz.id);
        const unlocked = module.lessons.every((lesson) =>
          enrollment.progress.completedLessonIds.includes(lesson.id),
        );

        return (
          <Card key={module.id} className="rounded-[2rem] border-0 shadow-lg">
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between gap-4">
                <CardTitle className="text-xl">{module.title} Quiz</CardTitle>
                <Badge className="rounded-full px-3 py-1">
                  {module.quiz.questions.length} questions
                </Badge>
              </div>
              <p className="text-sm leading-6 text-slate-600">
                {module.quiz.description}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2 text-sm text-slate-600">
                <div className="flex items-center justify-between">
                  <span>Passing score</span>
                  <span>{module.quiz.passingScore}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Best score</span>
                  <span>{bestAttempt?.scorePercent ?? "No attempts yet"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Status</span>
                  <span>{moduleStatus.quizPassed ? "Passed" : unlocked ? "Ready" : "Locked"}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href={unlocked && !moduleSummary.locked ? `/quizzes/${module.id}` : `/training/${module.id}`}
                  className={cn(
                    buttonVariants({
                      variant: unlocked && !moduleSummary.locked ? "default" : "outline",
                    }),
                    "rounded-2xl",
                  )}
                >
                  {unlocked && !moduleSummary.locked ? "Open Quiz" : <Lock className="mr-2 h-4 w-4" />}
                  {unlocked && !moduleSummary.locked ? "Open Quiz" : "Finish Lessons First"}
                </Link>
                <Link
                  href={`/training/${module.id}`}
                  className={cn(buttonVariants({ variant: "outline" }), "rounded-2xl")}
                >
                  Review Module
                </Link>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
