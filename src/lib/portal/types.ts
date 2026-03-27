import type { UserRole } from "@/lib/auth/types";
import type { Course, CourseProgress, Module } from "@/lib/onboarding/types";

export type PortalUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  title: string;
  department: string;
  active: boolean;
  activeCourseId: string | null;
};

export type PublicUser = Omit<PortalUser, "password">;

export type PortalActivityType =
  | "lesson_completed"
  | "assessment_submitted"
  | "assignment_updated"
  | "active_course_updated"
  | "course_locked"
  | "module_lock_updated"
  | "final_override_updated"
  | "manager_completion_updated"
  | "progress_reset"
  | "course_created"
  | "module_created";

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

export type ManagedCourseRecord = {
  courseId: string;
  department: string;
  source: "pptx" | "manager";
  protected: boolean;
  createdAt: string;
  updatedAt: string;
  deckPath?: string | null;
  extractionArtifact?: string | null;
  notesPath?: string | null;
  course: Course;
};

export type CourseModuleExtension = {
  courseId: string;
  createdAt: string;
  updatedAt: string;
  createdByUserId: string;
  modules: Module[];
};

export type PortalState = {
  version: 2;
  users: PortalUser[];
  enrollments: CourseEnrollment[];
  customCourses: ManagedCourseRecord[];
  courseModuleExtensions: CourseModuleExtension[];
};
