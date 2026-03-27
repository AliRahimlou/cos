import "server-only";

import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

import type { SessionUser } from "@/lib/auth/types";
import { salesRepOnboardingCourse } from "@/content/onboarding/sales-rep/course";
import {
  createInitialCourseProgress,
  findLesson,
  findModule,
  getCourseStats,
  getModuleStatus,
  markLessonComplete,
  recordAssessmentAttempt,
  scoreAssessment,
} from "@/lib/onboarding/progress";
import type {
  Assessment,
  AssessmentAttempt,
  Course,
  QuestionResponse,
} from "@/lib/onboarding/types";

import type {
  CourseEnrollment,
  PortalActivity,
  PortalState,
  PortalUser,
  PublicUser,
} from "./types";

const DATA_FILE = path.join(process.cwd(), "data", "onboarding-state.json");
const course = salesRepOnboardingCourse;

let writeQueue = Promise.resolve();

function now() {
  return new Date().toISOString();
}

function createId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function buildIncorrectAnswer(assessment: Assessment, questionIndex: number): QuestionResponse {
  const question = assessment.questions[questionIndex];

  if (typeof question.correctAnswer === "boolean") {
    return !question.correctAnswer;
  }

  if (Array.isArray(question.correctAnswer)) {
    const correctAnswers = question.correctAnswer;
    const wrongChoice = (question.choices ?? []).find(
      (choice) => !correctAnswers.includes(choice.id),
    );
    return wrongChoice ? [wrongChoice.id] : [];
  }

  const wrongChoice = (question.choices ?? []).find(
    (choice) => choice.id !== question.correctAnswer,
  );
  return wrongChoice?.id ?? "__incorrect__";
}

function buildAnswersForScore(
  assessment: Assessment,
  targetPercent: number,
): Record<string, QuestionResponse> {
  const correctCount = Math.max(
    0,
    Math.min(
      assessment.questions.length,
      Math.round((targetPercent / 100) * assessment.questions.length),
    ),
  );

  return Object.fromEntries(
    assessment.questions.map((question, index) => [
      question.id,
      index < correctCount
        ? question.correctAnswer
        : buildIncorrectAnswer(assessment, index),
    ]),
  );
}

function createAttempt(
  assessment: Assessment,
  options: {
    courseId: string;
    moduleId?: string;
    assessmentType: "module_quiz" | "final_assessment";
    completedAt: string;
    targetPercent: number;
  },
): AssessmentAttempt {
  const answers = buildAnswersForScore(assessment, options.targetPercent);
  const result = scoreAssessment(assessment, answers);

  return {
    assessmentId: assessment.id,
    courseId: options.courseId,
    moduleId: options.moduleId,
    assessmentType: options.assessmentType,
    scorePercent: result.scorePercent,
    earnedPoints: result.earnedPoints,
    totalPoints: result.totalPoints,
    passed: result.passed,
    completedAt: options.completedAt,
    answers,
  };
}

function seedLearnerProgress(config: {
  completedModules: number;
  extraLessons: number;
  passedQuizScores?: number[];
  failedModuleAttempt?: { moduleIndex: number; score: number };
}): CourseEnrollment["progress"] {
  let progress = createInitialCourseProgress(course.id);

  for (let moduleIndex = 0; moduleIndex < config.completedModules; moduleIndex += 1) {
    const courseModule = course.modules[moduleIndex];

    for (const lesson of courseModule.lessons) {
      progress = markLessonComplete(progress, lesson.id);
    }

    if (courseModule.quiz) {
      const targetPercent = config.passedQuizScores?.[moduleIndex] ?? 100;
      const attempt = createAttempt(courseModule.quiz, {
        courseId: course.id,
        moduleId: courseModule.id,
        assessmentType: "module_quiz",
        completedAt: now(),
        targetPercent,
      });
      progress = recordAssessmentAttempt(progress, attempt);
    }
  }

  if (config.extraLessons > 0) {
    const nextModule = course.modules[config.completedModules];

    if (nextModule) {
      for (const lesson of nextModule.lessons.slice(0, config.extraLessons)) {
        progress = markLessonComplete(progress, lesson.id);
      }
    }
  }

  if (config.failedModuleAttempt) {
    const courseModule = course.modules[config.failedModuleAttempt.moduleIndex];

    if (courseModule?.quiz) {
      const failedAttempt = createAttempt(courseModule.quiz, {
        courseId: course.id,
        moduleId: courseModule.id,
        assessmentType: "module_quiz",
        completedAt: now(),
        targetPercent: config.failedModuleAttempt.score,
      });
      progress = recordAssessmentAttempt(progress, failedAttempt);
    }
  }

  return progress;
}

