import type {
  Assessment,
  AssessmentAttempt,
  AssessmentQuestionResult,
  Course,
  CourseProgress,
  CourseStats,
  Module,
  ModuleStatus,
  Question,
  QuestionResponse,
  ResumeTarget,
} from "./types";

function normalizeArrayValue(value: string[] | string) {
  return Array.isArray(value) ? value : [value];
}

function sortArray(value: string[]) {
  return [...value].sort((left, right) => left.localeCompare(right));
}

function answersMatch(
  correctAnswer: Question["correctAnswer"],
  response: QuestionResponse,
) {
  if (typeof correctAnswer === "boolean") {
    return response === correctAnswer;
  }

  if (Array.isArray(correctAnswer)) {
    if (!Array.isArray(response)) {
      return false;
    }

    const expected = sortArray(correctAnswer);
    const received = sortArray(response);
    return JSON.stringify(expected) === JSON.stringify(received);
  }

  if (typeof correctAnswer === "string") {
    if (Array.isArray(response)) {
      return JSON.stringify(sortArray(response)) ===
        JSON.stringify(sortArray(normalizeArrayValue(correctAnswer)));
    }

    return response === correctAnswer;
  }

  return false;
}

export function createInitialCourseProgress(courseId: string): CourseProgress {
  return {
    courseId,
    startedAt: null,
    updatedAt: null,
    completedLessonIds: [],
    attempts: [],
  };
}

export function evaluateQuestion(
  question: Question,
  response: QuestionResponse,
): AssessmentQuestionResult {
  return {
    questionId: question.id,
    correct: answersMatch(question.correctAnswer, response),
    expected: question.correctAnswer,
    received: response,
  };
}

export function scoreAssessment(
  assessment: Assessment,
  answers: Record<string, QuestionResponse>,
) {
  const results = assessment.questions.map((question) =>
    evaluateQuestion(question, answers[question.id] ?? null),
  );

  const earnedPoints = results.filter((result) => result.correct).length;
  const totalPoints = assessment.questions.length;
  const scorePercent =
    totalPoints === 0 ? 0 : Math.round((earnedPoints / totalPoints) * 100);

  return {
    scorePercent,
    earnedPoints,
    totalPoints,
    passed: scorePercent >= assessment.passingScore,
    results,
  };
}

function stampProgress(progress: CourseProgress) {
  const timestamp = new Date().toISOString();

  return {
    ...progress,
    startedAt: progress.startedAt ?? timestamp,
    updatedAt: timestamp,
  };
}

export function markLessonComplete(
  progress: CourseProgress,
  lessonId: string,
): CourseProgress {
  if (progress.completedLessonIds.includes(lessonId)) {
    return stampProgress(progress);
  }

  return stampProgress({
    ...progress,
    completedLessonIds: [...progress.completedLessonIds, lessonId],
  });
}

export function isLessonComplete(progress: CourseProgress, lessonId: string) {
  return progress.completedLessonIds.includes(lessonId);
}

export function getAssessmentAttempts(
  progress: CourseProgress,
  assessmentId: string,
) {
  return progress.attempts.filter((attempt) => attempt.assessmentId === assessmentId);
}

export function getBestAssessmentAttempt(
  progress: CourseProgress,
  assessmentId: string,
) {
  return getAssessmentAttempts(progress, assessmentId).sort((left, right) => {
    if (right.scorePercent !== left.scorePercent) {
      return right.scorePercent - left.scorePercent;
    }

    return right.completedAt.localeCompare(left.completedAt);
  })[0];
}

export function hasPassedAssessment(
  progress: CourseProgress,
  assessmentId: string,
) {
  return getAssessmentAttempts(progress, assessmentId).some(
    (attempt) => attempt.passed,
  );
}

export function recordAssessmentAttempt(
  progress: CourseProgress,
  attempt: AssessmentAttempt,
): CourseProgress {
  return stampProgress({
    ...progress,
    attempts: [...progress.attempts, attempt],
  });
}

export function getModuleStatus(
  module: Module,
  progress: CourseProgress,
): ModuleStatus {
  const completedLessons = module.lessons.filter((lesson) =>
    isLessonComplete(progress, lesson.id),
  ).length;
  const totalLessons = module.lessons.length;
  const quizPassed = module.quiz
    ? hasPassedAssessment(progress, module.quiz.id)
    : true;
  const quizAttempted = module.quiz
    ? getAssessmentAttempts(progress, module.quiz.id).length > 0
    : false;

  const lessonWeight = totalLessons + (module.quiz ? 1 : 0);
  let weightedCompletion = completedLessons;

  if (module.quiz) {
    weightedCompletion += quizPassed ? 1 : quizAttempted ? 0.5 : 0;
  }

  const progressPercent =
    lessonWeight === 0 ? 100 : Math.round((weightedCompletion / lessonWeight) * 100);

  return {
    completedLessons,
    totalLessons,
    quizPassed,
    quizAttempted,
    progressPercent,
    completed: completedLessons === totalLessons && quizPassed,
  };
}

export function getCourseStats(
  course: Course,
  progress: CourseProgress,
): CourseStats {
  const totalLessons = course.modules.reduce(
    (sum, module) => sum + module.lessons.length,
    0,
  );
  const completedLessons = course.modules.reduce(
    (sum, module) => sum + getModuleStatus(module, progress).completedLessons,
    0,
  );
  const moduleStatuses = course.modules.map((module) =>
    getModuleStatus(module, progress),
  );
  const completedModules = moduleStatuses.filter((status) => status.completed).length;
  const moduleQuizPasses = course.modules.filter(
    (module) => module.quiz && hasPassedAssessment(progress, module.quiz.id),
  ).length;
  const finalAssessmentPassed = course.finalAssessment
    ? hasPassedAssessment(progress, course.finalAssessment.id)
    : false;

  const totalUnits =
    totalLessons +
    course.modules.filter((module) => module.quiz).length +
    (course.finalAssessment ? 1 : 0);
  const completedUnits =
    completedLessons + moduleQuizPasses + (finalAssessmentPassed ? 1 : 0);
  const completionPercent =
    totalUnits === 0 ? 100 : Math.round((completedUnits / totalUnits) * 100);

  return {
    completedLessons,
    totalLessons,
    completedModules,
    totalModules: course.modules.length,
    moduleQuizPasses,
    finalAssessmentPassed,
    completionPercent,
  };
}

export function getResumeTarget(
  course: Course,
  progress: CourseProgress,
): ResumeTarget {
  for (const courseModule of course.modules) {
    for (const lesson of courseModule.lessons) {
      if (!isLessonComplete(progress, lesson.id)) {
        return {
          kind: "lesson",
          moduleId: courseModule.id,
          lessonId: lesson.id,
        };
      }
    }

    if (courseModule.quiz && !hasPassedAssessment(progress, courseModule.quiz.id)) {
      return {
        kind: "module_quiz",
        moduleId: courseModule.id,
      };
    }
  }

  if (course.finalAssessment && !hasPassedAssessment(progress, course.finalAssessment.id)) {
    return {
      kind: "final_assessment",
    };
  }

  return {
    kind: "certificate",
  };
}

export function findLesson(course: Course, lessonId: string) {
  for (const courseModule of course.modules) {
    const lesson = courseModule.lessons.find((item) => item.id === lessonId);

    if (lesson) {
      return { module: courseModule, lesson };
    }
  }

  return null;
}

export function findModule(course: Course, moduleId: string) {
  return course.modules.find((courseModule) => courseModule.id === moduleId) ?? null;
}
