import { describe, expect, it } from "vitest";

import { salesRepOnboardingCourse } from "@/content/onboarding/sales-rep/course";
import { createInitialCourseProgress, markLessonComplete, recordAssessmentAttempt, scoreAssessment } from "@/lib/onboarding/progress";

import { buildLearnerSummary } from "./metrics";
import type { CourseEnrollment, PublicUser } from "./types";

const sampleUser: PublicUser = {
  id: "learner-sample",
  name: "Sample Learner",
  email: "sample@cos.local",
  role: "learner",
  title: "Sales Rep",
  department: "Sales",
  active: true,
  activeCourseId: salesRepOnboardingCourse.id,
};

function createEnrollment(progress = createInitialCourseProgress(salesRepOnboardingCourse.id)): CourseEnrollment {
  return {
    userId: sampleUser.id,
    courseId: salesRepOnboardingCourse.id,
    assigned: true,
    assignedAt: progress.startedAt,
    locked: false,
    lockedModuleIds: [],
    finalAssessmentUnlocked: false,
    managerMarkedComplete: null,
    managerMarkedAt: null,
    completedAt: null,
    progress,
    activity: [],
  };
}

describe("buildLearnerSummary", () => {
  it("reports unassigned learners correctly", () => {
    const summary = buildLearnerSummary({
      course: salesRepOnboardingCourse,
      department: "Sales",
      protectedCourse: true,
      user: sampleUser,
      enrollment: null,
    });

    expect(summary.assigned).toBe(false);
    expect(summary.status).toBe("Not assigned");
    expect(summary.completionPercent).toBe(0);
    expect(summary.nextHref).toBeNull();
  });

  it("computes progress and next route for active learners", () => {
    const firstModule = salesRepOnboardingCourse.modules[0]!;
    let progress = createInitialCourseProgress(salesRepOnboardingCourse.id);

    progress = markLessonComplete(progress, firstModule.lessons[0]!.id);

    const summary = buildLearnerSummary({
      course: salesRepOnboardingCourse,
      department: "Sales",
      protectedCourse: true,
      user: sampleUser,
      enrollment: createEnrollment(progress),
    });

    expect(summary.assigned).toBe(true);
    expect(summary.completionPercent).toBeGreaterThan(0);
    expect(summary.status).toBe("In progress");
    expect(summary.nextHref).toBeTruthy();
  });

  it("promotes manager completion overrides to completed status", () => {
    const enrollment = createEnrollment();
    enrollment.managerMarkedComplete = true;

    const summary = buildLearnerSummary({
      course: salesRepOnboardingCourse,
      department: "Sales",
      protectedCourse: true,
      user: sampleUser,
      enrollment,
    });

    expect(summary.completionPercent).toBe(100);
    expect(summary.status).toBe("Completed");
  });

  it("flags quiz performance below threshold as needs coaching", () => {
    const moduleQuiz = salesRepOnboardingCourse.modules[0]!.quiz!;
    const answers = Object.fromEntries(
      moduleQuiz.questions.map((question, index) => [
        question.id,
        index === 0 ? question.correctAnswer : "__incorrect__",
      ]),
    );
    const outcome = scoreAssessment(moduleQuiz, answers);

    let progress = createInitialCourseProgress(salesRepOnboardingCourse.id);
    progress = recordAssessmentAttempt(progress, {
      assessmentId: moduleQuiz.id,
      courseId: salesRepOnboardingCourse.id,
      moduleId: salesRepOnboardingCourse.modules[0]!.id,
      assessmentType: "module_quiz",
      scorePercent: outcome.scorePercent,
      earnedPoints: outcome.earnedPoints,
      totalPoints: outcome.totalPoints,
      passed: outcome.passed,
      completedAt: new Date().toISOString(),
      answers,
    });

    const summary = buildLearnerSummary({
      course: salesRepOnboardingCourse,
      department: "Sales",
      protectedCourse: true,
      user: sampleUser,
      enrollment: createEnrollment(progress),
    });

    expect(summary.needsCoaching).toBe(true);
    expect(summary.status).toBe("Needs coaching");
  });
});
