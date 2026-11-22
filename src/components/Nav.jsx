import { Link, NavLink } from "react-router-dom";
import { CATEGORIES, SITE_NAME } from "../config";
import ThemeToggle from "./ThemeToggle";

const today = new Date().toLocaleDateString(undefined, {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const linkClass = ({ isActive }) =>
  `relative block whitespace-nowrap px-3 py-3 text-sm font-medium transition-colors sm:px-4 ${
    isActive
      ? "text-main-light after:absolute after:inset-x-3 after:bottom-0 after:h-[3px] after:rounded-t after:bg-main-light sm:after:inset-x-4"
      : "text-paper/70 hover:text-paper"
  }`;

const Nav = () => (
  <>
    {/* Masthead */}
    <header className="mx-auto w-full max-w-6xl px-4 pt-5 sm:px-6 sm:pt-8">
      <div className="flex items-center justify-between border-b border-nav-light/20 pb-2 text-[11px] font-medium uppercase tracking-[0.14em] text-nav-light/70 sm:text-xs dark:border-paper/25 dark:text-paper/90">
        <span>{today}</span>
        <span className="hidden sm:inline">Top headlines, every hour</span>
      </div>

      <Link to="/general" className="group block py-4 text-center sm:py-6">
        <span className="font-heading text-5xl font-black tracking-tight text-brand-light sm:text-7xl dark:text-paper">
          Sage<span className="text-brand italic transition-colors group-hover:text-brand-light dark:text-main-light dark:group-hover:text-paper">News</span>
        </span>
        <span className="sr-only">{SITE_NAME} home</span>
      </Link>

      <div className="h-1.5 border-y border-nav-light/60 dark:border-paper/50" />
    </header>

    {/* Category bar */}
    <nav className="sticky top-0 z-40 mt-4 bg-nav-light shadow-bar">
      <div className="mx-auto flex max-w-6xl items-center gap-2 pl-2 pr-3 sm:px-6">
        <ul className="no-scrollbar flex min-w-0 flex-1 overflow-x-auto sm:justify-center">
          {CATEGORIES.map(({ slug, label }) => (
            <li key={slug}>
              <NavLink to={`/${slug}`} className={linkClass}>
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
        {/* far right of the bar */}
        <ThemeToggle />
      </div>
    </nav>
  </>
);

export default Nav;
