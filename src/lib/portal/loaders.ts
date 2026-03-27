import "server-only";

import { buildLearnerSummary, buildManagerOverview } from "./metrics";
import {
  getCurrentCourseForUser,
  getEnrollment,
  getUserById,
  listCourses,
  listLearners,
  toPublicUser,
} from "./store";

export async function getLearnerContext(userId: string) {
  const user = await getUserById(userId);
  const current = await getCurrentCourseForUser(userId);

  if (!user || !current) {
    return null;
  }

  const publicUser = toPublicUser(user);
  const courses = await listCourses();

  return {
    course: current.course,
    courseRecord: current.record,
    availableCourses: courses,
    user: publicUser,
    enrollment: current.enrollment,
    summary: buildLearnerSummary({
      course: current.course,
      department: current.record.department,
      protectedCourse: current.record.protected,
      user: publicUser,
      enrollment: current.enrollment,
    }),
  };
}

export async function getManagerContext() {
  const learners = await listLearners();
  const courses = await listCourses();
  const records = await Promise.all(
    learners.map(async (learner) => {
      const activeCourseId = learner.activeCourseId ?? courses[0]?.courseId;
      const record = courses.find((course) => course.courseId === activeCourseId) ?? courses[0];

      if (!record) {
        return null;
      }

      const enrollment = await getEnrollment(learner.id, record.courseId);

      return buildLearnerSummary({
        course: record.course,
        department: record.department,
        protectedCourse: record.protected,
        user: learner,
        enrollment,
      });
    }),
  );

  const learnerRecords = records.filter((record) => record !== null);

  return {
    courses,
    learners,
    records: learnerRecords,
    overview: buildManagerOverview(learnerRecords),
  };
}
