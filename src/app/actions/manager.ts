"use server";

import { revalidatePath } from "next/cache";

import { requireSessionUser } from "@/lib/auth/session";
import {
  resetProgressForUser,
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
  const assigned = String(formData.get("assigned") ?? "") === "true";
  await setAssignmentForUser(managerId, userId, assigned);
  revalidateManagerSurfaces();
}

export async function updateCourseLockAction(formData: FormData) {
  const managerId = await getManagerId();
  const userId = String(formData.get("userId") ?? "");
  const locked = String(formData.get("locked") ?? "") === "true";
  await setCourseLockedForUser(managerId, userId, locked);
  revalidateManagerSurfaces();
}

export async function updateFinalOverrideAction(formData: FormData) {
  const managerId = await getManagerId();
  const userId = String(formData.get("userId") ?? "");
  const unlocked = String(formData.get("unlocked") ?? "") === "true";
  await setFinalAssessmentOverrideForUser(managerId, userId, unlocked);
  revalidateManagerSurfaces();
}

export async function updateCompletionAction(formData: FormData) {
  const managerId = await getManagerId();
  const userId = String(formData.get("userId") ?? "");
  const completed = String(formData.get("completed") ?? "") === "true";
  await setManagerCompletionForUser(managerId, userId, completed);
  revalidateManagerSurfaces();
}

export async function resetProgressAction(formData: FormData) {
  const managerId = await getManagerId();
  const userId = String(formData.get("userId") ?? "");
  await resetProgressForUser(managerId, userId);
  revalidateManagerSurfaces();
}

export async function updateModuleLockAction(formData: FormData) {
  const managerId = await getManagerId();
  const userId = String(formData.get("userId") ?? "");
  const moduleId = String(formData.get("moduleId") ?? "");
  const locked = String(formData.get("locked") ?? "") === "true";
  await setModuleLockedForUser(managerId, userId, moduleId, locked);
  revalidateManagerSurfaces();
}
