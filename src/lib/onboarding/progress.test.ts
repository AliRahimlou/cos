import { describe, expect, it } from "vitest";

import {
  createInitialCourseProgress,
  evaluateQuestion,
  getModuleStatus,
  getResumeTarget,
  markLessonComplete,
  recordAssessmentAttempt,
  scoreAssessment,
} from "./progress";
import type { Assessment, Course, Module, Question } from "./types";

const lessonQuestion: Question = {
  id: "q-multi",
  type: "multiple",
  prompt: "Select the deck-supported items.",
  choices: [
    { id: "a", text: "Option A" },
    { id: "b", text: "Option B" },
    { id: "c", text: "Option C" },
  ],
  correctAnswer: ["a", "b"],
  explanation: "A and B are correct.",
  sourceSlides: [1],
};

const assessment: Assessment = {
  id: "quiz-1",
  title: "Quiz 1",
  passingScore: 80,
  questions: [
    {
      id: "q1",
      type: "single",
      prompt: "Single answer",
      choices: [
        { id: "a", text: "Wrong" },
        { id: "b", text: "Right" },
      ],
      correctAnswer: "b",
      explanation: "B is correct.",
      sourceSlides: [1],
    },
    {
      id: "q2",
      type: "true_false",
      prompt: "True or false",
      correctAnswer: true,
      explanation: "True is correct.",
      sourceSlides: [2],
    },
    {
      id: "q3",
      type: "multiple",
      prompt: "Multiple answer",
      choices: [
        { id: "a", text: "Yes" },
        { id: "b", text: "No" },
        { id: "c", text: "Also yes" },
      ],
      correctAnswer: ["a", "c"],
      explanation: "A and C are correct.",
      sourceSlides: [3],
    },
    {
      id: "q4",
      type: "scenario",
      prompt: "Scenario",
      choices: [
        { id: "a", text: "Wrong" },
        { id: "b", text: "Still wrong" },
        { id: "c", text: "Correct" },
      ],
      correctAnswer: "c",
      explanation: "C is correct.",
      sourceSlides: [4],
    },
    {
      id: "q5",
      type: "single",
      prompt: "Single answer 2",
      choices: [
        { id: "a", text: "Correct" },
        { id: "b", text: "Wrong" },
      ],
      correctAnswer: "a",
      explanation: "A is correct.",
      sourceSlides: [5],
    },
  ],
};

const quizModule: Module = {
  id: "module-1",
  title: "Module 1",
  description: "Test module",
  estimatedMinutes: 10,
  sourceSlides: [1, 2],
  icon: "target",
  lessons: [
    {
      id: "lesson-1",
      title: "Lesson 1",
      sourceSlides: [1],
      objectives: ["Understand lesson 1"],
      keyTakeaways: ["Lesson 1 complete"],
      content: [{ type: "paragraph", text: "Lesson 1" }],
    },
    {
      id: "lesson-2",
      title: "Lesson 2",
      sourceSlides: [2],
      objectives: ["Understand lesson 2"],
      keyTakeaways: ["Lesson 2 complete"],
      content: [{ type: "paragraph", text: "Lesson 2" }],
    },
  ],
  quiz: assessment,
};

const sampleCourse: Course = {
  id: "course-1",
  title: "Course 1",
  description: "Course description",
  audience: "Sales reps",
  estimatedMinutes: 20,
  modules: [quizModule],
  finalAssessment: {
    id: "final-1",
    title: "Final 1",
    passingScore: 85,
    questions: [
      {
        id: "final-q1",
        type: "single",
        prompt: "Final question",
        choices: [
          { id: "a", text: "Correct" },
          { id: "b", text: "Wrong" },
        ],
        correctAnswer: "a",
        explanation: "A is correct.",
        sourceSlides: [6],
      },
    ],
  },
};

describe("evaluateQuestion", () => {
  it("treats multi-select responses as order-insensitive", () => {
    const result = evaluateQuestion(lessonQuestion, ["b", "a"]);
    expect(result.correct).toBe(true);
  });
});

describe("scoreAssessment", () => {
  it("passes when the score meets the threshold", () => {
    const result = scoreAssessment(assessment, {
      q1: "b",
      q2: true,
      q3: ["c", "a"],
      q4: "c",
      q5: "b",
    });

    expect(result.earnedPoints).toBe(4);
    expect(result.scorePercent).toBe(80);
    expect(result.passed).toBe(true);
  });

  it("fails when the score is below the threshold", () => {
    const result = scoreAssessment(assessment, {
      q1: "a",
      q2: true,
      q3: ["c", "a"],
      q4: "b",
      q5: "b",
    });

    expect(result.earnedPoints).toBe(2);
    expect(result.scorePercent).toBe(40);
    expect(result.passed).toBe(false);
  });
});

describe("getModuleStatus", () => {
  it("shows partial quiz credit when the quiz was attempted but not passed", () => {
    let progress = createInitialCourseProgress(sampleCourse.id);
    progress = markLessonComplete(progress, "lesson-1");
    progress = markLessonComplete(progress, "lesson-2");
    progress = recordAssessmentAttempt(progress, {
      assessmentId: assessment.id,
      courseId: sampleCourse.id,
      moduleId: quizModule.id,
      assessmentType: "module_quiz",
      scorePercent: 60,
      earnedPoints: 3,
      totalPoints: 5,
      passed: false,
      completedAt: "2026-03-27T10:00:00.000Z",
      answers: {},
    });

    const status = getModuleStatus(quizModule, progress);

    expect(status.completedLessons).toBe(2);
    expect(status.quizAttempted).toBe(true);
    expect(status.quizPassed).toBe(false);
    expect(status.progressPercent).toBe(83);
    expect(status.completed).toBe(false);
  });
});

describe("getResumeTarget", () => {
  it("returns the first incomplete lesson first, then the module quiz, then the final, then the certificate", () => {
    let progress = createInitialCourseProgress(sampleCourse.id);

    expect(getResumeTarget(sampleCourse, progress)).toEqual({
      kind: "lesson",
      moduleId: "module-1",
      lessonId: "lesson-1",
    });

    progress = markLessonComplete(progress, "lesson-1");
    progress = markLessonComplete(progress, "lesson-2");

    expect(getResumeTarget(sampleCourse, progress)).toEqual({
      kind: "module_quiz",
      moduleId: "module-1",
    });

    progress = recordAssessmentAttempt(progress, {
      assessmentId: assessment.id,
      courseId: sampleCourse.id,
      moduleId: quizModule.id,
      assessmentType: "module_quiz",
      scorePercent: 100,
      earnedPoints: 5,
      totalPoints: 5,
      passed: true,
      completedAt: "2026-03-27T10:00:00.000Z",
      answers: {},
    });

    expect(getResumeTarget(sampleCourse, progress)).toEqual({
      kind: "final_assessment",
    });

    progress = recordAssessmentAttempt(progress, {
      assessmentId: "final-1",
      courseId: sampleCourse.id,
      assessmentType: "final_assessment",
      scorePercent: 100,
      earnedPoints: 1,
      totalPoints: 1,
      passed: true,
      completedAt: "2026-03-27T11:00:00.000Z",
      answers: {},
    });

    expect(getResumeTarget(sampleCourse, progress)).toEqual({
      kind: "certificate",
    });
  });
});