function buildSeedUsers(): PortalUser[] {
  return [
    {
      id: "manager-morgan-lee",
      name: "Morgan Lee",
      email: "manager@cos.local",
      password: "manager123",
      role: "manager",
      title: "Sales Manager",
      department: "Sales",
      active: true,
    },
    {
      id: "learner-casey-holt",
      name: "Casey Holt",
      email: "learner@cos.local",
      password: "learner123",
      role: "learner",
      title: "Sales Rep",
      department: "Sales",
      active: true,
    },
    {
      id: "learner-shyanne-brooks",
      name: "Shyanne Brooks",
      email: "shyanne@cos.local",
      password: "learner123",
      role: "learner",
      title: "Sales Rep",
      department: "Sales",
      active: true,
    },
    {
      id: "learner-alex-carter",
      name: "Alex Carter",
      email: "alex@cos.local",
      password: "learner123",
      role: "learner",
      title: "Sales Rep",
      department: "Sales",
      active: true,
    },
    {
      id: "learner-jordan-reed",
      name: "Jordan Reed",
      email: "jordan@cos.local",
      password: "learner123",
      role: "learner",
      title: "Sales Rep",
      department: "Sales",
      active: true,
    },
    {
      id: "learner-taylor-nguyen",
      name: "Taylor Nguyen",
      email: "taylor@cos.local",
      password: "learner123",
      role: "learner",
      title: "Sales Rep",
      department: "Sales",
      active: true,
    },
  ];
}

function buildSeedEnrollment(
  userId: string,
  progress: CourseEnrollment["progress"],
): CourseEnrollment {
  return {
    userId,
    courseId: course.id,
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

function createSeedState(): PortalState {
  const users = buildSeedUsers();
  const enrollments: CourseEnrollment[] = [
    buildSeedEnrollment(
      "learner-casey-holt",
      createInitialCourseProgress(course.id),
    ),
    buildSeedEnrollment(
      "learner-shyanne-brooks",
      seedLearnerProgress({
        completedModules: 6,
        extraLessons: 1,
        passedQuizScores: [100, 100, 100, 83, 100, 83],
      }),
    ),
    buildSeedEnrollment(
      "learner-alex-carter",
      seedLearnerProgress({
        completedModules: 4,
        extraLessons: 1,
        passedQuizScores: [100, 80, 80, 80],
      }),
    ),
    buildSeedEnrollment(
      "learner-jordan-reed",
      seedLearnerProgress({
        completedModules: 0,
        extraLessons: 5,
        failedModuleAttempt: { moduleIndex: 0, score: 50 },
      }),
    ),
    buildSeedEnrollment(
      "learner-taylor-nguyen",
      seedLearnerProgress({
        completedModules: 5,
        extraLessons: 1,
        passedQuizScores: [100, 80, 80, 83, 80],
      }),
    ),
  ];

  return {
    version: 1,
    users,
    enrollments,
  };
}

async function ensureStateFile() {
  await mkdir(path.dirname(DATA_FILE), { recursive: true });

  try {
    await readFile(DATA_FILE, "utf8");
  } catch {
    await writeFile(DATA_FILE, JSON.stringify(createSeedState(), null, 2), "utf8");
  }
}

async function readState(): Promise<PortalState> {
  await ensureStateFile();
  const raw = await readFile(DATA_FILE, "utf8");
  return JSON.parse(raw) as PortalState;
}

async function writeState(state: PortalState) {
  await writeFile(DATA_FILE, JSON.stringify(state, null, 2), "utf8");
}

async function mutateState<T>(mutator: (state: PortalState) => T | Promise<T>) {
  let result: T | undefined;
  let error: unknown;

  writeQueue = writeQueue.then(async () => {
    const state = await readState();

    try {
      result = await mutator(state);
      await writeState(state);
    } catch (mutationError) {
      error = mutationError;
    }
  });

  await writeQueue;

  if (error) {
    throw error;
  }

  return result as T;
}

function getOrCreateEnrollmentRecord(
  state: PortalState,
  userId: string,
  courseId: string,
): CourseEnrollment {
  let enrollment = state.enrollments.find(
    (item) => item.userId === userId && item.courseId === courseId,
  );

  if (!enrollment) {
    enrollment = {
      userId,
      courseId,
      assigned: true,
      assignedAt: now(),
      locked: false,
      lockedModuleIds: [],
      finalAssessmentUnlocked: false,
      managerMarkedComplete: null,
      managerMarkedAt: null,
      completedAt: null,
      progress: createInitialCourseProgress(courseId),
      activity: [],
    };
    state.enrollments.push(enrollment);
  }

  return enrollment;
}

function appendActivity(
  enrollment: CourseEnrollment,
  activity: Omit<PortalActivity, "id" | "createdAt" | "courseId">,
) {
  enrollment.activity.unshift({
    id: createId("activity"),
    createdAt: now(),
    courseId: enrollment.courseId,
    ...activity,
  });
  enrollment.activity = enrollment.activity.slice(0, 40);
}

function syncCompletionState(enrollment: CourseEnrollment, activeCourse: Course) {
  const stats = getCourseStats(activeCourse, enrollment.progress);
  const completed =
    enrollment.managerMarkedComplete === true || stats.finalAssessmentPassed;
  enrollment.completedAt = completed ? enrollment.completedAt ?? now() : null;
}

function sanitizeUser(user: PortalUser): PublicUser {
  const { password, ...publicUser } = user;
  void password;
  return publicUser;
}

function resolveAssessment(assessmentId: string, moduleId?: string) {
  if (course.finalAssessment?.id === assessmentId) {
    return {
      assessment: course.finalAssessment,
      assessmentType: "final_assessment" as const,
      moduleId: undefined,
    };
  }

  if (!moduleId) {
    return null;
  }

  const courseModule = findModule(course, moduleId);

  if (!courseModule?.quiz || courseModule.quiz.id !== assessmentId) {
    return null;
  }

  return {
    assessment: courseModule.quiz,
    assessmentType: "module_quiz" as const,
    moduleId: courseModule.id,
  };
}

export async function readPortalState() {
  return readState();
}

export async function getUserById(userId: string) {
  const state = await readState();
  return state.users.find((user) => user.id === userId) ?? null;
}

export async function authenticateUser(email: string, password: string) {
  const state = await readState();
  const normalizedEmail = email.trim().toLowerCase();
  const user = state.users.find(
    (item) => item.email.toLowerCase() === normalizedEmail && item.active,
  );

  if (!user || user.password !== password) {
    return null;
  }

  return sanitizeUser(user);
}

export async function listUsers() {
  const state = await readState();
  return state.users.map(sanitizeUser);
}

export async function listLearners() {
  const state = await readState();
  return state.users.filter((user) => user.role === "learner").map(sanitizeUser);
}

export async function getEnrollment(userId: string, courseId: string) {
  const state = await readState();
  return (
    state.enrollments.find(
      (item) => item.userId === userId && item.courseId === courseId,
    ) ?? null
  );
}

export function toSessionUser(user: PortalUser | PublicUser): SessionUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    title: user.title,
    department: user.department,
  };
}

