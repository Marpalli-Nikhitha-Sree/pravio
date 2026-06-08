import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const STORAGE_KEY = "pravio-settings";

const defaultSettings = {
  notifications: {
    taskReminders: true,
    projectUpdates: true,
    emailAlerts: false,
  },
  privacy: {
    showProfile: true,
    showActivity: true,
  },
  appearance: {
    textSize: "medium",
    reduceMotion: false,
  },
};

const TEXT_SIZES = ["small", "medium", "large"];

function normalizeAppearance(appearance = {}) {
  let textSize = appearance.textSize;

  if (!TEXT_SIZES.includes(textSize)) {
    textSize = appearance.compactLayout ? "small" : "medium";
  }

  return {
    textSize,
    reduceMotion: Boolean(appearance.reduceMotion),
  };
}

const SettingsContext = createContext(null);

function loadSettings() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return defaultSettings;

    const parsed = JSON.parse(saved);

    return {
      notifications: {
        ...defaultSettings.notifications,
        ...parsed.notifications,
      },
      privacy: {
        ...defaultSettings.privacy,
        ...parsed.privacy,
      },
      appearance: normalizeAppearance(parsed.appearance),
    };
  } catch {
    return defaultSettings;
  }
}

function getTheme() {
  return document.documentElement.getAttribute("data-theme") || "light";
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  window.dispatchEvent(
    new CustomEvent("themechange", { detail: theme })
  );
}

function applyAppearance(appearance) {
  document.documentElement.setAttribute(
    "data-text-size",
    appearance.textSize
  );
  document.documentElement.removeAttribute("data-compact");
  document.documentElement.toggleAttribute(
    "data-reduce-motion",
    appearance.reduceMotion
  );
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(loadSettings);
  const [theme, setThemeState] = useState(getTheme);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    applyAppearance(settings.appearance);
  }, [settings]);

  useEffect(() => {
    const handleThemeChange = (event) => {
      setThemeState(event.detail);
    };

    window.addEventListener("themechange", handleThemeChange);
    return () =>
      window.removeEventListener("themechange", handleThemeChange);
  }, []);

  const setTheme = useCallback((nextTheme) => {
    applyTheme(nextTheme);
    setThemeState(nextTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(getTheme() === "dark" ? "light" : "dark");
  }, [setTheme]);

  const updateNotifications = useCallback((key, value) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value,
      },
    }));
  }, []);

  const updatePrivacy = useCallback((key, value) => {
    setSettings((prev) => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value,
      },
    }));
  }, []);

  const updateAppearance = useCallback((key, value) => {
    setSettings((prev) => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        [key]: value,
      },
    }));
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        theme,
        isDark: theme === "dark",
        setTheme,
        toggleTheme,
        notifications: settings.notifications,
        privacy: settings.privacy,
        appearance: settings.appearance,
        updateNotifications,
        updatePrivacy,
        updateAppearance,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error(
      "useSettings must be used within a SettingsProvider"
    );
  }

  return context;
}
