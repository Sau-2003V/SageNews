import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import { PAGE_SIZE, SITE_NAME } from "../config";

// const buildUrl = (category, apiKey, page) =>
//   `https://newsapi.org/v2/top-headlines?${new URLSearchParams({
//     category,
//     apiKey: apiKey ?? "",
//     pageSize: PAGE_SIZE,
//     page,
//   })}`; works with newsapi

const buildUrl = (category, apiKey, page) =>
  `https://newsdata.io/api/1/latest?${new URLSearchParams({
    category,
    apiKey: apiKey ?? "",
    pageSize: PAGE_SIZE,
    page,
  })}`;

async function fetchPage(category, apiKey, page) {
  const res = await fetch(buildUrl(category, apiKey, page));
  const data = await res.json();
  if (!res.ok || data.status === "error") {
    throw new Error(data.message || `Request failed (${res.status})`);
  }
  // NewsAPI marks deleted stories with "[Removed]"
  const articles = (data.articles ?? []).filter((a) => a.title && a.title !== "[Removed]");
  return { articles, totalResults: data.totalResults ?? 0 };
}

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

const News = ({ category, label, apiKey, setProgress }) => {
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = `${label} – ${SITE_NAME}`;
    let cancelled = false;

    setProgress(10);
    fetchPage(category, apiKey, 1)
      .then(({ articles, totalResults }) => {
        if (cancelled) return;
        setArticles(articles);
        setTotalResults(totalResults);
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
  }, [category, label, apiKey, setProgress]);

  const fetchMore = async () => {
    const next = page + 1;
    try {
      const { articles: more } = await fetchPage(category, apiKey, next);
      setArticles((prev) => prev.concat(more));
      setPage(next);
      if (more.length === 0) setTotalResults(0); // stop infinite scroll
    } catch (err) {
      setError(err.message);
      setTotalResults(0);
    }
  };

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-8 flex items-center gap-4">
        <h1 className="font-heading text-3xl font-bold italic text-nav-light sm:text-4xl">{label}</h1>
        <span className="h-px flex-1 bg-nav-light/30" />
        {totalResults > 0 && (
          <span className="kicker shrink-0 text-nav-light/60">{totalResults} stories</span>
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
        hasMore={articles.length < totalResults}
        loader={<Spinner />}
        style={{ overflow: "visible" }}
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a, i) => (
            <div key={a.url} className={i === 0 ? "sm:col-span-2 lg:col-span-3" : ""}>
              <NewsItem
                title={a.title}
                description={a.description}
                imgUrl={a.urlToImage}
                url={a.url}
                source={a.source?.name}
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

News.propTypes = {
  category: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  apiKey: PropTypes.string,
  setProgress: PropTypes.func.isRequired,
};

export default News;
