export const THEME_STORAGE_KEY = "cos:theme";
export const THEME_COOKIE_NAME = "cos-theme";
export const THEME_CHANGE_EVENT = "cos:theme-change";
export const DEFAULT_THEME = "system";

export type PortalTheme = "light" | "dark" | "system";

export function parsePortalTheme(value: string | null | undefined): PortalTheme {
  return value === "dark" || value === "light" || value === "system"
    ? value
    : DEFAULT_THEME;
}
