import "server-only";

import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

import type { SessionUser } from "@/lib/auth/types";
import { listProtectedPrograms } from "@/content/onboarding/program-registry";
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
  Lesson,
  Module,
  QuestionResponse,
} from "@/lib/onboarding/types";

import type {
  CourseEnrollment,
  CourseModuleExtension,
  ManagedCourseRecord,
  PortalActivity,
  PortalState,
  PortalUser,
  PublicUser,
} from "./types";

const DATA_FILE = path.join(process.cwd(), "data", "onboarding-state.json");
const defaultProtectedCourseId = listProtectedPrograms()[0]?.courseId ?? "sales-rep-onboarding";

let writeQueue = Promise.resolve();

function now() {
  return new Date().toISOString();
}

function createId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

function splitLines(value: string) {
  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function getProtectedCourseRecords(): ManagedCourseRecord[] {
  return listProtectedPrograms().map((program) => ({
    courseId: program.courseId,
    department: program.department,
    source: program.source,
    protected: program.protected,
    createdAt: "2026-03-27T00:00:00.000Z",
    updatedAt: "2026-03-27T00:00:00.000Z",
    deckPath: program.deckPath,
    extractionArtifact: program.extractionArtifact,
    notesPath: program.notesPath,
    course: program.course,
  }));
}

function mergeCourseWithExtensions(
  course: Course,
  extension?: CourseModuleExtension | null,
): Course {
  if (!extension || extension.modules.length === 0) {
    return course;
  }

  return {
    ...course,
    estimatedMinutes:
      course.estimatedMinutes +
      extension.modules.reduce((sum, module) => sum + module.estimatedMinutes, 0),
    modules: [...course.modules, ...extension.modules],
  };
}

function getCourseRecordsFromState(state: PortalState) {
  const protectedCourses = getProtectedCourseRecords();
  const allRecords = [...protectedCourses, ...state.customCourses];

  return allRecords.map((record) => ({
    ...record,
    course: mergeCourseWithExtensions(
      record.course,
      state.courseModuleExtensions.find((item) => item.courseId === record.courseId),
    ),
  }));
}

function getCourseRecordFromState(state: PortalState, courseId: string) {
  return getCourseRecordsFromState(state).find((record) => record.courseId === courseId) ?? null;
}

function getDefaultCourseIdForUser(state: PortalState, userId: string) {
  const user = state.users.find((item) => item.id === userId);

  if (user?.activeCourseId && getCourseRecordFromState(state, user.activeCourseId)) {
    return user.activeCourseId;
  }

  const assignedEnrollment = state.enrollments.find(
    (item) => item.userId === userId && item.assigned && getCourseRecordFromState(state, item.courseId),
  );

  if (assignedEnrollment) {
    return assignedEnrollment.courseId;
  }

  return defaultProtectedCourseId;
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
      activeCourseId: defaultProtectedCourseId,
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
      activeCourseId: defaultProtectedCourseId,
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
      activeCourseId: defaultProtectedCourseId,
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
      activeCourseId: defaultProtectedCourseId,
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
      activeCourseId: defaultProtectedCourseId,
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
      activeCourseId: defaultProtectedCourseId,
    },
  ];
}

