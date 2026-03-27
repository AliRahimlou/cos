"use server";

import { revalidatePath } from "next/cache";

import { requireSessionUser } from "@/lib/auth/session";
import { markLessonCompleteForUser, submitAssessmentForUser } from "@/lib/portal/store";
import type { QuestionResponse } from "@/lib/onboarding/types";

export async function completeLessonAction(input: { lessonId: string }) {
  const user = await requireSessionUser("learner");
  await markLessonCompleteForUser(user.id, input.lessonId);
  revalidatePath("/dashboard");
  revalidatePath("/training");
  revalidatePath("/quizzes");
  revalidatePath("/results");

  return {
    ok: true,
  };
}

export async function submitAssessmentAction(input: {
  assessmentId: string;
  moduleId?: string;
  answers: Record<string, QuestionResponse>;
}) {
  const user = await requireSessionUser("learner");
  const result = await submitAssessmentForUser({
    userId: user.id,
    assessmentId: input.assessmentId,
    moduleId: input.moduleId,
    answers: input.answers,
  });

  revalidatePath("/dashboard");
  revalidatePath("/training");
  revalidatePath("/quizzes");
  revalidatePath("/assessment/final");
  revalidatePath("/results");
  revalidatePath("/manager");
  revalidatePath("/manager/team");
  revalidatePath("/manager/analytics");
  revalidatePath("/manager/users");

  return {
    attempt: result.attempt,
    passed: result.attempt.passed,
    scorePercent: result.attempt.scorePercent,
    redirectTo: result.attempt.assessmentType === "final_assessment"
      ? `/results?assessmentId=${result.attempt.assessmentId}&type=final`
      : `/results?assessmentId=${result.attempt.assessmentId}&moduleId=${result.attempt.moduleId}&type=module`,
  };
}
