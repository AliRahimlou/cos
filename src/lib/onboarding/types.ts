export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "bullets"; items: string[] }
  | { type: "callout"; title?: string; text: string }
  | { type: "table"; headers: string[]; rows: string[][] }
  | {
      type: "image";
      src?: string;
      alt: string;
      caption?: string;
      width?: number;
      height?: number;
    }
  | { type: "quote"; text: string }
  | { type: "checklist"; items: string[] };

export type QuestionChoice = {
  id: string;
  text: string;
};

export type Question = {
  id: string;
  type: "single" | "multiple" | "true_false" | "scenario";
  prompt: string;
  choices?: QuestionChoice[];
  correctAnswer: string | string[] | boolean;
  explanation: string;
  sourceSlides: number[];
  difficulty?: "easy" | "medium" | "hard";
  remediationLessonId?: string;
};

export type Assessment = {
  id: string;
  title: string;
  description?: string;
  passingScore: number;
  questions: Question[];
};

export type Lesson = {
  id: string;
  title: string;
  description?: string;
  sourceSlides: number[];
  objectives: string[];
  keyTakeaways: string[];
  content: ContentBlock[];
  knowledgeChecks?: Question[];
};

export type Module = {
  id: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  sourceSlides: number[];
  lessons: Lesson[];
  quiz?: Assessment;
  icon: string;
};

export type Course = {
  id: string;
  title: string;
  description: string;
  audience: string;
  estimatedMinutes: number;
  modules: Module[];
  finalAssessment?: Assessment;
};

export type QuestionResponse = string | string[] | boolean | null;

export type AssessmentQuestionResult = {
  questionId: string;
  correct: boolean;
  expected: string | string[] | boolean;
  received: QuestionResponse;
};

export type AssessmentAttempt = {
  assessmentId: string;
  courseId: string;
  moduleId?: string;
  lessonId?: string;
  assessmentType: "module_quiz" | "final_assessment";
  scorePercent: number;
  earnedPoints: number;
  totalPoints: number;
  passed: boolean;
  completedAt: string;
  answers: Record<string, QuestionResponse>;
};

export type ResumeTarget = {
  kind: "lesson" | "module_quiz" | "final_assessment" | "certificate";
  moduleId?: string;
  lessonId?: string;
};

export type CourseProgress = {
  courseId: string;
  startedAt: string | null;
  updatedAt: string | null;
  completedLessonIds: string[];
  attempts: AssessmentAttempt[];
};

export type ModuleStatus = {
  completedLessons: number;
  totalLessons: number;
  quizPassed: boolean;
  quizAttempted: boolean;
  progressPercent: number;
  completed: boolean;
};

export type CourseStats = {
  completedLessons: number;
  totalLessons: number;
  completedModules: number;
  totalModules: number;
  moduleQuizPasses: number;
  finalAssessmentPassed: boolean;
  completionPercent: number;
};
