import { salesRepOnboardingCourse } from "@/content/onboarding/sales-rep/course";
import {
  getAssessmentAttempts,
  getBestAssessmentAttempt,
  getCourseStats,
  getModuleStatus,
  getResumeTarget,
} from "@/lib/onboarding/progress";

import type { CourseEnrollment, PortalActivity, PublicUser } from "./types";

const course = salesRepOnboardingCourse;

export type LearnerModuleSummary = {
  id: string;
  title: string;
  description: string;
  progressPercent: number;
  completed: boolean;
  locked: boolean;
  quizPassed: boolean;
  completedLessons: number;
  totalLessons: number;
};

export type LearnerSummary = {
  user: PublicUser;
  enrollment: CourseEnrollment | null;
  completionPercent: number;
  completedModules: number;
  totalModules: number;
  openModules: number;
  quizAverage: number | null;
  finalScore: number | null;
  status: string;
  assigned: boolean;
  locked: boolean;
  managerMarkedComplete: boolean | null;
  needsCoaching: boolean;
  nextHref: string | null;
  lastActivityAt: string | null;
  recentActivity: PortalActivity[];
  finalUnlocked: boolean;
  modules: LearnerModuleSummary[];
};

export type ManagerOverview = {
  activeLearners: number;
  avgCompletion: number;
  avgQuizScore: number;
  needsCoaching: number;
  completedLearners: number;
  recentActivity: Array<
    PortalActivity & {
      learnerName: string;
      learnerId: string;
    }
  >;
};

function average(numbers: number[]) {
  if (numbers.length === 0) {
    return 0;
  }

  return Math.round(numbers.reduce((sum, value) => sum + value, 0) / numbers.length);
}

function getQuizAverage(enrollment: CourseEnrollment | null) {
  if (!enrollment) {
    return null;
  }

  const scores = course.modules.flatMap((module) => {
    if (!module.quiz) {
      return [];
    }

    const attempt = getBestAssessmentAttempt(enrollment.progress, module.quiz.id);
    return attempt ? [attempt.scorePercent] : [];
  });

  return scores.length > 0 ? average(scores) : null;
}

function getFinalScore(enrollment: CourseEnrollment | null) {
  if (!enrollment || !course.finalAssessment) {
    return null;
  }

  return getBestAssessmentAttempt(enrollment.progress, course.finalAssessment.id)?.scorePercent ?? null;
}

function getNextHref(enrollment: CourseEnrollment | null) {
  if (!enrollment || !enrollment.assigned || enrollment.locked) {
    return null;
  }

  const target = getResumeTarget(course, enrollment.progress);

  if (target.kind === "lesson" && target.moduleId && target.lessonId) {
    return `/training/${target.moduleId}/lessons/${target.lessonId}`;
  }

  if (target.kind === "module_quiz" && target.moduleId) {
    return `/quizzes/${target.moduleId}`;
  }

  if (target.kind === "final_assessment") {
    return "/assessment/final";
  }

  return "/results";
}

export function buildLearnerSummary(
  user: PublicUser,
  enrollment: CourseEnrollment | null,
): LearnerSummary {
  const stats = enrollment ? getCourseStats(course, enrollment.progress) : null;
  const quizAverage = getQuizAverage(enrollment);
  const finalScore = getFinalScore(enrollment);
  const modules = course.modules.map((module) => {
    const status = enrollment
      ? getModuleStatus(module, enrollment.progress)
      : {
          completedLessons: 0,
          totalLessons: module.lessons.length,
          quizPassed: false,
          quizAttempted: false,
          progressPercent: 0,
          completed: false,
        };

    return {
      id: module.id,
      title: module.title,
      description: module.description,
      progressPercent: status.progressPercent,
      completed: status.completed,
      locked: enrollment?.lockedModuleIds.includes(module.id) ?? false,
      quizPassed: status.quizPassed,
      completedLessons: status.completedLessons,
      totalLessons: status.totalLessons,
    };
  });

  const assigned = enrollment?.assigned ?? false;
  const locked = enrollment?.locked ?? false;
  const managerMarkedComplete = enrollment?.managerMarkedComplete ?? null;
  const completionPercent = managerMarkedComplete
    ? 100
    : stats?.completionPercent ?? 0;
  const completedModules = managerMarkedComplete
    ? course.modules.length
    : stats?.completedModules ?? 0;
  const openModules = Math.max(course.modules.length - completedModules, 0);
  const finalUnlocked = Boolean(
    enrollment &&
      (enrollment.finalAssessmentUnlocked ||
        course.modules.every((module) => getModuleStatus(module, enrollment.progress).completed)),
  );

  const needsCoaching = Boolean(
    assigned &&
      !managerMarkedComplete &&
      ((quizAverage !== null && quizAverage < 80) ||
        (course.finalAssessment &&
          getAssessmentAttempts(enrollment?.progress ?? { courseId: course.id, startedAt: null, updatedAt: null, completedLessonIds: [], attempts: [] }, course.finalAssessment.id).some((attempt) => !attempt.passed))),
  );

  let status = "Not started";

  if (!assigned) {
    status = "Not assigned";
  } else if (locked) {
    status = "Locked";
  } else if (managerMarkedComplete || stats?.finalAssessmentPassed) {
    status = "Completed";
  } else if (needsCoaching) {
    status = "Needs coaching";
  } else if (completionPercent >= 70 || (quizAverage ?? 0) >= 85) {
    status = "Strong";
  } else if (completionPercent > 0) {
    status = "In progress";
  }

  return {
    user,
    enrollment,
    completionPercent,
    completedModules,
    totalModules: course.modules.length,
    openModules,
    quizAverage,
    finalScore,
    status,
    assigned,
    locked,
    managerMarkedComplete,
    needsCoaching,
    nextHref: getNextHref(enrollment),
    lastActivityAt: enrollment?.activity[0]?.createdAt ?? enrollment?.progress.updatedAt ?? null,
    recentActivity: enrollment?.activity.slice(0, 6) ?? [],
    finalUnlocked,
    modules,
  };
}

export function buildManagerOverview(records: LearnerSummary[]): ManagerOverview {
  const activeLearners = records.filter((record) => record.assigned).length;
  const completionValues = records
    .filter((record) => record.assigned)
    .map((record) => record.completionPercent);
  const quizValues = records
    .map((record) => record.quizAverage)
    .filter((value): value is number => value !== null);

  const recentActivity = records
    .flatMap((record) =>
      record.recentActivity.map((activity) => ({
        ...activity,
        learnerName: record.user.name,
        learnerId: record.user.id,
      })),
    )
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
    .slice(0, 8);

  return {
    activeLearners,
    avgCompletion: average(completionValues),
    avgQuizScore: average(quizValues),
    needsCoaching: records.filter((record) => record.needsCoaching).length,
    completedLearners: records.filter((record) => record.status === "Completed").length,
    recentActivity,
  };
}
