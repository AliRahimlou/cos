"use client";

import type { CourseProgress } from "./types";

const STORAGE_PREFIX = "cos:onboarding-progress";
const STORAGE_EVENT = "cos:onboarding-progress-change";
const EMPTY_PROGRESS_CACHE = new Map<string, CourseProgress>();
const SNAPSHOT_CACHE = new Map<string, { raw: string; value: CourseProgress }>();

function getStorageKey(courseId: string) {
  return `${STORAGE_PREFIX}:${courseId}`;
}

function getEmptyCourseProgress(courseId: string): CourseProgress {
  const cached = EMPTY_PROGRESS_CACHE.get(courseId);

  if (cached) {
    return cached;
  }

  const emptyProgress: CourseProgress = {
    courseId,
    startedAt: null,
    updatedAt: null,
    completedLessonIds: [],
    attempts: [],
  };

  EMPTY_PROGRESS_CACHE.set(courseId, emptyProgress);
  return emptyProgress;
}

function parseCourseProgress(courseId: string, raw: string) {
  const cached = SNAPSHOT_CACHE.get(courseId);

  if (cached?.raw === raw) {
    return cached.value;
  }

  try {
    const parsed = JSON.parse(raw) as CourseProgress;
    SNAPSHOT_CACHE.set(courseId, {
      raw,
      value: parsed,
    });
    return parsed;
  } catch {
    return null;
  }
}

export function loadCourseProgress(courseId: string) {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(getStorageKey(courseId));

  if (!raw) {
    return null;
  }

  return parseCourseProgress(courseId, raw);
}

export function getCourseProgressSnapshot(courseId: string) {
  if (typeof window === "undefined") {
    return getEmptyCourseProgress(courseId);
  }

  const raw = window.localStorage.getItem(getStorageKey(courseId));

  if (!raw) {
    return getEmptyCourseProgress(courseId);
  }

  return parseCourseProgress(courseId, raw) ?? getEmptyCourseProgress(courseId);
}

export function getServerCourseProgressSnapshot(courseId: string) {
  return getEmptyCourseProgress(courseId);
}

export function saveCourseProgress(progress: CourseProgress) {
  if (typeof window === "undefined") {
    return;
  }

  const raw = JSON.stringify(progress);
  window.localStorage.setItem(getStorageKey(progress.courseId), raw);
  SNAPSHOT_CACHE.set(progress.courseId, {
    raw,
    value: progress,
  });
  window.dispatchEvent(
    new CustomEvent(STORAGE_EVENT, {
      detail: { courseId: progress.courseId },
    }),
  );
}

export function clearCourseProgress(courseId: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(getStorageKey(courseId));
  SNAPSHOT_CACHE.delete(courseId);
  window.dispatchEvent(
    new CustomEvent(STORAGE_EVENT, {
      detail: { courseId },
    }),
  );
}

export function subscribeCourseProgress(
  courseId: string,
  callback: () => void,
) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === getStorageKey(courseId)) {
      callback();
    }
  };

  const handleCustom = (event: Event) => {
    const detail = (event as CustomEvent<{ courseId?: string }>).detail;

    if (!detail?.courseId || detail.courseId === courseId) {
      callback();
    }
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(STORAGE_EVENT, handleCustom as EventListener);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(STORAGE_EVENT, handleCustom as EventListener);
  };
}
