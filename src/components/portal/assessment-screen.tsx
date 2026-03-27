"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { RotateCcw, Trophy } from "lucide-react";

import { submitAssessmentAction } from "@/app/actions/onboarding";
import { AssessmentRunner, type AssessmentReview } from "@/components/onboarding/assessment-runner";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Assessment } from "@/lib/onboarding/types";

type AssessmentScreenProps = {
  courseId: string;
  assessment: Assessment;
  assessmentType: "module_quiz" | "final_assessment";
  moduleId?: string;
  heading: string;
  description: string;
  bestScore?: number | null;
};

export function AssessmentScreen({
  courseId,
  assessment,
  assessmentType,
  moduleId,
  heading,
  description,
  bestScore,
}: AssessmentScreenProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmitted(review: AssessmentReview) {
    startTransition(async () => {
      setError(null);

      try {
        const response = await submitAssessmentAction({
          courseId,
          assessmentId: assessment.id,
          moduleId,
          answers: review.attempt.answers,
        });
        router.push(response.redirectTo);
        router.refresh();
      } catch {
        setError("The assessment could not be submitted. Try again.");
      }
    });
  }

  return (
    <div className="space-y-6">
      <section className="glass-surface-strong relative overflow-hidden rounded-[2rem] px-6 py-8 shadow-[var(--glass-shadow-lg)]">
        <div className="pointer-events-none absolute inset-0 glass-highlight" />
        <div className="relative flex flex-wrap items-center gap-3">
          <Badge className="rounded-full border border-[var(--glass-border)] bg-foreground/10 px-4 py-1 text-foreground hover:bg-foreground/15">
            {assessmentType === "final_assessment" ? "Final Certification" : "Module Quiz"}
          </Badge>
          {bestScore !== null && bestScore !== undefined ? (
            <Badge variant="outline" className="rounded-full border-[var(--glass-border)] bg-foreground/5 px-3 py-1 text-foreground">
              Best score {bestScore}%
            </Badge>
          ) : null}
        </div>
        <h2 className="relative mt-4 text-4xl font-semibold tracking-tight text-foreground">{heading}</h2>
        <p className="relative mt-4 max-w-4xl text-base leading-8 text-muted-foreground">{description}</p>
      </section>

      {bestScore !== null && bestScore !== undefined ? (
        <Card className="rounded-[2rem]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Trophy className="h-5 w-5" />
              Best Recorded Attempt
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-6 text-muted-foreground">
            The best saved score for this assessment is {bestScore}%. You can retake it at any time
            to improve your result.
          </CardContent>
        </Card>
      ) : null}

      {pending ? (
        <Card className="rounded-[2rem]">
          <CardContent className="flex items-center gap-3 px-6 py-5 text-sm text-muted-foreground">
            <RotateCcw className="h-4 w-4 animate-spin" />
            Saving your assessment attempt...
          </CardContent>
        </Card>
      ) : null}

      {error ? (
        <Card className="rounded-[2rem] border-destructive/30 bg-destructive/10 shadow-none">
          <CardContent className="px-6 py-5 text-sm text-destructive">{error}</CardContent>
        </Card>
      ) : null}

      <AssessmentRunner
        courseId={courseId}
        assessment={assessment}
        assessmentType={assessmentType}
        moduleId={moduleId}
        onSubmitted={handleSubmitted}
      />
    </div>
  );
}