function buildSeedEnrollment(
  userId: string,
  courseId: string,
  progress: CourseEnrollment["progress"],
): CourseEnrollment {
  return {
    userId,
    courseId,
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

function seedLearnerProgress(
  course: Course,
  config: {
    completedModules: number;
    extraLessons: number;
    passedQuizScores?: number[];
    failedModuleAttempt?: { moduleIndex: number; score: number };
  },
): CourseEnrollment["progress"] {
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

function createSeedState(): PortalState {
  const baseCourse = getProtectedCourseRecords()[0]?.course;
  const users = buildSeedUsers();

  if (!baseCourse) {
    return {
      version: 2,
      users,
      enrollments: [],
      customCourses: [],
      courseModuleExtensions: [],
    };
  }

  const enrollments: CourseEnrollment[] = [
    buildSeedEnrollment(
      "learner-casey-holt",
      baseCourse.id,
      createInitialCourseProgress(baseCourse.id),
    ),
    buildSeedEnrollment(
      "learner-shyanne-brooks",
      baseCourse.id,
      seedLearnerProgress(baseCourse, {
        completedModules: 6,
        extraLessons: 1,
        passedQuizScores: [100, 100, 100, 83, 100, 83],
      }),
    ),
    buildSeedEnrollment(
      "learner-alex-carter",
      baseCourse.id,
      seedLearnerProgress(baseCourse, {
        completedModules: 4,
        extraLessons: 1,
        passedQuizScores: [100, 80, 80, 80],
      }),
    ),
    buildSeedEnrollment(
      "learner-jordan-reed",
      baseCourse.id,
      seedLearnerProgress(baseCourse, {
        completedModules: 0,
        extraLessons: 5,
        failedModuleAttempt: { moduleIndex: 0, score: 50 },
      }),
    ),
    buildSeedEnrollment(
      "learner-taylor-nguyen",
      baseCourse.id,
      seedLearnerProgress(baseCourse, {
        completedModules: 5,
        extraLessons: 1,
        passedQuizScores: [100, 80, 80, 83, 80],
      }),
    ),
  ];

  return {
    version: 2,
    users,
    enrollments,
    customCourses: [],
    courseModuleExtensions: [],
  };
}

function normalizeState(raw: unknown): PortalState {
  const fallback = createSeedState();

  if (!raw || typeof raw !== "object") {
    return fallback;
  }

  const candidate = raw as Partial<PortalState> & {
    version?: number;
    users?: Array<Partial<PortalUser>>;
    enrollments?: CourseEnrollment[];
  };

  return {
    version: 2,
    users: (candidate.users ?? fallback.users).map((user) => ({
      id: user.id ?? createId("user"),
      name: user.name ?? "Unknown User",
      email: user.email ?? "",
      password: user.password ?? "learner123",
      role: user.role === "manager" ? "manager" : "learner",
      title: user.title ?? "Team Member",
      department: user.department ?? "General",
      active: user.active ?? true,
      activeCourseId: user.activeCourseId ?? defaultProtectedCourseId,
    })),
    enrollments: candidate.enrollments ?? fallback.enrollments,
    customCourses: candidate.version === 2 ? candidate.customCourses ?? [] : [],
    courseModuleExtensions:
      candidate.version === 2 ? candidate.courseModuleExtensions ?? [] : [],
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
  return normalizeState(JSON.parse(raw));
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
  const completedWithoutFinal =
    !activeCourse.finalAssessment &&
    activeCourse.modules.length > 0 &&
    stats.completedModules === activeCourse.modules.length;
  const completed =
    enrollment.managerMarkedComplete === true ||
    stats.finalAssessmentPassed ||
    completedWithoutFinal;

  enrollment.completedAt = completed ? enrollment.completedAt ?? now() : null;
}

function sanitizeUser(user: PortalUser): PublicUser {
  const { password, ...publicUser } = user;
  void password;
  return publicUser;
}

function resolveAssessment(
  activeCourse: Course,
  assessmentId: string,
  moduleId?: string,
) {
  if (activeCourse.finalAssessment?.id === assessmentId) {
    return {
      assessment: activeCourse.finalAssessment,
      assessmentType: "final_assessment" as const,
      moduleId: undefined,
    };
  }

  if (!moduleId) {
    return null;
  }

  const courseModule = findModule(activeCourse, moduleId);

  if (!courseModule?.quiz || courseModule.quiz.id !== assessmentId) {
    return null;
  }

  return {
    assessment: courseModule.quiz,
    assessmentType: "module_quiz" as const,
    moduleId: courseModule.id,
  };
}

function createManagedLesson(
  lessonId: string,
  title: string,
  description: string,
  objectives: string[],
  keyTakeaways: string[],
): Lesson {
  return {
    id: lessonId,
    title,
    description,
    sourceSlides: [],
    objectives,
    keyTakeaways,
    content: [
      { type: "paragraph", text: description },
      { type: "bullets", items: keyTakeaways },
    ],
    knowledgeChecks: [],
  };
}

function createManagedModule(input: {
  department: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  lessonTitle?: string;
  lessonDescription?: string;
  objectivesText?: string;
  keyTakeawaysText?: string;
}): Module {
  const moduleSlug = slugify(input.title) || createId("module");
  const moduleId = `manager-${moduleSlug}-${createId("m").slice(-4)}`;
  const objectives = splitLines(input.objectivesText ?? "");
  const keyTakeaways = splitLines(input.keyTakeawaysText ?? "");
  const lessonTitle = input.lessonTitle?.trim() || `${input.title} Orientation`;
  const lessonDescription =
    input.lessonDescription?.trim() ||
    `Manager-authored onboarding content for ${input.department}.`;
  const fallbackTakeaways =
    keyTakeaways.length > 0
      ? keyTakeaways
      : [
          input.description.trim() || `${input.department} onboarding foundation.`,
          `Use this module as the starting point for ${input.department} learners.`,
        ];

  return {
    id: moduleId,
    title: input.title.trim(),
    description: input.description.trim(),
    estimatedMinutes: input.estimatedMinutes,
    sourceSlides: [],
    icon: "book-open",
    lessons: [
      createManagedLesson(
        `${moduleId}-lesson-1`,
        lessonTitle,
        lessonDescription,
        objectives.length > 0
          ? objectives
          : [
              `Understand the purpose of ${input.title.trim()}.`,
              `Review the initial guidance for the ${input.department} department.`,
            ],
        fallbackTakeaways,
      ),
    ],
  };
}

export async function readPortalState() {
  return readState();
}

export async function listCourses() {
  const state = await readState();
  return getCourseRecordsFromState(state);
}

export async function getCourseRecord(courseId: string) {
  const state = await readState();
  return getCourseRecordFromState(state, courseId);
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
  const state = await readState();
  const activeCourseId = getDefaultCourseIdForUser(state, userId);
  const record = getCourseRecordFromState(state, activeCourseId);

  if (!record) {
    return null;
  }

  return {
    record,
    course: record.course,
    enrollment:
      state.enrollments.find(
        (item) => item.userId === userId && item.courseId === record.courseId,
      ) ?? null,
  };
}

export async function markLessonCompleteForUser(
  userId: string,
  courseId: string,
  lessonId: string,
) {
  return mutateState((state) => {
    const record = getCourseRecordFromState(state, courseId);

    if (!record) {
      throw new Error("Course not found.");
    }

    const enrollment = getOrCreateEnrollmentRecord(state, userId, courseId);
    const lessonMatch = findLesson(record.course, lessonId);

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

    syncCompletionState(enrollment, record.course);
    return enrollment;
  });
}

export async function submitAssessmentForUser(input: {
  userId: string;
  courseId: string;
  assessmentId: string;
  moduleId?: string;
  answers: Record<string, QuestionResponse>;
}) {
  return mutateState((state) => {
    const record = getCourseRecordFromState(state, input.courseId);

    if (!record) {
      throw new Error("Course not found.");
    }

    const enrollment = getOrCreateEnrollmentRecord(state, input.userId, input.courseId);
    const resolved = resolveAssessment(record.course, input.assessmentId, input.moduleId);

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
      !record.course.modules.every((module) => getModuleStatus(module, enrollment.progress).completed)
    ) {
      throw new Error("Final assessment is locked.");
    }

    const outcome = scoreAssessment(resolved.assessment, input.answers);
    const completedAt = now();
    const attempt: AssessmentAttempt = {
      assessmentId: resolved.assessment.id,
      courseId: input.courseId,
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
          : `Submitted ${findModule(record.course, resolved.moduleId ?? "")?.title ?? "module"} quiz with ${attempt.scorePercent}%`,
      assessmentId: resolved.assessment.id,
      moduleId: resolved.moduleId,
      scorePercent: attempt.scorePercent,
    });
    syncCompletionState(enrollment, record.course);

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
  courseId: string,
  assigned: boolean,
) {
  return mutateState((state) => {
    const user = state.users.find((item) => item.id === userId);
    const record = getCourseRecordFromState(state, courseId);

    if (!user || !record) {
      throw new Error("User or course not found.");
    }

    const enrollment = getOrCreateEnrollmentRecord(state, userId, courseId);
    enrollment.assigned = assigned;
    enrollment.assignedAt = assigned ? enrollment.assignedAt ?? now() : enrollment.assignedAt;

    if (assigned && !user.activeCourseId) {
      user.activeCourseId = courseId;
    }

    appendActivity(enrollment, {
      actorUserId,
      type: "assignment_updated",
      message: assigned
        ? `Manager assigned ${record.course.title}.`
        : `Manager unassigned ${record.course.title}.`,
    });
    return enrollment;
  });
}

export async function setActiveCourseForUser(
  actorUserId: string,
  userId: string,
  courseId: string,
) {
  return mutateState((state) => {
    const user = state.users.find((item) => item.id === userId);
    const record = getCourseRecordFromState(state, courseId);

    if (!user || !record) {
      throw new Error("User or course not found.");
    }

    const enrollment = getOrCreateEnrollmentRecord(state, userId, courseId);
    enrollment.assigned = true;
    enrollment.assignedAt = enrollment.assignedAt ?? now();
    user.activeCourseId = courseId;
    user.department = record.department;

    appendActivity(enrollment, {
      actorUserId,
      type: "active_course_updated",
      message: `Manager set ${record.course.title} as the active onboarding program.`,
    });

    return {
      user,
      enrollment,
    };
  });
}

export async function setCourseLockedForUser(
  actorUserId: string,
  userId: string,
  courseId: string,
  locked: boolean,
) {
  return mutateState((state) => {
    const record = getCourseRecordFromState(state, courseId);

    if (!record) {
      throw new Error("Course not found.");
    }

    const enrollment = getOrCreateEnrollmentRecord(state, userId, courseId);
    enrollment.locked = locked;
    appendActivity(enrollment, {
      actorUserId,
      type: "course_locked",
      message: locked
        ? `Manager locked ${record.course.title}.`
        : `Manager unlocked ${record.course.title}.`,
    });
    return enrollment;
  });
}

export async function setModuleLockedForUser(
  actorUserId: string,
  userId: string,
  courseId: string,
  moduleId: string,
  locked: boolean,
) {
  return mutateState((state) => {
    const enrollment = getOrCreateEnrollmentRecord(state, userId, courseId);
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
  courseId: string,
  unlocked: boolean,
) {
  return mutateState((state) => {
    const record = getCourseRecordFromState(state, courseId);

    if (!record) {
      throw new Error("Course not found.");
    }

    const enrollment = getOrCreateEnrollmentRecord(state, userId, courseId);
    enrollment.finalAssessmentUnlocked = unlocked;
    appendActivity(enrollment, {
      actorUserId,
      type: "final_override_updated",
      message: unlocked
        ? "Manager unlocked the final assessment early."
        : "Manager removed the final assessment override.",
      assessmentId: record.course.finalAssessment?.id,
    });
    return enrollment;
  });
}

export async function setManagerCompletionForUser(
  actorUserId: string,
  userId: string,
  courseId: string,
  completed: boolean,
) {
  return mutateState((state) => {
    const record = getCourseRecordFromState(state, courseId);

    if (!record) {
      throw new Error("Course not found.");
    }

    const enrollment = getOrCreateEnrollmentRecord(state, userId, courseId);
    enrollment.managerMarkedComplete = completed;
    enrollment.managerMarkedAt = now();
    appendActivity(enrollment, {
      actorUserId,
      type: "manager_completion_updated",
      message: completed
        ? "Manager marked onboarding complete."
        : "Manager marked onboarding incomplete.",
    });
    syncCompletionState(enrollment, record.course);
    return enrollment;
  });
}

export async function resetProgressForUser(
  actorUserId: string,
  userId: string,
  courseId: string,
) {
  return mutateState((state) => {
    const enrollment = getOrCreateEnrollmentRecord(state, userId, courseId);
    enrollment.progress = createInitialCourseProgress(courseId);
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

export async function createDepartmentProgram(
  actorUserId: string,
  input: {
    department: string;
    title: string;
    description: string;
    audience: string;
    starterModuleTitle?: string;
    starterLessonTitle?: string;
    starterLessonDescription?: string;
    objectivesText?: string;
    keyTakeawaysText?: string;
  },
) {
  return mutateState((state) => {
    const departmentSlug = slugify(input.department);
    const titleSlug = slugify(input.title);
    const courseId = `${departmentSlug || "department"}-${titleSlug || "program"}-${createId("course").slice(-4)}`;
    const starterModule = createManagedModule({
      department: input.department,
      title: input.starterModuleTitle?.trim() || `${input.department.trim()} Foundations`,
      description:
        input.description.trim() ||
        `Initial onboarding program for ${input.department.trim()}.`,
      estimatedMinutes: 20,
      lessonTitle: input.starterLessonTitle,
      lessonDescription: input.starterLessonDescription,
      objectivesText: input.objectivesText,
      keyTakeawaysText: input.keyTakeawaysText,
    });

    const course: Course = {
      id: courseId,
      title: input.title.trim(),
      description: input.description.trim(),
      audience: input.audience.trim(),
      estimatedMinutes: starterModule.estimatedMinutes,
      modules: [starterModule],
    };

    const record: ManagedCourseRecord = {
      courseId,
      department: input.department.trim(),
      source: "manager",
      protected: false,
      createdAt: now(),
      updatedAt: now(),
      course,
    };

    state.customCourses.push(record);
    return record;
  });
}

export async function addModuleToCourse(
  actorUserId: string,
  input: {
    courseId: string;
    department: string;
    title: string;
    description: string;
    estimatedMinutes: number;
    lessonTitle?: string;
    lessonDescription?: string;
    objectivesText?: string;
    keyTakeawaysText?: string;
  },
) {
  return mutateState((state) => {
    const record = getCourseRecordFromState(state, input.courseId);

    if (!record) {
      throw new Error("Course not found.");
    }

    const nextModule = createManagedModule({
      department: input.department,
      title: input.title,
      description: input.description,
      estimatedMinutes: input.estimatedMinutes,
      lessonTitle: input.lessonTitle,
      lessonDescription: input.lessonDescription,
      objectivesText: input.objectivesText,
      keyTakeawaysText: input.keyTakeawaysText,
    });

    const existingExtension = state.courseModuleExtensions.find(
      (item) => item.courseId === input.courseId,
    );

    if (existingExtension) {
      existingExtension.modules.push(nextModule);
      existingExtension.updatedAt = now();
    } else {
      state.courseModuleExtensions.push({
        courseId: input.courseId,
        createdAt: now(),
        updatedAt: now(),
        createdByUserId: actorUserId,
        modules: [nextModule],
      });
    }

    const customCourse = state.customCourses.find((item) => item.courseId === input.courseId);

    if (customCourse) {
      customCourse.updatedAt = now();
      customCourse.course.estimatedMinutes += input.estimatedMinutes;
    }

    return nextModule;
  });
}

export { sanitizeUser as toPublicUser };
