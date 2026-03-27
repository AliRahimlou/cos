"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { scoreAssessment } from "@/lib/onboarding/progress";
import type { Question, QuestionResponse } from "@/lib/onboarding/types";

import { QuestionFields } from "./question-fields";

export function KnowledgeCheckPanel({
  title = "Knowledge Check",
  questions,
}: {
  title?: string;
  questions: Question[];
}) {
  const [answers, setAnswers] = useState<Record<string, QuestionResponse>>({});
  const [submitted, setSubmitted] = useState(false);

  const assessment = {
    id: "knowledge-check",
    title,
    passingScore: 100,
    questions,
  };

  const result = submitted ? scoreAssessment(assessment, answers) : null;

  return (
    <div className="space-y-5 rounded-[2rem] border border-border bg-card px-5 py-6">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {title}
        </p>
        <p className="text-sm leading-7 text-muted-foreground">
          Check your understanding before moving on. These answers are not scored toward certification, but they surface misunderstandings early.
        </p>
      </div>
      <div className="space-y-6">
        {questions.map((question) => {
          const questionResult = result?.results.find(
            (item) => item.questionId === question.id,
          );

          return (
            <div key={question.id} className="rounded-3xl border border-border/80 bg-background/80 px-4 py-4">
              <QuestionFields
                question={question}
                response={answers[question.id] ?? null}
                onChange={(response) =>
                  setAnswers((current) => ({ ...current, [question.id]: response }))
                }
              />
              {questionResult ? (
                <div
                  className={`mt-4 rounded-2xl px-4 py-3 text-sm ${
                    questionResult.correct
                      ? "bg-emerald-50 text-emerald-950"
                      : "bg-amber-50 text-amber-950"
                  }`}
                >
                  <p className="font-medium">
                    {questionResult.correct ? "Correct" : "Review this concept"}
                  </p>
                  <p className="mt-1 leading-6">{question.explanation}</p>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={() => setSubmitted(true)}>Check Answers</Button>
        {submitted ? (
          <Button
            variant="outline"
            onClick={() => {
              setAnswers({});
              setSubmitted(false);
            }}
          >
            Reset Check
          </Button>
        ) : null}
        {result ? (
          <p className="text-sm text-muted-foreground">
            {result.earnedPoints} of {result.totalPoints} correct
          </p>
        ) : null}
      </div>
    </div>
  );
}
