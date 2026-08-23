import { useEffect, useState, type ReactNode } from "react";

export type Theme = "light" | "dark" | "auto";

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

  addDarkClass,
}: ThemeToggleProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") {
      return defaultTheme;
    }

    const storedTheme = localStorage.getItem(storageKey);

    if (
      storedTheme === "light" ||
      storedTheme === "dark" ||
      storedTheme === "auto"
    ) {
      return storedTheme;
    }

    return defaultTheme;
  });

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
      } else {
        document.documentElement.classList.remove("dark");
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

  useEffect(() => {
    if (theme === "auto") {
      localStorage.removeItem(storageKey);
    } else {
      localStorage.setItem(storageKey, theme);
    }
    
    onThemeChange?.(theme);
  }, [theme, storageKey, onThemeChange]);

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
