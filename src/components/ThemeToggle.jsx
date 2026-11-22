import { useState } from "react";

const STORAGE_KEY = "sagenews-theme";

// index.html sets data-theme before React loads, so read the starting value from there
const currentTheme = () =>
  document.documentElement.dataset.theme === "dark" ? "dark" : "light";

const ThemeToggle = () => {
  const [theme, setTheme] = useState(currentTheme);
  const isDark = theme === "dark";

  const toggle = () => {
    const next = isDark ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // storage blocked (private mode etc.) – the switch still works for this visit
    }
    setTheme(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      title={isDark ? "Light mode" : "Dark mode"}
      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-paper/80 transition-colors hover:bg-white/10 hover:text-paper focus:outline-none focus-visible:ring-2 focus-visible:ring-paper/70"
    >
      {isDark ? (
        // sun
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      ) : (
        // moon
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
};

export default ThemeToggle;
