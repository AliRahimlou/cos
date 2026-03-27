import type { UserRole } from "@/lib/auth/types";
import type { CourseProgress } from "@/lib/onboarding/types";

export type PortalUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  title: string;
  department: string;
  active: boolean;
};

export type PublicUser = Omit<PortalUser, "password">;

export type PortalActivityType =
  | "lesson_completed"
  | "assessment_submitted"
  | "assignment_updated"
  | "course_locked"
  | "module_lock_updated"
  | "final_override_updated"
  | "manager_completion_updated"
  | "progress_reset";

export type PortalActivity = {
  id: string;
  type: PortalActivityType;
  actorUserId: string;
  courseId: string;
  createdAt: string;
  message: string;
  moduleId?: string;
  lessonId?: string;
  assessmentId?: string;
  scorePercent?: number;
};

export type CourseEnrollment = {
  userId: string;
  courseId: string;
  assigned: boolean;
  assignedAt: string | null;
  locked: boolean;
  lockedModuleIds: string[];
  finalAssessmentUnlocked: boolean;
  managerMarkedComplete: boolean | null;
  managerMarkedAt: string | null;
  completedAt: string | null;
  progress: CourseProgress;
  activity: PortalActivity[];
};

export type PortalState = {
  version: 1;
  users: PortalUser[];
  enrollments: CourseEnrollment[];
};
