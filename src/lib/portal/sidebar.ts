export const SIDEBAR_STORAGE_KEY = "cos:sidebar-collapsed";
export const SIDEBAR_COOKIE_NAME = "cos-sidebar-collapsed";
export const SIDEBAR_CHANGE_EVENT = "cos:sidebar-collapsed-change";

export function parseSidebarCollapsed(value: string | null | undefined) {
  return value === "true";
}