export async function getCurrentCourseForUser(userId: string) {
  const enrollment = await getEnrollment(userId, course.id);
  return {
    course,
    enrollment,
  };
}

export async function markLessonCompleteForUser(
  userId: string,
  lessonId: string,
) {
  return mutateState((state) => {
    const enrollment = getOrCreateEnrollmentRecord(state, userId, course.id);
    const lessonMatch = findLesson(course, lessonId);

    if (!lessonMatch) {
      throw new Error("Lesson not found.");
    }

    if (!enrollment.assigned) {
      throw new Error("Course is not currently assigned.");
    }

    if (enrollment.locked || enrollment.lockedModuleIds.includes(lessonMatch.module.id)) {
      throw new Error("This lesson is locked.");
    }

    const wasComplete = enrollment.progress.completedLessonIds.includes(lessonId);
    enrollment.progress = markLessonComplete(enrollment.progress, lessonId);

    if (!wasComplete) {
      appendActivity(enrollment, {
        actorUserId: userId,
        type: "lesson_completed",
        message: `Completed lesson: ${lessonMatch.lesson.title}`,
        moduleId: lessonMatch.module.id,
        lessonId,
      });
    }

    syncCompletionState(enrollment, course);
    return enrollment;
  });
}

export async function submitAssessmentForUser(input: {
  userId: string;
  assessmentId: string;
  moduleId?: string;
  answers: Record<string, QuestionResponse>;
}) {
  return mutateState((state) => {
    const enrollment = getOrCreateEnrollmentRecord(state, input.userId, course.id);
    const resolved = resolveAssessment(input.assessmentId, input.moduleId);

    if (!resolved) {
      throw new Error("Assessment not found.");
    }

    if (!enrollment.assigned) {
      throw new Error("Course is not currently assigned.");
    }

    if (enrollment.locked) {
      throw new Error("Course is locked.");
    }

    if (resolved.moduleId && enrollment.lockedModuleIds.includes(resolved.moduleId)) {
      throw new Error("This module is locked.");
    }

    if (
      resolved.assessmentType === "final_assessment" &&
      !enrollment.finalAssessmentUnlocked &&
      !course.modules.every((module) => getModuleStatus(module, enrollment.progress).completed)
    ) {
      throw new Error("Final assessment is locked.");
    }

    const outcome = scoreAssessment(resolved.assessment, input.answers);
    const completedAt = now();
    const attempt: AssessmentAttempt = {
      assessmentId: resolved.assessment.id,
      courseId: course.id,
      moduleId: resolved.moduleId,
      assessmentType: resolved.assessmentType,
      scorePercent: outcome.scorePercent,
      earnedPoints: outcome.earnedPoints,
      totalPoints: outcome.totalPoints,
      passed: outcome.passed,
      completedAt,
      answers: input.answers,
    };

    enrollment.progress = recordAssessmentAttempt(enrollment.progress, attempt);
    appendActivity(enrollment, {
      actorUserId: input.userId,
      type: "assessment_submitted",
      message:
        resolved.assessmentType === "final_assessment"
          ? `Submitted final assessment with ${attempt.scorePercent}%`
          : `Submitted ${findModule(course, resolved.moduleId ?? "")?.title ?? "module"} quiz with ${attempt.scorePercent}%`,
      assessmentId: resolved.assessment.id,
      moduleId: resolved.moduleId,
      scorePercent: attempt.scorePercent,
    });
    syncCompletionState(enrollment, course);

    return {
      attempt,
      assessment: resolved.assessment,
      outcome,
    };
  });
}

