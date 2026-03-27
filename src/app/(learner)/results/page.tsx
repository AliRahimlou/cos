import Link from "next/link";
import { Award, RotateCcw } from "lucide-react";

import { CompletionCelebration } from "@/components/portal/completion-celebration";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button-variants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { requireSessionUser } from "@/lib/auth/session";
import {
  getAssessmentAttempts,
  getBestAssessmentAttempt,
  scoreAssessment,
} from "@/lib/onboarding/progress";
import { getLearnerContext } from "@/lib/portal/loaders";
import { cn } from "@/lib/utils";

type ResultsSearchParams = {
  assessmentId?: string;
  moduleId?: string;
  type?: string;
};

export default async function ResultsPage({
  searchParams,
}: {
  searchParams: Promise<ResultsSearchParams>;
}) {
  const { assessmentId, moduleId } = await searchParams;
  const sessionUser = await requireSessionUser("learner");
  const context = await getLearnerContext(sessionUser.id);

  if (!context || !context.enrollment) {
    return null;
  }

  const { course, enrollment, summary } = context;
  const assessment =
    (assessmentId && course.finalAssessment?.id === assessmentId
      ? course.finalAssessment
      : course.modules.find((module) => module.id === moduleId)?.quiz) ?? null;
  const latestAttempt = assessmentId
    ? [...getAssessmentAttempts(enrollment.progress, assessmentId)].sort((left, right) =>
        right.completedAt.localeCompare(left.completedAt),
      )[0]
    : null;
  const latestOutcome =
    assessment && latestAttempt
      ? scoreAssessment(assessment, latestAttempt.answers)
      : null;

  return (
    <div className="space-y-6">
      <section className="glass-surface-strong relative overflow-hidden rounded-[2rem] px-6 py-8 shadow-[var(--glass-shadow-lg)]">
        {summary.status === "Completed" ? <CompletionCelebration /> : null}
        <div className="pointer-events-none absolute inset-0 glass-highlight" />
        <div className="relative flex flex-wrap items-center gap-3">
          <Badge className="rounded-full border border-[var(--glass-border)] bg-foreground/10 px-4 py-1 text-foreground hover:bg-foreground/15">
            Results
          </Badge>
          {summary.status === "Completed" ? (
            <Badge variant="outline" className="rounded-full border-[var(--glass-border)] bg-foreground/5 px-3 py-1 text-foreground">
              {course.finalAssessment ? "Certified" : "Completed"}
            </Badge>
          ) : null}
        </div>
        <h2 className="relative mt-4 text-4xl font-semibold tracking-tight text-foreground">
          Assessment results and completion record
        </h2>
        <p className="relative mt-4 max-w-4xl text-base leading-8 text-muted-foreground">
          Review the latest scored attempt, track your program completion percentage, and retake any
          graded assessments that are configured for this onboarding path.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <Card className="rounded-[2rem]">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Course Completion</p>
            <p className="mt-2 text-3xl font-semibold text-foreground">{summary.completionPercent}%</p>
            <div className="mt-4">
              <Progress value={summary.completionPercent} className="h-2" />
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-[2rem]">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Quiz Average</p>
            <p className="mt-2 text-3xl font-semibold text-foreground">{summary.quizAverage ?? 0}%</p>
          </CardContent>
        </Card>
        <Card className="rounded-[2rem]">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Final Assessment</p>
            <p className="mt-2 text-3xl font-semibold text-foreground">
              {course.finalAssessment ? summary.finalScore ?? "Not taken" : "Not configured"}
            </p>
          </CardContent>
        </Card>
      </section>

      {assessment && latestAttempt && latestOutcome ? (
        <Card className="rounded-[2rem]">
          <CardHeader className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="rounded-full px-3 py-1">
                {latestAttempt.passed ? "Passed" : "Retry Needed"}
              </Badge>
              <Badge variant="secondary" className="rounded-full px-3 py-1">
                {latestAttempt.scorePercent}%
              </Badge>
            </div>
            <CardTitle className="text-2xl">
              Latest Attempt: {assessment.title}
            </CardTitle>
            <p className="text-sm leading-6 text-muted-foreground">
              Submitted on {new Date(latestAttempt.completedAt).toLocaleString()}.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {assessment.questions.map((question) => {
              const questionResult = latestOutcome.results.find(
                (item) => item.questionId === question.id,
              );

              return (
                <div key={question.id} className="rounded-3xl border border-[var(--glass-border)] px-5 py-4">
                  <p className="text-sm font-medium text-foreground">{question.prompt}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{question.explanation}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <Badge
                      variant={questionResult?.correct ? "default" : "secondary"}
                      className="rounded-full"
                    >
                      {questionResult?.correct ? "Correct" : "Review"}
                    </Badge>
                    <Badge variant="outline" className="rounded-full">
                      Source slides {question.sourceSlides.join(", ")}
                    </Badge>
                  </div>
                </div>
              );
            })}

            <div className="flex flex-wrap gap-3">
              <Link
                href={latestAttempt.assessmentType === "final_assessment" ? "/assessment/final" : `/quizzes/${latestAttempt.moduleId}`}
                className={cn(buttonVariants({ variant: "default" }), "rounded-2xl")}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Retake Assessment
              </Link>
              <Link
                href={summary.nextHref ?? "/training"}
                className={cn(buttonVariants({ variant: "outline" }), "rounded-2xl")}
              >
                Continue Training
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="rounded-[2rem]">
          <CardHeader>
            <CardTitle>Module Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {summary.modules.map((module) => (
              <div key={module.id} className="rounded-3xl border border-[var(--glass-border)] px-5 py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-foreground">{module.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {module.completedLessons}/{module.totalLessons} lessons complete
                    </p>
                  </div>
                  <Badge className="rounded-full">
                    {module.completed ? "Complete" : `${module.progressPercent}%`}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-[2rem]">
          <CardHeader>
            <CardTitle>Certification Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-6 text-muted-foreground">
            <div className="rounded-3xl border border-[var(--glass-border)] bg-foreground/5 p-4 text-foreground/80">
              <div className="mb-2 flex items-center gap-2 font-medium text-foreground">
                <Award className="h-4 w-4" />
                Current state
              </div>
              <p>
                {summary.status === "Completed"
                  ? "The onboarding course is complete. You can still retake assessments for review."
                  : course.finalAssessment
                    ? "Certification remains open. Finish incomplete modules and pass the final assessment to close the course."
                    : "Completion remains open. Finish incomplete modules to close this program."}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Best final score</span>
                <span>
                  {course.finalAssessment
                    ? getBestAssessmentAttempt(enrollment.progress, course.finalAssessment.id)?.scorePercent ?? "Not taken"
                    : "Not configured"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Manager override</span>
                <span>{summary.managerMarkedComplete ? "Marked complete" : "None"}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
