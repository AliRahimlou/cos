import "server-only";

import { salesRepOnboardingCourse } from "@/content/onboarding/sales-rep/course";

import { buildLearnerSummary, buildManagerOverview } from "./metrics";
import { getEnrollment, getUserById, listLearners, toPublicUser } from "./store";

const course = salesRepOnboardingCourse;

export async function getLearnerContext(userId: string) {
  const user = await getUserById(userId);

  if (!user) {
    return null;
  }

  const publicUser = toPublicUser(user);
  const enrollment = await getEnrollment(userId, course.id);

  return {
    course,
    user: publicUser,
    enrollment,
    summary: buildLearnerSummary(publicUser, enrollment),
  };
}

export async function getManagerContext() {
  const learners = await listLearners();
  const enrollments = await Promise.all(
    learners.map((learner) => getEnrollment(learner.id, course.id)),
  );
  const records = learners.map((learner, index) =>
    buildLearnerSummary(learner, enrollments[index] ?? null),
  );

  return {
    course,
    learners,
    records,
    overview: buildManagerOverview(records),
  };
}
