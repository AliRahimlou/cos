import Link from "next/link";
import { Award, RotateCcw } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
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
      <section className="rounded-[2rem] bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 px-6 py-8 text-white shadow-2xl">
        <div className="flex flex-wrap items-center gap-3">
          <Badge className="rounded-full bg-white/12 px-4 py-1 text-white hover:bg-white/12">
            Results
          </Badge>
          {summary.status === "Completed" ? (
            <Badge variant="outline" className="rounded-full border-white/20 bg-white/8 px-3 py-1 text-white">
              Certified
            </Badge>
          ) : null}
        </div>
        <h2 className="mt-4 text-4xl font-semibold tracking-tight">
          Assessment results and completion record
        </h2>
        <p className="mt-4 max-w-4xl text-base leading-8 text-white/80">
          Review the latest scored attempt, track your course completion percentage, and retake any
          module quiz or the final certification assessment as needed.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <Card className="rounded-[2rem] border-0 shadow-lg">
          <CardContent className="p-6">
            <p className="text-sm text-slate-500">Course Completion</p>
            <p className="mt-2 text-3xl font-semibold text-slate-950">{summary.completionPercent}%</p>
            <div className="mt-4">
              <Progress value={summary.completionPercent} className="h-2" />
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-[2rem] border-0 shadow-lg">
          <CardContent className="p-6">
            <p className="text-sm text-slate-500">Quiz Average</p>
            <p className="mt-2 text-3xl font-semibold text-slate-950">{summary.quizAverage ?? 0}%</p>
          </CardContent>
        </Card>
        <Card className="rounded-[2rem] border-0 shadow-lg">
          <CardContent className="p-6">
            <p className="text-sm text-slate-500">Final Assessment</p>
            <p className="mt-2 text-3xl font-semibold text-slate-950">
              {summary.finalScore ?? "Not taken"}
            </p>
          </CardContent>
        </Card>
      </section>

      {assessment && latestAttempt && latestOutcome ? (
        <Card className="rounded-[2rem] border-0 shadow-lg">
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
            <p className="text-sm leading-6 text-slate-600">
              Submitted on {new Date(latestAttempt.completedAt).toLocaleString()}.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {assessment.questions.map((question) => {
              const questionResult = latestOutcome.results.find(
                (item) => item.questionId === question.id,
              );

              return (
                <div key={question.id} className="rounded-3xl border border-slate-200 px-5 py-4">
                  <p className="text-sm font-medium text-slate-950">{question.prompt}</p>
                  <p className="mt-2 text-sm text-slate-600">{question.explanation}</p>
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
        <Card className="rounded-[2rem] border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Module Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {summary.modules.map((module) => (
              <div key={module.id} className="rounded-3xl border border-slate-200 px-5 py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-slate-950">{module.title}</h3>
                    <p className="text-sm text-slate-500">
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

        <Card className="rounded-[2rem] border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Certification Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-6 text-slate-600">
            <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-4 text-emerald-950">
              <div className="mb-2 flex items-center gap-2 font-medium">
                <Award className="h-4 w-4" />
                Current state
              </div>
              <p>
                {summary.status === "Completed"
                  ? "The onboarding course is complete. You can still retake assessments for review."
                  : "Certification remains open. Finish incomplete modules and pass the final assessment to close the course."}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Best final score</span>
                <span>{getBestAssessmentAttempt(enrollment.progress, course.finalAssessment?.id ?? "")?.scorePercent ?? "Not taken"}</span>
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
