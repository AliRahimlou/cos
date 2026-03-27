import { notFound } from "next/navigation";

import { LessonScreen } from "@/components/portal/lesson-screen";
import { requireSessionUser } from "@/lib/auth/session";
import { findLesson, findModule } from "@/lib/onboarding/progress";
import { getLearnerContext } from "@/lib/portal/loaders";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ moduleId: string; lessonId: string }>;
}) {
  const { moduleId, lessonId } = await params;
  const sessionUser = await requireSessionUser("learner");
  const context = await getLearnerContext(sessionUser.id);

  if (!context) {
    return null;
  }

  const { course, enrollment } = context;
  const courseModule = findModule(course, moduleId);
  const lessonMatch = findLesson(course, lessonId);

  if (!courseModule || !lessonMatch || lessonMatch.module.id !== moduleId) {
    notFound();
  }

  const lessonIndex = courseModule.lessons.findIndex((lesson) => lesson.id === lessonId);
  const previousLesson = courseModule.lessons[lessonIndex - 1];
  const nextLesson = courseModule.lessons[lessonIndex + 1];
  const previousHref = previousLesson
    ? `/training/${moduleId}/lessons/${previousLesson.id}`
    : `/training/${moduleId}`;
  const nextHref = nextLesson ? `/training/${moduleId}/lessons/${nextLesson.id}` : `/quizzes/${moduleId}`;
  const nextLabel = nextLesson ? `Continue to ${nextLesson.title}` : "Go to Module Quiz";
  const isComplete = enrollment?.progress.completedLessonIds.includes(lessonId) ?? false;

  return (
    <LessonScreen
      module={courseModule}
      lesson={lessonMatch.lesson}
      isComplete={isComplete}
      previousHref={previousHref}
      nextHref={nextHref}
      nextLabel={nextLabel}
    />
  );
}
