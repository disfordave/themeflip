import {
  useCallback,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type Theme = "light" | "dark" | "auto";

const THEME_CHANGE_EVENT = "themeflip:change";

function isTheme(value: string | null): value is Theme {
  return value === "light" || value === "dark" || value === "auto";
}

export interface ThemeConfig {
  label?: string;
  icon?: ReactNode;
}

export interface ThemeToggleProps {
  defaultTheme?: Theme;
  storageKey?: string;
  onThemeChange?: (theme: Theme) => void;

  auto?: ThemeConfig;
  light?: ThemeConfig;
  dark?: ThemeConfig;

  className?: string;
  indicatorClassName?: string;
  buttonClassName?: string;
  activeButtonClassName?: string;

  addDarkClass?: boolean;
}

export default function ThemeToggle({
  defaultTheme = "auto",
  storageKey = "theme",
  onThemeChange,

  auto,
  light,
  dark,

  className,
  indicatorClassName,
  buttonClassName,
  activeButtonClassName,

  addDarkClass = false,
}: ThemeToggleProps) {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const handleStorage = (event: StorageEvent) => {
        if (event.key === storageKey) {
          onStoreChange();
        }
      };

      const handleThemeChange = () => {
        onStoreChange();
      };

      window.addEventListener("storage", handleStorage);
      window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange);

      return () => {
        window.removeEventListener("storage", handleStorage);
        window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange);
      };
    },
    [storageKey],
  );

  const getSnapshot = useCallback((): Theme => {
    try {
      const storedTheme = localStorage.getItem(storageKey);

      return isTheme(storedTheme) ? storedTheme : defaultTheme;
    } catch {
      return defaultTheme;
    }
  }, [storageKey, defaultTheme]);

  const getServerSnapshot = useCallback(
    (): Theme => defaultTheme,
    [defaultTheme],
  );

  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setTheme = (newTheme: Theme) => {
    try {
      localStorage.setItem(storageKey, newTheme);
    } catch {
      // localStorage may be unavailable
    }

    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
    onThemeChange?.(newTheme);
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      const effectiveTheme =
        theme === "auto" ? (mediaQuery.matches ? "dark" : "light") : theme;

      document.documentElement.dataset.theme = effectiveTheme;

      if (addDarkClass) {
        document.documentElement.classList.toggle(
          "dark",
          effectiveTheme === "dark",
        );
      }
    };

    applyTheme();

    if (theme === "auto") {
      mediaQuery.addEventListener("change", applyTheme);

      return () => {
        mediaQuery.removeEventListener("change", applyTheme);
      };
    }
  }, [theme, addDarkClass]);

  const themes = [
    {
      value: "auto" as const,
      label: auto?.label ?? "Auto",
      icon: auto?.icon ?? <>{auto?.label ?? "Auto"}</>,
    },
    {
      value: "light" as const,
      label: light?.label ?? "Light",
      icon: light?.icon ?? <>{light?.label ?? "Light"}</>,
    },
    {
      value: "dark" as const,
      label: dark?.label ?? "Dark",
      icon: dark?.icon ?? <>{dark?.label ?? "Dark"}</>,
    },
  ];

  return (
    <div className={className} data-theme-toggle>
      <div
        className={indicatorClassName}
        data-theme-indicator
        data-theme={theme}
      />
      {themes.map((item) => (
        <button
          key={item.value}
          type="button"
          title={item.label}
          aria-label={item.label}
          aria-pressed={theme === item.value}
          data-theme-option={item.value}
          data-active={theme === item.value ? "true" : "false"}
          className={[
            buttonClassName,
            theme === item.value ? activeButtonClassName : undefined,
          ]
            .filter(Boolean)
            .join(" ")}
          onClick={() => setTheme(item.value)}
        >
          {item.icon}
        </button>
      ))}
    </div>
  );
}
