"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { scoreAssessment } from "@/lib/onboarding/progress";
import type {
  Assessment,
  AssessmentAttempt,
  AssessmentQuestionResult,
  Question,
  QuestionResponse,
} from "@/lib/onboarding/types";

import { QuestionFields } from "./question-fields";

export type AssessmentReview = {
  attempt: AssessmentAttempt;
  results: { question: Question; result: AssessmentQuestionResult }[];
};

export function AssessmentRunner({
  courseId,
  assessment,
  assessmentType,
  moduleId,
  onSubmitted,
}: {
  courseId: string;
  assessment: Assessment;
  assessmentType: "module_quiz" | "final_assessment";
  moduleId?: string;
  onSubmitted: (review: AssessmentReview) => void;
}) {
  const [answers, setAnswers] = useState<Record<string, QuestionResponse>>({});

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-border bg-card px-6 py-6">
        <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
          <span>{assessment.questions.length} questions</span>
          <span>•</span>
          <span>{assessment.passingScore}% to pass</span>
        </div>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
          {assessment.title}
        </h2>
        {assessment.description ? (
          <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
            {assessment.description}
          </p>
        ) : null}
      </div>
      <div className="space-y-4">
        {assessment.questions.map((question, index) => (
          <div
            key={question.id}
            className="rounded-[2rem] border border-border bg-card px-5 py-5"
          >
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Question {index + 1}
            </p>
            <QuestionFields
              question={question}
              response={answers[question.id] ?? null}
              onChange={(response) =>
                setAnswers((current) => ({ ...current, [question.id]: response }))
              }
            />
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[2rem] border border-border bg-card px-5 py-5">
        <p className="text-sm leading-6 text-muted-foreground">
          Unanswered questions are scored as incorrect. Submit when you are ready to see your score and explanations.
        </p>
        <Button
          size="lg"
          onClick={() => {
            const outcome = scoreAssessment(assessment, answers);

            onSubmitted({
              attempt: {
                assessmentId: assessment.id,
                courseId,
                moduleId,
                assessmentType,
                scorePercent: outcome.scorePercent,
                earnedPoints: outcome.earnedPoints,
                totalPoints: outcome.totalPoints,
                passed: outcome.passed,
                completedAt: new Date().toISOString(),
                answers,
              },
              results: assessment.questions.map((question) => ({
                question,
                result: outcome.results.find(
                  (item) => item.questionId === question.id,
                )!,
              })),
            });
          }}
        >
          Submit Assessment
        </Button>
      </div>
    </div>
  );
}
