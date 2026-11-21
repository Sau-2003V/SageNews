import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import { SITE_NAME } from "../config";
import { fetchNews } from "../api";

// Append new articles, skipping any story already on the page
const mergeUnique = (prev, more) => {
  const seen = new Set(prev.map((a) => a.url));
  return prev.concat(more.filter((a) => !seen.has(a.url) && seen.add(a.url)));
};

const SkeletonGrid = () => (
  <div className="grid animate-pulse grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
    {Array.from({ length: 4 }, (_, i) => (
      <div
        key={i}
        className={`overflow-hidden rounded-2xl bg-paper/70 ${i === 0 ? "sm:col-span-2 lg:col-span-3 md:grid md:grid-cols-5" : ""}`}
      >
        <div className={`bg-nav-light/15 ${i === 0 ? "aspect-video md:col-span-3 md:aspect-auto md:h-80" : "aspect-16/10"}`} />
        <div className="space-y-3 p-5 md:col-span-2">
          <div className="h-3 w-1/3 rounded bg-brand/15" />
          <div className="h-5 w-full rounded bg-nav-light/15" />
          <div className="h-5 w-4/5 rounded bg-nav-light/15" />
          <div className="h-3 w-2/3 rounded bg-nav-light/10" />
        </div>
      </div>
    ))}
  </div>
);

const News = ({ category, label, setProgress }) => {
  const [articles, setArticles] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    setProgress(10);
    fetchNews({ category })
      .then(({ articles, totalResults, nextPage }) => {
        if (cancelled) return;
        setArticles(mergeUnique([], articles));
        setTotalResults(totalResults);
        setNextPage(nextPage);
      })
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
        setProgress(100);
      });

    return () => {
      cancelled = true;
    };
  }, [category, setProgress]);

  const fetchMore = async () => {
    try {
      const { articles: more, nextPage: token } = await fetchNews({
        category,
        pageToken: nextPage,
      });
      setArticles((prev) => mergeUnique(prev, more));
      setNextPage(token);
    } catch (err) {
      setError(err.message);
      setNextPage(null); // stop infinite scroll
    }
  };

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      {/* React 19 hoists <title> into <head> automatically */}
      <title>{`${label} – ${SITE_NAME}`}</title>
      <div className="mb-8 flex items-center gap-4">
        <h1 className="font-heading text-3xl font-bold italic text-nav-light sm:text-4xl">{label}</h1>
        <span className="h-px flex-1 bg-nav-light/30" />
        {totalResults > 0 && (
          <span className="kicker shrink-0 text-nav-light/60">
            {totalResults.toLocaleString()} stories
          </span>
        )}
      </div>

      {loading && <SkeletonGrid />}

      {error && (
        <div className="rounded-2xl border border-brand/20 bg-paper p-6 text-center" role="alert">
          <p className="font-heading text-xl font-bold text-nav-light">The presses have stopped.</p>
          <p className="mt-1 text-sm text-nav-light/70">Couldn't load news: {error}</p>
        </div>
      )}

      {!loading && !error && articles.length === 0 && (
        <p className="text-center font-heading text-xl italic text-nav-light/70">
          No stories on the wire right now.
        </p>
      )}

      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMore}
        hasMore={Boolean(nextPage) && !error}
        loader={<Spinner />}
        style={{ overflow: "visible" }}
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a, i) => (
            <div key={a.url} className={i === 0 ? "sm:col-span-2 lg:col-span-3" : ""}>
              <NewsItem
                title={a.title}
                description={a.description}
                imgUrl={a.imageUrl}
                url={a.url}
                source={a.source}
                publishedAt={a.publishedAt}
                index={i}
                featured={i === 0}
              />
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </section>
  );
};

export default News;
