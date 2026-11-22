import { useState } from "react";

// Shown when an article has no image or its image fails to load
const PLACEHOLDER = "/placeholder.svg";

const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short" }) : "";

const NewsItem = ({ title, description, imgUrl, url, source, publishedAt, index, featured }) => {
  const [imgFailed, setImgFailed] = useState(!imgUrl);
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
          <span className="kicker absolute left-4 top-4 rounded-full bg-main-light px-3 py-1 text-nav-light shadow">
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
        {(source || publishedAt) && (
          <p className={`kicker flex min-w-0 items-center gap-2 text-card-accent ${featured ? "" : "text-[10px] sm:text-[11px]"}`}>
            {source && <span className="truncate">{source}</span>}
            {/* date is hidden on compact phone cards so the source name has room */}
            {source && publishedAt && (
              <span className={`h-1 w-1 shrink-0 rounded-full bg-sand ${featured ? "" : "hidden sm:block"}`} />
            )}
            {publishedAt && (
              <time
                className={`shrink-0 text-card-text/60 dark:text-card-text/80 ${featured ? "" : "hidden sm:inline"}`}
                dateTime={publishedAt}
              >
                {formatDate(publishedAt)}
              </time>
            )}
          </p>
        )}

        <h2
          className={`font-heading font-bold leading-tight text-card-text ${
            featured ? "text-2xl sm:text-3xl lg:text-4xl" : "line-clamp-4 text-[15px] sm:line-clamp-3 sm:text-xl"
          }`}
        >
          {/* stretched link: whole card is clickable */}
          <a href={url} target="_blank" rel="noopener noreferrer" className="after:absolute after:inset-0 focus:outline-none">
            {title}
          </a>
        </h2>

        {description && (
          <p
            className={`text-sm leading-relaxed text-card-text/70 dark:text-card-text/85 ${
              featured ? "line-clamp-4 sm:text-base" : "hidden sm:line-clamp-3"
            }`}
          >
            {description}
          </p>
        )}

        <span className={`read-link mt-auto pt-1 text-card-accent ${featured ? "" : "hidden sm:inline-flex"}`} aria-hidden="true">
          Read story <span>→</span>
        </span>
      </div>

      {/* keyboard focus ring for the stretched link */}
      <span className="pointer-events-none absolute inset-0 rounded-2xl ring-brand-light ring-offset-2 group-has-[a:focus-visible]:ring-2" />
    </article>
  );
};

export default NewsItem;
