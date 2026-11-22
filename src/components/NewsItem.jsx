import { useId, useState } from "react";

// Shown when an article has no image or its image fails to load
const PLACEHOLDER = "/placeholder.svg";

const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short" }) : "";

// How much of the description shows, collapsed → expanded.
// Small cards hide it on phones until expanded; the lead story always shows some.
const descriptionClamp = (featured, expanded) => {
  if (featured) return expanded ? "line-clamp-10" : "line-clamp-4";
  // sm:min-h reserves 3 lines so closed cards line up even with short descriptions
  return `sm:min-h-[4.875em] ${expanded ? "line-clamp-5 sm:line-clamp-8" : "hidden sm:line-clamp-3"}`;
};

const NewsItem = ({ title, description, imgUrl, url, source, publishedAt, index, featured }) => {
  const [imgFailed, setImgFailed] = useState(!imgUrl);
  const [expanded, setExpanded] = useState(false);
  const previewId = useId();
  const src = imgUrl
    ? `https://images.weserv.nl/?url=${encodeURIComponent(imgUrl)}&w=${featured ? 1200 : 640}`
    : null;

  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-xl bg-card sm:rounded-2xl shadow-card ring-1 ring-nav-light/10 transition duration-300 hover:-translate-y-1 hover:shadow-card-hover ${
        featured ? "md:grid md:grid-cols-5" : ""
      }`}
    >
      <div
        className={`relative overflow-hidden bg-nav-light ${
          featured ? "aspect-video md:col-span-3 md:aspect-auto md:min-h-88" : "aspect-16/10"
        }`}
      >
        <img
          src={imgFailed ? PLACEHOLDER : src}
          alt=""
          loading={featured ? "eager" : "lazy"}
          referrerPolicy="no-referrer"
          onError={() => setImgFailed(true)}
          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        {/* duotone wash on hover */}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-nav-light/60 via-transparent to-transparent opacity-70 transition-opacity group-hover:opacity-40" />
        {featured && (
          <span className="kicker absolute left-4 top-4 rounded-full bg-main-light px-3 py-1 text-nav-light shadow dark:text-white dark:bg-[#5E8263]">
            Lead story
          </span>
        )}
        {!featured && index != null && (
          <span className="absolute bottom-1 right-2 font-heading text-2xl font-black text-paper/90 drop-shadow sm:bottom-2 sm:right-3 sm:text-4xl">
            {String(index).padStart(2, "0")}
          </span>
        )}
      </div>

      {/* Small cards are compact on phones (two per row); from sm up everything is full size */}
      <div
        className={`flex grow flex-col ${
          featured ? "gap-3 p-5 md:col-span-2 md:justify-center md:p-8" : "gap-1.5 p-3 sm:gap-3 sm:p-5"
        }`}
      >
        <p className={`kicker flex min-w-0 items-center gap-2 text-card-accent ${featured ? "" : "text-[10px] sm:text-[11px]"}`}>
          {/* source name (e.g. NDTV): accent colour in light mode, same colour as the card text in dark mode */}
          {source && <span className="truncate dark:text-card-text/90">{source}</span>}
          {/* date is hidden on compact phone cards so the source name has room (shown again when expanded) */}
          {source && publishedAt && (
            <span className={`h-1 w-1 shrink-0 rounded-full bg-sand ${featured || expanded ? "" : "hidden sm:block"}`} />
          )}
          {publishedAt && (
            <time
              className={`shrink-0 text-card-text/60 dark:text-card-text/70 ${featured || expanded ? "" : "hidden sm:inline"}`}
              dateTime={publishedAt}
            >
              {formatDate(publishedAt)}
            </time>
          )}
          {/* open / closed indicator */}
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
            className={`ml-auto h-4 w-4 shrink-0 text-card-text/60 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
          >
            <path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.06l3.71-3.83a.75.75 0 1 1 1.08 1.04l-4.25 4.39a.75.75 0 0 1-1.08 0L5.21 8.27a.75.75 0 0 1 .02-1.06z" />
          </svg>
        </p>

        <h2
          className={`font-heading font-bold leading-tight text-card-text dark:text-card-text/90 ${
            featured
              ? "text-2xl sm:text-3xl lg:text-4xl"
              : // min-h reserves 4 lines (phones) / 3 lines (sm+) so closed cards line up even with short headlines
                `min-h-[5em] text-[15px] sm:min-h-[3.75em] sm:text-xl ${expanded ? "" : "line-clamp-4 sm:line-clamp-3"}`
          }`}
        >
          {title}
        </h2>

        {description && (
          <p
            id={previewId}
            // key re-mounts the paragraph so the fade-in plays each time it opens
            key={expanded ? "open" : "closed"}
            className={`text-sm leading-relaxed text-card-text/70 dark:text-card-text/75 ${featured ? "sm:text-base" : ""} ${descriptionClamp(featured, expanded)} ${
              expanded ? "animate-preview-in" : ""
            }`}
          >
            {description}
          </p>
        )}
        {/* no description: keep the same 3-line space on sm+ so the card matches its neighbours */}
        {!description && !featured && <div className="hidden min-h-[4.875em] text-sm sm:block" aria-hidden="true" />}

        {/* The only link to the article. z-10 keeps it above the card-wide expand button.
            Accent colour in light mode, same colour as the card text in dark mode. */}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={`read-link relative z-10 mt-auto self-start pt-1 text-card-accent focus:outline-none focus-visible:underline dark:text-card-text/90 ${
            featured || expanded ? "" : "hidden sm:inline-flex"
          } ${expanded ? "animate-preview-in" : ""}`}
        >
          Read story <span aria-hidden="true">→</span>
        </a>
      </div>

      {/* Invisible button covering the whole card: click/tap anywhere (except "Read story") to expand or collapse */}
      <button
        type="button"
        onClick={() => setExpanded((open) => !open)}
        aria-expanded={expanded}
        aria-controls={description ? previewId : undefined}
        className="absolute inset-0 cursor-pointer rounded-xl focus:outline-none sm:rounded-2xl"
      >
        <span className="sr-only">
          {expanded ? "Hide preview" : "Show preview"}: {title}
        </span>
      </button>

      {/* keyboard focus ring */}
      <span className="pointer-events-none absolute inset-0 rounded-xl ring-brand-light ring-offset-2 group-has-[:focus-visible]:ring-2 sm:rounded-2xl" />
    </article>
  );
};

export default NewsItem;
