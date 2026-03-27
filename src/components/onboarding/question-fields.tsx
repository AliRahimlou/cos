"use client";

import { cn } from "@/lib/utils";
import type { Question, QuestionChoice, QuestionResponse } from "@/lib/onboarding/types";

import { SourceSlideBadges } from "./source-slide-badges";

function getQuestionChoices(question: Question): QuestionChoice[] {
  if (question.type === "true_false") {
    return [
      { id: "true", text: "True" },
      { id: "false", text: "False" },
    ];
  }

  return question.choices ?? [];
}

function isChecked(
  question: Question,
  response: QuestionResponse,
  choiceId: string,
) {
  if (question.type === "multiple") {
    return Array.isArray(response) ? response.includes(choiceId) : false;
  }

  if (question.type === "true_false") {
    return response === (choiceId === "true");
  }

  return response === choiceId;
}

function nextResponse(
  question: Question,
  current: QuestionResponse,
  choiceId: string,
  checked: boolean,
) {
  if (question.type === "multiple") {
    const currentValues = Array.isArray(current) ? current : [];

    if (checked) {
      return [...new Set([...currentValues, choiceId])];
    }

    return currentValues.filter((value) => value !== choiceId);
  }

  if (question.type === "true_false") {
    return choiceId === "true";
  }

  return choiceId;
}

export function QuestionFields({
  question,
  response,
  onChange,
  disabled = false,
}: {
  question: Question;
  response: QuestionResponse;
  onChange: (response: QuestionResponse) => void;
  disabled?: boolean;
}) {
  const choices = getQuestionChoices(question);
  const inputType = question.type === "multiple" ? "checkbox" : "radio";

  return (
    <fieldset className="space-y-4">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <SourceSlideBadges sourceSlides={question.sourceSlides} />
          <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            {question.type.replace("_", " ")}
          </span>
        </div>
        <legend className="text-base font-medium leading-7 text-foreground">
          {question.prompt}
        </legend>
      </div>
      <div className="space-y-3">
        {choices.map((choice) => {
          const checked = isChecked(question, response, choice.id);

          return (
            <label
              key={choice.id}
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 transition-colors",
                checked
                  ? "border-foreground bg-foreground/[0.04]"
                  : "border-border bg-card hover:bg-muted/50",
                disabled && "cursor-not-allowed opacity-70",
              )}
            >
              <input
                type={inputType}
                name={question.id}
                className="mt-1 size-4 accent-black"
                checked={checked}
                disabled={disabled}
                onChange={(event) =>
                  onChange(
                    nextResponse(
                      question,
                      response,
                      choice.id,
                      event.currentTarget.checked,
                    ),
                  )
                }
              />
              <span className="text-sm leading-6 text-foreground">{choice.text}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
