"use client";

import { useState, useSyncExternalStore } from "react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  BrainCircuit,
  Building2,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Lock,
  Package,
  PhoneCall,
  Printer,
  RotateCcw,
  Target,
  Trophy,
  Users,
} from "lucide-react";

import { AssessmentRunner, type AssessmentReview } from "@/components/onboarding/assessment-runner";
import { ContentBlockRenderer } from "@/components/onboarding/content-block-renderer";
import { KnowledgeCheckPanel } from "@/components/onboarding/knowledge-check-panel";
import { SourceSlideBadges } from "@/components/onboarding/source-slide-badges";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { salesRepOnboardingCourse } from "@/content/onboarding/sales-rep/course";
import {
  findLesson,
  findModule,
  getBestAssessmentAttempt,
  getCourseStats,
  getModuleStatus,
  getResumeTarget,
  isLessonComplete,
  markLessonComplete,
  recordAssessmentAttempt,
} from "@/lib/onboarding/progress";
import {
  clearCourseProgress,
  getCourseProgressSnapshot,
  getServerCourseProgressSnapshot,
  saveCourseProgress,
  subscribeCourseProgress,
} from "@/lib/onboarding/progress-store";
import { cn } from "@/lib/utils";
import type { Module, Question } from "@/lib/onboarding/types";

type CourseView =
  | { kind: "landing" }
  | { kind: "lesson"; moduleId: string; lessonId: string }
  | { kind: "module_quiz"; moduleId: string }
  | { kind: "final_assessment" }
  | {
      kind: "assessment_result";
      assessmentTitle: string;
      assessmentType: "module_quiz" | "final_assessment";
      moduleId?: string;
      review: AssessmentReview;
    }
  | { kind: "certificate" };

const moduleIconMap = {
  building2: Building2,
  target: Target,
  users: Users,
  "message-square": PhoneCall,
  printer: Printer,
  package: Package,
  "clipboard-check": ClipboardCheck,
} as const;

function getModuleIcon(icon: Module["icon"]) {
  return moduleIconMap[icon as keyof typeof moduleIconMap] ?? BookOpen;
}

function formatExpectedAnswer(question: Question) {
  if (typeof question.correctAnswer === "boolean") {
    return question.correctAnswer ? "True" : "False";
  }

  if (Array.isArray(question.correctAnswer)) {
    const correctAnswers = question.correctAnswer;
    return (question.choices ?? [])
      .filter((choice) => correctAnswers.includes(choice.id))
      .map((choice) => choice.text)
      .join(", ");
  }

  return (
    (question.choices ?? []).find((choice) => choice.id === question.correctAnswer)?.text ??
    question.correctAnswer
  );
}

function getAssessment(reviewView: Extract<CourseView, { kind: "assessment_result" }>) {
  if (reviewView.assessmentType === "final_assessment") {
    return salesRepOnboardingCourse.finalAssessment;
  }

  return reviewView.moduleId
    ? findModule(salesRepOnboardingCourse, reviewView.moduleId)?.quiz
    : null;
}

