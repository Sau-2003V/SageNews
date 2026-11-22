import { useState } from "react";
import { flushSync } from "react-dom";

const STORAGE_KEY = "sagenews-theme";
// Ripple timing and the width of the band of rings at the front of the wave (see index.css)
const RIPPLE_MS = 1100;
const RIPPLE_BAND_PX = 220;

// index.html sets data-theme before React loads, so read the starting value from there
const currentTheme = () =>
  document.documentElement.dataset.theme === "dark" ? "dark" : "light";

const ThemeToggle = () => {
  const [theme, setTheme] = useState(currentTheme);
  const isDark = theme === "dark";

  const applyTheme = (next) => {
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // storage blocked (private mode etc.) – the switch still works for this visit
    }
    // flushSync so the sun/moon icon is already swapped in the new snapshot
    flushSync(() => setTheme(next));
  };

  const toggle = (event) => {
    const next = isDark ? "light" : "dark";
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Browsers without View Transitions (or users who prefer less motion) just switch instantly
    if (!document.startViewTransition || reduceMotion) {
      applyTheme(next);
      return;
    }

    // Ripple rings spread from the centre of the button. The wave travels past the farthest
    // corner of the screen by the width of the ring band, so the page ends fully switched.
    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

    const root = document.documentElement;
    root.style.setProperty("--ripple-x", `${x}px`);
    root.style.setProperty("--ripple-y", `${y}px`);
    root.classList.add("theme-switching");
    const transition = document.startViewTransition(() => applyTheme(next));

    transition.ready
      .then(() => {
        root.animate(
          { "--ripple-r": ["0px", `${radius + RIPPLE_BAND_PX}px`] },
          // fast start, slow finish – like a ripple losing energy as it spreads.
          // fill: "forwards" holds the fully-revealed state until the browser swaps back to the
          // live page; without it the ripple snaps back to 0 for one frame and the old theme blinks.
          {
            duration: RIPPLE_MS,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            fill: "forwards",
            pseudoElement: "::view-transition-new(root)",
          },
        );
      })
      // The browser can skip the animation (e.g. tab in the background); the theme still switches
      .catch(() => {});
    transition.finished.finally(() => document.documentElement.classList.remove("theme-switching"));
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
