"use server";

import { revalidatePath } from "next/cache";

import { requireSessionUser } from "@/lib/auth/session";
import {
  addModuleToCourse,
  createDepartmentProgram,
  resetProgressForUser,
  setActiveCourseForUser,
  setAssignmentForUser,
  setCourseLockedForUser,
  setFinalAssessmentOverrideForUser,
  setManagerCompletionForUser,
  setModuleLockedForUser,
} from "@/lib/portal/store";

async function getManagerId() {
  const manager = await requireSessionUser("manager");
  return manager.id;
}

function revalidateManagerSurfaces() {
  revalidatePath("/manager");
  revalidatePath("/manager/team");
  revalidatePath("/manager/analytics");
  revalidatePath("/manager/users");
  revalidatePath("/manager/content");
  revalidatePath("/dashboard");
  revalidatePath("/training");
  revalidatePath("/quizzes");
  revalidatePath("/assessment/final");
  revalidatePath("/results");
}

export async function updateAssignmentAction(formData: FormData) {
  const managerId = await getManagerId();
  const userId = String(formData.get("userId") ?? "");
  const courseId = String(formData.get("courseId") ?? "");
  const assigned = String(formData.get("assigned") ?? "") === "true";
  await setAssignmentForUser(managerId, userId, courseId, assigned);
  revalidateManagerSurfaces();
}

export async function updateCourseLockAction(formData: FormData) {
  const managerId = await getManagerId();
  const userId = String(formData.get("userId") ?? "");
  const courseId = String(formData.get("courseId") ?? "");
  const locked = String(formData.get("locked") ?? "") === "true";
  await setCourseLockedForUser(managerId, userId, courseId, locked);
  revalidateManagerSurfaces();
}

export async function updateFinalOverrideAction(formData: FormData) {
  const managerId = await getManagerId();
  const userId = String(formData.get("userId") ?? "");
  const courseId = String(formData.get("courseId") ?? "");
  const unlocked = String(formData.get("unlocked") ?? "") === "true";
  await setFinalAssessmentOverrideForUser(managerId, userId, courseId, unlocked);
  revalidateManagerSurfaces();
}

export async function updateCompletionAction(formData: FormData) {
  const managerId = await getManagerId();
  const userId = String(formData.get("userId") ?? "");
  const courseId = String(formData.get("courseId") ?? "");
  const completed = String(formData.get("completed") ?? "") === "true";
  await setManagerCompletionForUser(managerId, userId, courseId, completed);
  revalidateManagerSurfaces();
}

export async function resetProgressAction(formData: FormData) {
  const managerId = await getManagerId();
  const userId = String(formData.get("userId") ?? "");
  const courseId = String(formData.get("courseId") ?? "");
  await resetProgressForUser(managerId, userId, courseId);
  revalidateManagerSurfaces();
}

export async function updateModuleLockAction(formData: FormData) {
  const managerId = await getManagerId();
  const userId = String(formData.get("userId") ?? "");
  const courseId = String(formData.get("courseId") ?? "");
  const moduleId = String(formData.get("moduleId") ?? "");
  const locked = String(formData.get("locked") ?? "") === "true";
  await setModuleLockedForUser(managerId, userId, courseId, moduleId, locked);
  revalidateManagerSurfaces();
}

export async function updateActiveCourseAction(formData: FormData) {
  const managerId = await getManagerId();
  const userId = String(formData.get("userId") ?? "");
  const courseId = String(formData.get("courseId") ?? "");
  await setActiveCourseForUser(managerId, userId, courseId);
  revalidateManagerSurfaces();
}

export async function createDepartmentProgramAction(formData: FormData) {
  const managerId = await getManagerId();
  await createDepartmentProgram(managerId, {
    department: String(formData.get("department") ?? ""),
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    audience: String(formData.get("audience") ?? ""),
    starterModuleTitle: String(formData.get("starterModuleTitle") ?? ""),
    starterLessonTitle: String(formData.get("starterLessonTitle") ?? ""),
    starterLessonDescription: String(formData.get("starterLessonDescription") ?? ""),
    objectivesText: String(formData.get("objectivesText") ?? ""),
    keyTakeawaysText: String(formData.get("keyTakeawaysText") ?? ""),
  });
  revalidateManagerSurfaces();
}

export async function addModuleToCourseAction(formData: FormData) {
  const managerId = await getManagerId();
  await addModuleToCourse(managerId, {
    courseId: String(formData.get("courseId") ?? ""),
    department: String(formData.get("department") ?? ""),
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    estimatedMinutes: Number(formData.get("estimatedMinutes") ?? 15),
    lessonTitle: String(formData.get("lessonTitle") ?? ""),
    lessonDescription: String(formData.get("lessonDescription") ?? ""),
    objectivesText: String(formData.get("objectivesText") ?? ""),
    keyTakeawaysText: String(formData.get("keyTakeawaysText") ?? ""),
  });
  revalidateManagerSurfaces();
}
