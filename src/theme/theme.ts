import { useCallback, useEffect, useState } from "react";

export type AppTheme = "light" | "dark";

export const THEME_STORAGE_KEY = "streckentool-theme";

export function getStoredTheme(): AppTheme {
  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);

  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }

  return "light";
}

export function applyTheme(theme: AppTheme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

export function setStoredTheme(theme: AppTheme) {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  applyTheme(theme);

  window.dispatchEvent(
    new CustomEvent<AppTheme>("streckentool-theme-change", {
      detail: theme,
    })
  );
}

export function useAppTheme() {
  const [theme, setThemeState] = useState<AppTheme>(() => getStoredTheme());

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    function handleThemeChange(event: Event) {
      const customEvent = event as CustomEvent<AppTheme>;

      if (customEvent.detail === "light" || customEvent.detail === "dark") {
        setThemeState(customEvent.detail);
        applyTheme(customEvent.detail);
      }
    }

    function handleStorageChange(event: StorageEvent) {
      if (event.key === THEME_STORAGE_KEY) {
        const nextTheme = getStoredTheme();
        setThemeState(nextTheme);
        applyTheme(nextTheme);
      }
    }

    window.addEventListener("streckentool-theme-change", handleThemeChange);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("streckentool-theme-change", handleThemeChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const setTheme = useCallback((nextTheme: AppTheme) => {
    setStoredTheme(nextTheme);
    setThemeState(nextTheme);
  }, []);

  return {
    theme,
    setTheme,
    toggleTheme: () => setTheme(theme === "light" ? "dark" : "light"),
  };
}
