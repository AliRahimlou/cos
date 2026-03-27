"use client";

import { useEffect, useSyncExternalStore } from "react";
import { MoonStar, SunMedium } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  THEME_CHANGE_EVENT,
  THEME_COOKIE_NAME,
  THEME_STORAGE_KEY,
  parsePortalTheme,
  type PortalTheme,
} from "@/lib/portal/theme";

function readThemePreference(fallbackTheme: PortalTheme): PortalTheme {
  if (typeof window === "undefined") {
    return fallbackTheme;
  }

  return parsePortalTheme(window.localStorage.getItem(THEME_STORAGE_KEY) ?? fallbackTheme);
}

function subscribeThemePreference(callback: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleChange = () => callback();
  window.addEventListener("storage", handleChange);
  window.addEventListener(THEME_CHANGE_EVENT, handleChange);

  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(THEME_CHANGE_EVENT, handleChange);
  };
}

function applyTheme(theme: PortalTheme) {
  if (typeof document === "undefined") {
    return;
  }

  const prefersDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  document.documentElement.classList.toggle("dark", prefersDark);
}

function isDarkTheme(theme: PortalTheme) {
  if (theme === "dark") {
    return true;
  }

  if (theme === "light") {
    return false;
  }

  if (typeof document === "undefined") {
    return false;
  }

  return document.documentElement.classList.contains("dark");
}

type ThemeToggleProps = {
  initialTheme: PortalTheme;
};

export function ThemeToggle({ initialTheme }: ThemeToggleProps) {
  const theme = useSyncExternalStore<PortalTheme>(
    subscribeThemePreference,
    () => readThemePreference(initialTheme),
    () => initialTheme,
  );

  useEffect(() => {
    applyTheme(theme);
    document.cookie = `${THEME_COOKIE_NAME}=${theme}; path=/; max-age=31536000; samesite=lax`;
  }, [theme]);

  function toggleTheme() {
    const nextTheme: PortalTheme = theme === "dark" ? "light" : "dark";
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    document.cookie = `${THEME_COOKIE_NAME}=${nextTheme}; path=/; max-age=31536000; samesite=lax`;
    applyTheme(nextTheme);
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  }

  const isDark = isDarkTheme(theme);

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="rounded-2xl"
    >
      {isDark ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
    </Button>
  );
}
