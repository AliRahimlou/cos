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
  assessment: Assessment;
  assessmentType: "module_quiz" | "final_assessment";
  moduleId?: string;
  heading: string;
  description: string;
  bestScore?: number | null;
};

export function AssessmentScreen({
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
      <section className="rounded-[2rem] bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 px-6 py-8 text-white shadow-2xl">
        <div className="flex flex-wrap items-center gap-3">
          <Badge className="rounded-full bg-white/12 px-4 py-1 text-white hover:bg-white/12">
            {assessmentType === "final_assessment" ? "Final Certification" : "Module Quiz"}
          </Badge>
          {bestScore !== null && bestScore !== undefined ? (
            <Badge variant="outline" className="rounded-full border-white/20 bg-white/8 px-3 py-1 text-white">
              Best score {bestScore}%
            </Badge>
          ) : null}
        </div>
        <h2 className="mt-4 text-4xl font-semibold tracking-tight">{heading}</h2>
        <p className="mt-4 max-w-4xl text-base leading-8 text-white/80">{description}</p>
      </section>

      {bestScore !== null && bestScore !== undefined ? (
        <Card className="rounded-[2rem] border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Trophy className="h-5 w-5" />
              Best Recorded Attempt
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-6 text-slate-600">
            The best saved score for this assessment is {bestScore}%. You can retake it at any time
            to improve your result.
          </CardContent>
        </Card>
      ) : null}

      {pending ? (
        <Card className="rounded-[2rem] border-0 shadow-lg">
          <CardContent className="flex items-center gap-3 px-6 py-5 text-sm text-slate-600">
            <RotateCcw className="h-4 w-4 animate-spin" />
            Saving your assessment attempt...
          </CardContent>
        </Card>
      ) : null}

      {error ? (
        <Card className="rounded-[2rem] border border-red-200 bg-red-50 shadow-none">
          <CardContent className="px-6 py-5 text-sm text-red-700">{error}</CardContent>
        </Card>
      ) : null}

      <AssessmentRunner
        courseId="sales-rep-onboarding"
        assessment={assessment}
        assessmentType={assessmentType}
        moduleId={moduleId}
        onSubmitted={handleSubmitted}
      />
    </div>
  );
}
