import { useState } from "react";
import PropTypes from "prop-types";

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
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl bg-paper shadow-[0_1px_0_rgba(15,40,98,0.08),0_12px_28px_-14px_rgba(15,40,98,0.45)] ring-1 ring-nav-light/10 transition duration-300 hover:-translate-y-1 hover:shadow-[0_1px_0_rgba(15,40,98,0.08),0_22px_40px_-16px_rgba(75,0,130,0.5)] ${
        featured ? "md:grid md:grid-cols-5" : ""
      }`}
    >
      <div
        className={`relative overflow-hidden bg-nav-light ${
          featured ? "aspect-video md:col-span-3 md:aspect-auto md:min-h-[22rem]" : "aspect-[16/10]"
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
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-nav-light/60 via-transparent to-transparent opacity-70 transition-opacity group-hover:opacity-40" />
        {featured && (
          <span className="kicker absolute left-4 top-4 rounded-full bg-main-light px-3 py-1 text-nav-light shadow">
            Lead story
          </span>
        )}
        {!featured && index != null && (
          <span className="absolute bottom-2 right-3 font-heading text-4xl font-black text-paper/90 drop-shadow">
            {String(index).padStart(2, "0")}
          </span>
        )}
      </div>

      <div className={`flex grow flex-col gap-3 p-5 ${featured ? "md:col-span-2 md:justify-center md:p-8" : ""}`}>
        {(source || publishedAt) && (
          <p className="kicker flex items-center gap-2 text-brand">
            {source && <span className="truncate">{source}</span>}
            {source && publishedAt && <span className="h-1 w-1 shrink-0 rounded-full bg-sand" />}
            {publishedAt && <time className="shrink-0 text-nav-light/60" dateTime={publishedAt}>{formatDate(publishedAt)}</time>}
          </p>
        )}

        <h2
          className={`font-heading font-bold leading-tight text-nav-light ${
            featured ? "text-2xl sm:text-3xl lg:text-4xl" : "line-clamp-3 text-xl"
          }`}
        >
          {/* stretched link: whole card is clickable */}
          <a href={url} target="_blank" rel="noopener noreferrer" className="after:absolute after:inset-0 focus:outline-none">
            {title}
          </a>
        </h2>

        {description && (
          <p className={`text-sm leading-relaxed text-nav-light/70 ${featured ? "line-clamp-4 sm:text-base" : "line-clamp-3"}`}>
            {description}
          </p>
        )}

        <span className="read-link mt-auto pt-1" aria-hidden="true">
          Read story <span>→</span>
        </span>
      </div>

      {/* keyboard focus ring for the stretched link */}
      <span className="pointer-events-none absolute inset-0 rounded-2xl ring-brand-light ring-offset-2 group-has-[a:focus-visible]:ring-2" />
    </article>
  );
};

NewsItem.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  imgUrl: PropTypes.string,
  url: PropTypes.string.isRequired,
  source: PropTypes.string,
  publishedAt: PropTypes.string,
  index: PropTypes.number,
  featured: PropTypes.bool,
};

export default NewsItem;
