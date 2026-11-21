import { Link } from "react-router-dom";
import { CATEGORIES, SITE_NAME } from "../config";

const YEAR = new Date().getFullYear();

const Footer = () => (
  <footer className="mt-12 bg-nav-light text-paper">
    <div className="h-1.5 bg-gradient-to-r from-brand via-main-light to-brand" />
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6">
      <div>
        <Link to="/general" className="font-heading text-3xl font-black">
          Sage<span className="italic text-main-light">News</span>
        </Link>
        <p className="mt-2 max-w-xs text-sm text-paper/60">
          The day's top headlines, sorted by what you care about.
        </p>
      </div>

      <nav aria-label="Sections" className="sm:justify-self-end">
        <p className="kicker mb-3 text-main-light">Sections</p>
        <ul className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
          {CATEGORIES.map(({ slug, label }) => (
            <li key={slug}>
              <Link to={`/${slug}`} className="text-paper/70 transition-colors hover:text-main-light">
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>

    <div className="border-t border-paper/10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-1 px-4 py-4 text-xs text-paper/50 sm:flex-row sm:px-6">
        <span>© {YEAR} {SITE_NAME}</span>
        <span>
          Powered by{" "}
          <a href="https://newsdata.io" target="_blank" rel="noopener noreferrer" className="underline hover:text-main-light">
            NewsData.io
          </a>
        </span>
      </div>
    </div>
  </footer>
);

export default Footer;