export async function setAssignmentForUser(
  actorUserId: string,
  userId: string,
  assigned: boolean,
) {
  return mutateState((state) => {
    const enrollment = getOrCreateEnrollmentRecord(state, userId, course.id);
    enrollment.assigned = assigned;
    enrollment.assignedAt = assigned ? enrollment.assignedAt ?? now() : enrollment.assignedAt;
    appendActivity(enrollment, {
      actorUserId,
      type: "assignment_updated",
      message: assigned ? "Manager assigned the onboarding course." : "Manager unassigned the onboarding course.",
    });
    return enrollment;
  });
}

export async function setCourseLockedForUser(
  actorUserId: string,
  userId: string,
  locked: boolean,
) {
  return mutateState((state) => {
    const enrollment = getOrCreateEnrollmentRecord(state, userId, course.id);
    enrollment.locked = locked;
    appendActivity(enrollment, {
      actorUserId,
      type: "course_locked",
      message: locked ? "Manager locked the course." : "Manager unlocked the course.",
    });
    return enrollment;
  });
}

export async function setModuleLockedForUser(
  actorUserId: string,
  userId: string,
  moduleId: string,
  locked: boolean,
) {
  return mutateState((state) => {
    const enrollment = getOrCreateEnrollmentRecord(state, userId, course.id);
    const nextLockedModuleIds = new Set(enrollment.lockedModuleIds);

    if (locked) {
      nextLockedModuleIds.add(moduleId);
    } else {
      nextLockedModuleIds.delete(moduleId);
    }

    enrollment.lockedModuleIds = [...nextLockedModuleIds];
    appendActivity(enrollment, {
      actorUserId,
      type: "module_lock_updated",
      message: locked ? `Manager locked module ${moduleId}.` : `Manager unlocked module ${moduleId}.`,
      moduleId,
    });
    return enrollment;
  });
}

export async function setFinalAssessmentOverrideForUser(
  actorUserId: string,
  userId: string,
  unlocked: boolean,
) {
  return mutateState((state) => {
    const enrollment = getOrCreateEnrollmentRecord(state, userId, course.id);
    enrollment.finalAssessmentUnlocked = unlocked;
    appendActivity(enrollment, {
      actorUserId,
      type: "final_override_updated",
      message: unlocked
        ? "Manager unlocked the final assessment early."
        : "Manager removed the final assessment override.",
      assessmentId: course.finalAssessment?.id,
    });
    return enrollment;
  });
}

export async function setManagerCompletionForUser(
  actorUserId: string,
  userId: string,
  completed: boolean,
) {
  return mutateState((state) => {
    const enrollment = getOrCreateEnrollmentRecord(state, userId, course.id);
    enrollment.managerMarkedComplete = completed;
    enrollment.managerMarkedAt = now();
    appendActivity(enrollment, {
      actorUserId,
      type: "manager_completion_updated",
      message: completed
        ? "Manager marked onboarding complete."
        : "Manager marked onboarding incomplete.",
    });
    syncCompletionState(enrollment, course);
    return enrollment;
  });
}

export async function resetProgressForUser(actorUserId: string, userId: string) {
  return mutateState((state) => {
    const enrollment = getOrCreateEnrollmentRecord(state, userId, course.id);
    enrollment.progress = createInitialCourseProgress(course.id);
    enrollment.managerMarkedComplete = null;
    enrollment.managerMarkedAt = null;
    enrollment.completedAt = null;
    appendActivity(enrollment, {
      actorUserId,
      type: "progress_reset",
      message: "Manager reset course progress and attempts.",
    });
    return enrollment;
  });
}

export { sanitizeUser as toPublicUser };