export function SalesRepOnboardingExperience() {
  const course = salesRepOnboardingCourse;
  const lessonSequence = course.modules.flatMap((courseModule) =>
    courseModule.lessons.map((lesson) => ({
      moduleId: courseModule.id,
      lessonId: lesson.id,
    })),
  );

  const progress = useSyncExternalStore(
    (callback) => subscribeCourseProgress(course.id, callback),
    () => getCourseProgressSnapshot(course.id),
    () => getServerCourseProgressSnapshot(course.id),
  );
  const [view, setView] = useState<CourseView>({ kind: "landing" });
  const [attemptSeed, setAttemptSeed] = useState(0);

  const stats = getCourseStats(course, progress);
  const resumeTarget = getResumeTarget(course, progress);
  const finalAssessment = course.finalAssessment;
  const finalUnlocked = course.modules.every(
    (module) => getModuleStatus(module, progress).completed,
  );
  const bestFinalAttempt = finalAssessment
    ? getBestAssessmentAttempt(progress, finalAssessment.id)
    : undefined;

  function openTarget(target = resumeTarget) {
    if (target.kind === "lesson" && target.moduleId && target.lessonId) {
      setView({
        kind: "lesson",
        moduleId: target.moduleId,
        lessonId: target.lessonId,
      });
      return;
    }

    if (target.kind === "module_quiz" && target.moduleId) {
      setView({
        kind: "module_quiz",
        moduleId: target.moduleId,
      });
      return;
    }

    if (target.kind === "final_assessment") {
      setView({ kind: "final_assessment" });
      return;
    }

    setView({ kind: "certificate" });
  }

  function handleResetProgress() {
    if (!window.confirm("Clear saved progress for this course on this device?")) {
      return;
    }

    clearCourseProgress(course.id);
    setView({ kind: "landing" });
    setAttemptSeed((current) => current + 1);
  }

  function markComplete(lessonId: string) {
    saveCourseProgress(markLessonComplete(progress, lessonId));
  }

  function continueFromLesson(courseModule: Module, lessonId: string) {
    saveCourseProgress(markLessonComplete(progress, lessonId));

    const moduleLessonIndex = courseModule.lessons.findIndex(
      (lesson) => lesson.id === lessonId,
    );
    const nextLesson = courseModule.lessons[moduleLessonIndex + 1];

    if (nextLesson) {
      setView({
        kind: "lesson",
        moduleId: courseModule.id,
        lessonId: nextLesson.id,
      });
      return;
    }

    setView({
      kind: "module_quiz",
      moduleId: courseModule.id,
    });
  }

  function handleModuleQuizSubmitted(moduleId: string, review: AssessmentReview) {
    const courseModule = findModule(course, moduleId);

    if (!courseModule?.quiz) {
      return;
    }

    saveCourseProgress(recordAssessmentAttempt(progress, review.attempt));
    setView({
      kind: "assessment_result",
      assessmentTitle: courseModule.quiz.title,
      assessmentType: "module_quiz",
      moduleId,
      review,
    });
  }

  function handleFinalAssessmentSubmitted(review: AssessmentReview) {
    if (!finalAssessment) {
      return;
    }

    saveCourseProgress(recordAssessmentAttempt(progress, review.attempt));
    setView({
      kind: "assessment_result",
      assessmentTitle: finalAssessment.title,
      assessmentType: "final_assessment",
      review,
    });
  }

  function retakeAssessment(resultView: Extract<CourseView, { kind: "assessment_result" }>) {
    setAttemptSeed((current) => current + 1);

    if (resultView.assessmentType === "module_quiz" && resultView.moduleId) {
      setView({
        kind: "module_quiz",
        moduleId: resultView.moduleId,
      });
      return;
    }

    setView({ kind: "final_assessment" });
  }

  function goToRecommendedLesson(
    resultView: Extract<CourseView, { kind: "assessment_result" }>,
  ) {
    const remediationLessonId = resultView.review.results.find(
      (item) => !item.result.correct && item.question.remediationLessonId,
    )?.question.remediationLessonId;

    if (!remediationLessonId) {
      setView({ kind: "landing" });
      return;
    }

    const match = findLesson(course, remediationLessonId);

    if (!match) {
      setView({ kind: "landing" });
      return;
    }

    setView({
      kind: "lesson",
      moduleId: match.module.id,
      lessonId: match.lesson.id,
    });
  }

  function continueAfterAssessment(resultView: Extract<CourseView, { kind: "assessment_result" }>) {
    if (resultView.assessmentType === "final_assessment") {
      setView(resultView.review.attempt.passed ? { kind: "certificate" } : { kind: "landing" });
      return;
    }

    const updatedResumeTarget = getResumeTarget(course, progress);
    openTarget(updatedResumeTarget);
  }

  function renderLanding() {
    return (
      <div className="space-y-8">
        <section className="overflow-hidden rounded-[2rem] border border-border bg-[linear-gradient(135deg,rgba(15,23,42,0.98),rgba(6,95,70,0.92))] text-white shadow-2xl">
          <div className="grid gap-8 px-6 py-8 lg:grid-cols-[1.35fr_0.85fr] lg:px-8 lg:py-10">
            <div className="space-y-6">
              <Badge className="rounded-full bg-white/12 px-4 py-1 text-white hover:bg-white/12">
                Sales Rep Onboarding
              </Badge>
              <div className="space-y-4">
                <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
                  Course-driven onboarding built from the live COS training deck.
                </h1>
                <p className="max-w-3xl text-base leading-8 text-white/78">
                  This experience turns the 36-slide sales rep onboarding deck into a structured course with editable content data, inline knowledge checks, module quizzes, a final certification assessment, and saved progress on this device.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-3xl border border-white/12 bg-white/7 px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/60">
                    Modules
                  </p>
                  <p className="mt-2 text-3xl font-semibold">{course.modules.length}</p>
                </div>
                <div className="rounded-3xl border border-white/12 bg-white/7 px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/60">
                    Estimated Time
                  </p>
                  <p className="mt-2 text-3xl font-semibold">{course.estimatedMinutes} min</p>
                </div>
                <div className="rounded-3xl border border-white/12 bg-white/7 px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/60">
                    Source Slides
                  </p>
                  <p className="mt-2 text-3xl font-semibold">36</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  size="lg"
                  className="bg-white text-slate-950 hover:bg-white/90"
                  onClick={() => openTarget()}
                >
                  {progress.startedAt ? "Resume Course" : "Start Course"}
                  <ArrowRight className="size-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
                  onClick={() => setView({ kind: "landing" })}
                >
                  View Module Map
                </Button>
              </div>
            </div>
            <div className="rounded-[2rem] border border-white/12 bg-white/7 p-5 backdrop-blur">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-white/60">
                    Progress Snapshot
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold">Saved locally in your browser</h2>
                </div>
                <BrainCircuit className="size-6 text-white/80" />
              </div>
              <div className="mt-6 space-y-4">
                <Progress value={stats.completionPercent} className="text-white" />
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-3xl bg-white/8 px-4 py-4">
                    <p className="text-sm text-white/70">Completed modules</p>
                    <p className="mt-1 text-2xl font-semibold">
                      {stats.completedModules}/{stats.totalModules}
                    </p>
                  </div>
                  <div className="rounded-3xl bg-white/8 px-4 py-4">
                    <p className="text-sm text-white/70">Lesson progress</p>
                    <p className="mt-1 text-2xl font-semibold">
                      {stats.completedLessons}/{stats.totalLessons}
                    </p>
                  </div>
                  <div className="rounded-3xl bg-white/8 px-4 py-4">
                    <p className="text-sm text-white/70">Module quiz passes</p>
                    <p className="mt-1 text-2xl font-semibold">
                      {stats.moduleQuizPasses}/{course.modules.length}
                    </p>
                  </div>
                  <div className="rounded-3xl bg-white/8 px-4 py-4">
                    <p className="text-sm text-white/70">Final certification</p>
                    <p className="mt-1 text-2xl font-semibold">
                      {stats.finalAssessmentPassed ? "Passed" : finalUnlocked ? "Ready" : "Locked"}
                    </p>
                  </div>
                </div>
                <div className="rounded-3xl border border-white/12 bg-white/6 px-4 py-4 text-sm text-white/75">
                  {progress.startedAt
                    ? `Progress last updated ${new Date(progress.updatedAt ?? progress.startedAt).toLocaleString()}.`
                    : "Start the course to create a saved progress record on this device."}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Module Map
                </p>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight">
                  Course structure and progress
                </h2>
              </div>
              <SourceSlideBadges sourceSlides={course.modules.flatMap((module) => module.sourceSlides)} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {course.modules.map((module) => {
                const moduleStatus = getModuleStatus(module, progress);
                const Icon = getModuleIcon(module.icon);
                const bestQuizAttempt = module.quiz
                  ? getBestAssessmentAttempt(progress, module.quiz.id)
                  : undefined;

                return (
                  <Card key={module.id} className="rounded-[2rem] border-border/90">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-3">
                          <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-muted text-foreground">
                            <Icon className="size-5" />
                          </div>
                          <div>
                            <CardTitle className="text-xl">{module.title}</CardTitle>
                            <CardDescription className="mt-2 leading-7">
                              {module.description}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge variant={moduleStatus.completed ? "default" : "outline"} className="rounded-full">
                          {moduleStatus.completed ? "Complete" : `${moduleStatus.progressPercent}%`}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-5">
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="rounded-full">
                          {module.lessons.length} lessons
                        </Badge>
                        <Badge variant="outline" className="rounded-full">
                          {module.estimatedMinutes} min
                        </Badge>
                        <SourceSlideBadges sourceSlides={module.sourceSlides} />
                      </div>
                      <Progress value={moduleStatus.progressPercent} />
                      <div className="rounded-3xl border border-border bg-muted/35 px-4 py-4">
                        <p className="text-sm font-medium text-foreground">
                          {moduleStatus.completedLessons}/{moduleStatus.totalLessons} lessons complete
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {module.quiz
                            ? moduleStatus.quizPassed
                              ? `Best quiz score: ${bestQuizAttempt?.scorePercent ?? 0}%`
                              : moduleStatus.quizAttempted
                                ? `Latest best quiz score: ${bestQuizAttempt?.scorePercent ?? 0}%`
                                : "Module quiz not attempted yet"
                            : "No module quiz for this module"}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <Button
                          onClick={() =>
                            setView({
                              kind: "lesson",
                              moduleId: module.id,
                              lessonId: module.lessons[0]!.id,
                            })
                          }
                        >
                          Open Module
                          <ArrowRight className="size-4" />
                        </Button>
                        <Button
                          variant="outline"
                          disabled={!module.lessons.every((lesson) => isLessonComplete(progress, lesson.id))}
                          onClick={() =>
                            setView({
                              kind: "module_quiz",
                              moduleId: module.id,
                            })
                          }
                        >
                          {moduleStatus.quizPassed ? "Review Quiz" : "Take Quiz"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <Card className="rounded-[2rem] border-border/90">
              <CardHeader>
                <CardTitle className="text-xl">Certification Status</CardTitle>
                <CardDescription className="leading-7">
                  The final assessment unlocks after every module is completed and passed.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-3xl border border-border bg-muted/35 px-4 py-4">
                  <p className="text-sm font-medium text-foreground">
                    {stats.finalAssessmentPassed
                      ? `Passed with ${bestFinalAttempt?.scorePercent ?? 0}%`
                      : finalUnlocked
                        ? "Ready to take"
                        : "Locked until all modules are complete"}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Passing threshold: {finalAssessment?.passingScore ?? 85}%
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button
                    disabled={!finalUnlocked}
                    onClick={() => setView({ kind: "final_assessment" })}
                  >
                    {stats.finalAssessmentPassed ? "Retake Final" : "Open Final"}
                  </Button>
                  <Button
                    variant="outline"
                    disabled={!stats.finalAssessmentPassed}
                    onClick={() => setView({ kind: "certificate" })}
                  >
                    View Completion
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[2rem] border-border/90">
              <CardHeader>
                <CardTitle className="text-xl">Implementation Notes</CardTitle>
                <CardDescription className="leading-7">
                  This course stays traceable to the deck and keeps persistence swappable.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
                <p>Every lesson and question carries source slide metadata.</p>
                <p>Progress is persisted in localStorage through a dedicated store abstraction.</p>
                <p>Quiz scoring is separated into reusable helpers for test coverage.</p>
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" onClick={handleResetProgress}>
                    <RotateCcw className="size-4" />
                    Reset Progress
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    );
  }

  function renderSidebar() {
    return (
      <aside className="space-y-4">
        <Card className="rounded-[2rem] border-border/90 lg:sticky lg:top-6">
          <CardHeader className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Course Navigator
                </p>
                <CardTitle className="mt-2 text-xl">Sales Rep Onboarding</CardTitle>
              </div>
              <BookOpen className="size-5 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <Progress value={stats.completionPercent} />
              <p className="text-sm text-muted-foreground">
                {stats.completionPercent}% overall completion
              </p>
            </div>
            <Button variant="outline" onClick={() => setView({ kind: "landing" })}>
              <ArrowLeft className="size-4" />
              Back to Overview
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {course.modules.map((module, index) => {
              const status = getModuleStatus(module, progress);
              const Icon = getModuleIcon(module.icon);
              const quizUnlocked = module.lessons.every((lesson) =>
                isLessonComplete(progress, lesson.id),
              );
              const bestQuizAttempt = module.quiz
                ? getBestAssessmentAttempt(progress, module.quiz.id)
                : undefined;
              const moduleIsActive =
                ("moduleId" in view && view.moduleId === module.id) ||
                (view.kind === "lesson" && view.moduleId === module.id);

              return (
                <div
                  key={module.id}
                  className={cn(
                    "rounded-[1.6rem] border px-4 py-4 transition-colors",
                    moduleIsActive
                      ? "border-foreground/20 bg-foreground/[0.03]"
                      : "border-border bg-background",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <button
                      type="button"
                      className="flex flex-1 items-start gap-3 text-left"
                      onClick={() =>
                        setView({
                          kind: "lesson",
                          moduleId: module.id,
                          lessonId: module.lessons[0]!.id,
                        })
                      }
                    >
                      <span className="inline-flex size-10 items-center justify-center rounded-2xl bg-muted">
                        <Icon className="size-4" />
                      </span>
                      <span>
                        <span className="block text-sm font-medium text-foreground">
                          Module {index + 1}
                        </span>
                        <span className="mt-1 block text-sm text-muted-foreground">
                          {module.title}
                        </span>
                      </span>
                    </button>
                    <Badge
                      variant={status.completed ? "default" : "outline"}
                      className="rounded-full"
                    >
                      {status.progressPercent}%
                    </Badge>
                  </div>
                  <div className="mt-4 space-y-2">
                    {module.lessons.map((lesson) => {
                      const completed = isLessonComplete(progress, lesson.id);
                      const active =
                        view.kind === "lesson" &&
                        view.moduleId === module.id &&
                        view.lessonId === lesson.id;

                      return (
                        <button
                          key={lesson.id}
                          type="button"
                          className={cn(
                            "flex w-full items-center justify-between gap-3 rounded-2xl px-3 py-2 text-left text-sm transition-colors",
                            active
                              ? "bg-foreground text-background"
                              : "bg-muted/45 text-foreground hover:bg-muted",
                          )}
                          onClick={() =>
                            setView({
                              kind: "lesson",
                              moduleId: module.id,
                              lessonId: lesson.id,
                            })
                          }
                        >
                          <span className="flex items-center gap-3">
                            {completed ? (
                              <CheckCircle2 className="size-4" />
                            ) : (
                              <span className="size-2 rounded-full bg-current/65" />
                            )}
                            <span>{lesson.title}</span>
                          </span>
                          <ChevronRight className="size-4 opacity-70" />
                        </button>
                      );
                    })}
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                      disabled={!quizUnlocked}
                      onClick={() =>
                        setView({
                          kind: "module_quiz",
                          moduleId: module.id,
                        })
                      }
                    >
                      <span className="flex items-center gap-2">
                        <ClipboardCheck className="size-4" />
                        {status.quizPassed ? "Quiz Passed" : "Module Quiz"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {bestQuizAttempt ? `${bestQuizAttempt.scorePercent}%` : quizUnlocked ? "Ready" : "Locked"}
                      </span>
                    </Button>
                  </div>
                </div>
              );
            })}
            <Button
              variant="outline"
              className="w-full justify-between"
              disabled={!finalUnlocked}
              onClick={() =>
                setView(
                  stats.finalAssessmentPassed
                    ? { kind: "certificate" }
                    : { kind: "final_assessment" },
                )
              }
            >
              <span className="flex items-center gap-2">
                {finalUnlocked ? <Award className="size-4" /> : <Lock className="size-4" />}
                Final Certification
              </span>
              <span className="text-xs text-muted-foreground">
                {stats.finalAssessmentPassed ? "Passed" : finalUnlocked ? "Ready" : "Locked"}
              </span>
            </Button>
          </CardContent>
        </Card>
      </aside>
    );
  }

  function renderLessonView(module: Module, lessonId: string) {
    const lesson = module.lessons.find((item) => item.id === lessonId);

    if (!lesson) {
      return renderLanding();
    }

    const completed = isLessonComplete(progress, lesson.id);
    const sequenceIndex = lessonSequence.findIndex(
      (item) => item.lessonId === lesson.id,
    );
    const previousSequence = sequenceIndex > 0 ? lessonSequence[sequenceIndex - 1] : null;
    const nextInModule = module.lessons[module.lessons.findIndex((item) => item.id === lesson.id) + 1];

    return (
      <div className="space-y-6">
        <Card className="rounded-[2rem] border-border/90">
          <CardHeader className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="rounded-full">
                {module.title}
              </Badge>
              <SourceSlideBadges sourceSlides={lesson.sourceSlides} />
              <Badge variant={completed ? "default" : "outline"} className="rounded-full">
                {completed ? "Completed" : "In progress"}
              </Badge>
            </div>
            <div className="space-y-3">
              <CardTitle className="text-3xl tracking-tight">{lesson.title}</CardTitle>
              {lesson.description ? (
                <CardDescription className="max-w-3xl text-base leading-8">
                  {lesson.description}
                </CardDescription>
              ) : null}
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-3xl border border-border bg-muted/30 px-5 py-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Objectives
              </p>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-muted-foreground">
                {lesson.objectives.map((objective) => (
                  <li key={objective} className="flex gap-3">
                    <span className="mt-2 size-2 rounded-full bg-foreground/65" />
                    <span>{objective}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border border-border bg-muted/30 px-5 py-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Key Takeaways
              </p>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-muted-foreground">
                {lesson.keyTakeaways.map((takeaway) => (
                  <li key={takeaway} className="flex gap-3">
                    <span className="mt-2 size-2 rounded-full bg-foreground/65" />
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-border/90">
          <CardContent className="px-6 py-6">
            <ContentBlockRenderer blocks={lesson.content} />
          </CardContent>
        </Card>

        {lesson.knowledgeChecks && lesson.knowledgeChecks.length > 0 ? (
          <KnowledgeCheckPanel key={lesson.id} questions={lesson.knowledgeChecks} />
        ) : null}

        <Card className="rounded-[2rem] border-border/90">
          <CardContent className="flex flex-wrap items-center justify-between gap-3 px-5 py-5">
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                {completed ? "Lesson marked complete" : "Mark this lesson complete when you are ready to move on."}
              </p>
              <p className="text-sm text-muted-foreground">
                Next step: {nextInModule ? nextInModule.title : "Module quiz"}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                disabled={!previousSequence}
                onClick={() =>
                  previousSequence &&
                  setView({
                    kind: "lesson",
                    moduleId: previousSequence.moduleId,
                    lessonId: previousSequence.lessonId,
                  })
                }
              >
                <ArrowLeft className="size-4" />
                Previous
              </Button>
              <Button
                variant={completed ? "outline" : "default"}
                onClick={() => markComplete(lesson.id)}
              >
                {completed ? "Completed" : "Mark Complete"}
              </Button>
              <Button onClick={() => continueFromLesson(module, lesson.id)}>
                {nextInModule ? "Next Lesson" : "Take Module Quiz"}
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  function renderModuleQuizView(module: Module) {
    const quizUnlocked = module.lessons.every((lesson) =>
      isLessonComplete(progress, lesson.id),
    );
    const status = getModuleStatus(module, progress);

    if (!module.quiz) {
      return renderLanding();
    }

    if (!quizUnlocked) {
      return (
        <Card className="rounded-[2rem] border-border/90">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Lock className="size-5 text-muted-foreground" />
              <CardTitle className="text-2xl">Module quiz locked</CardTitle>
            </div>
            <CardDescription className="max-w-2xl leading-7">
              Complete every lesson in {module.title} before taking the quiz.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Lesson completion: {status.completedLessons}/{status.totalLessons}
            </p>
            <Button
              onClick={() =>
                setView({
                  kind: "lesson",
                  moduleId: module.id,
                  lessonId: module.lessons.find(
                    (lesson) => !isLessonComplete(progress, lesson.id),
                  )?.id ?? module.lessons[0]!.id,
                })
              }
            >
              Resume Module Lessons
            </Button>
          </CardContent>
        </Card>
      );
    }

    return (
      <AssessmentRunner
        key={`${module.quiz.id}-${attemptSeed}`}
        courseId={course.id}
        assessment={module.quiz}
        assessmentType="module_quiz"
        moduleId={module.id}
        onSubmitted={(review) => handleModuleQuizSubmitted(module.id, review)}
      />
    );
  }

  function renderFinalAssessmentView() {
    if (!finalAssessment) {
      return renderLanding();
    }

    if (!finalUnlocked) {
      return (
        <Card className="rounded-[2rem] border-border/90">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Lock className="size-5 text-muted-foreground" />
              <CardTitle className="text-2xl">Final assessment locked</CardTitle>
            </div>
            <CardDescription className="max-w-2xl leading-7">
              Complete all lessons and pass every module quiz to unlock certification.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Current status: {stats.completedModules}/{stats.totalModules} modules fully complete.
            </p>
            <Button onClick={() => openTarget()}>Resume Course</Button>
          </CardContent>
        </Card>
      );
    }

    return (
      <AssessmentRunner
        key={`${finalAssessment.id}-${attemptSeed}`}
        courseId={course.id}
        assessment={finalAssessment}
        assessmentType="final_assessment"
        onSubmitted={handleFinalAssessmentSubmitted}
      />
    );
  }

  function renderAssessmentResultView(
    resultView: Extract<CourseView, { kind: "assessment_result" }>,
  ) {
    const assessment = getAssessment(resultView);

    if (!assessment) {
      return renderLanding();
    }

    return (
      <div className="space-y-6">
        <Card className="rounded-[2rem] border-border/90">
          <CardHeader className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="rounded-full">
                {resultView.assessmentType === "final_assessment" ? "Final Assessment" : "Module Quiz"}
              </Badge>
              <Badge
                variant={resultView.review.attempt.passed ? "default" : "destructive"}
                className="rounded-full"
              >
                {resultView.review.attempt.passed ? "Passed" : "Not Yet Passed"}
              </Badge>
            </div>
            <div className="flex items-start justify-between gap-6">
              <div>
                <CardTitle className="text-3xl tracking-tight">
                  {resultView.assessmentTitle}
                </CardTitle>
                <CardDescription className="mt-3 max-w-3xl text-base leading-8">
                  Score {resultView.review.attempt.scorePercent}% ({resultView.review.attempt.earnedPoints}/
                  {resultView.review.attempt.totalPoints}) with a required passing score of {assessment.passingScore}%.
                </CardDescription>
              </div>
              {resultView.review.attempt.passed ? (
                <Trophy className="size-8 text-emerald-600" />
              ) : (
                <AlertCircle className="size-8 text-amber-600" />
              )}
            </div>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button onClick={() => continueAfterAssessment(resultView)}>
              {resultView.assessmentType === "final_assessment"
                ? resultView.review.attempt.passed
                  ? "View Completion"
                  : "Back to Course"
                : "Continue"}
              <ArrowRight className="size-4" />
            </Button>
            <Button variant="outline" onClick={() => retakeAssessment(resultView)}>
              <RotateCcw className="size-4" />
              Retake
            </Button>
            {!resultView.review.attempt.passed ? (
              <Button variant="outline" onClick={() => goToRecommendedLesson(resultView)}>
                Review Recommended Lesson
              </Button>
            ) : null}
          </CardContent>
        </Card>

        <div className="space-y-4">
          {resultView.review.results.map(({ question, result }, index) => (
            <Card key={question.id} className="rounded-[2rem] border-border/90">
              <CardHeader className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant={result.correct ? "default" : "outline"}
                    className="rounded-full"
                  >
                    {result.correct ? "Correct" : "Review"}
                  </Badge>
                  <SourceSlideBadges sourceSlides={question.sourceSlides} />
                </div>
                <CardTitle className="text-xl">
                  {index + 1}. {question.prompt}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
                {!result.correct ? (
                  <p>
                    Expected answer:{" "}
                    <span className="font-medium text-foreground">
                      {formatExpectedAnswer(question)}
                    </span>
                  </p>
                ) : null}
                <p>{question.explanation}</p>
                {question.remediationLessonId ? (
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Remediation lesson: {question.remediationLessonId}
                  </p>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  function renderCertificateView() {
    return (
      <div className="space-y-6">
        <Card className="overflow-hidden rounded-[2rem] border-border/90 bg-[linear-gradient(135deg,rgba(15,23,42,0.98),rgba(6,95,70,0.92))] text-white shadow-2xl">
          <CardContent className="px-6 py-8 sm:px-8 sm:py-10">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div className="space-y-4">
                <Badge className="rounded-full bg-white/12 px-4 py-1 text-white hover:bg-white/12">
                  Completion
                </Badge>
                <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                  {stats.finalAssessmentPassed
                    ? "Certification complete"
                    : "Course progress saved"}
                </h1>
                <p className="max-w-3xl text-base leading-8 text-white/78">
                  {stats.finalAssessmentPassed
                    ? `Best final assessment score: ${bestFinalAttempt?.scorePercent ?? 0}% on ${bestFinalAttempt ? new Date(bestFinalAttempt.completedAt).toLocaleString() : "this device"}.`
                    : "Finish the final assessment to unlock certification. Your course progress is already saved and ready to resume."}
                </p>
              </div>
              <Award className="size-10 text-white/80" />
            </div>
          </CardContent>
        </Card>

        <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="rounded-[2rem] border-border/90">
            <CardHeader>
              <CardTitle className="text-2xl">Completion Summary</CardTitle>
              <CardDescription className="leading-7">
                Every module, lesson, and assessment in this experience ties back to the source deck.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-3xl border border-border bg-muted/35 px-4 py-4">
                  <p className="text-sm text-muted-foreground">Completed modules</p>
                  <p className="mt-1 text-2xl font-semibold">
                    {stats.completedModules}/{stats.totalModules}
                  </p>
                </div>
                <div className="rounded-3xl border border-border bg-muted/35 px-4 py-4">
                  <p className="text-sm text-muted-foreground">Final status</p>
                  <p className="mt-1 text-2xl font-semibold">
                    {stats.finalAssessmentPassed ? "Passed" : "Pending"}
                  </p>
                </div>
                <div className="rounded-3xl border border-border bg-muted/35 px-4 py-4">
                  <p className="text-sm text-muted-foreground">Completion</p>
                  <p className="mt-1 text-2xl font-semibold">{stats.completionPercent}%</p>
                </div>
              </div>
              <Progress value={stats.completionPercent} />
              <div className="space-y-3">
                {course.modules.map((module) => {
                  const status = getModuleStatus(module, progress);
                  const bestAttempt = module.quiz
                    ? getBestAssessmentAttempt(progress, module.quiz.id)
                    : undefined;

                  return (
                    <div
                      key={module.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-border bg-background px-4 py-4"
                    >
                      <div>
                        <p className="font-medium text-foreground">{module.title}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {status.completedLessons}/{status.totalLessons} lessons complete
                          {bestAttempt ? ` • quiz ${bestAttempt.scorePercent}%` : ""}
                        </p>
                      </div>
                      <Badge
                        variant={status.completed ? "default" : "outline"}
                        className="rounded-full"
                      >
                        {status.completed ? "Complete" : "In progress"}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-border/90">
            <CardHeader>
              <CardTitle className="text-2xl">Next Action</CardTitle>
              <CardDescription className="leading-7">
                Retake assessments, review lessons, or return to the landing page.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={() => setView({ kind: "landing" })}>
                Back to Course Overview
              </Button>
              <Button
                variant="outline"
                disabled={!finalUnlocked}
                onClick={() =>
                  setView(
                    stats.finalAssessmentPassed
                      ? { kind: "final_assessment" }
                      : { kind: "final_assessment" },
                  )
                }
              >
                <RotateCcw className="size-4" />
                Retake Final Assessment
              </Button>
              <Button variant="outline" onClick={handleResetProgress}>
                Reset Saved Progress
              </Button>
              <div className="rounded-3xl border border-border bg-muted/35 px-4 py-4 text-sm leading-7 text-muted-foreground">
                Persistence method: localStorage. The storage wrapper is isolated so the app can be moved to server-backed persistence later without rewriting the learning UI.
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    );
  }

  function renderMainContent() {
    if (view.kind === "landing") {
      return renderLanding();
    }

    if (view.kind === "lesson") {
      const courseModule = findModule(course, view.moduleId);
      return courseModule ? renderLessonView(courseModule, view.lessonId) : renderLanding();
    }

    if (view.kind === "module_quiz") {
      const courseModule = findModule(course, view.moduleId);
      return courseModule ? renderModuleQuizView(courseModule) : renderLanding();
    }

    if (view.kind === "final_assessment") {
      return renderFinalAssessmentView();
    }

    if (view.kind === "assessment_result") {
      return renderAssessmentResultView(view);
    }

    return renderCertificateView();
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(15,23,42,0.08),transparent_35%),linear-gradient(180deg,#f8fafc,#ecfdf5)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {view.kind === "landing" ? (
          renderMainContent()
        ) : (
          <div className="grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
            {renderSidebar()}
            <main>{renderMainContent()}</main>
          </div>
        )}
      </div>
    </div>
  );
}
