// Server-side NewsData.io client – https://newsdata.io/documentation
// Used by the Vercel function (api/news.js) and by the Vite dev server (vite.config.js).
// Files starting with "_" inside /api are not exposed as routes by Vercel.

const ENDPOINT = "https://newsdata.io/api/1/latest";
const PAGE_SIZE = 10; // NewsData.io free-plan maximum

// Our route slugs → NewsData.io category names. Anything else is rejected.
const CATEGORIES = {
  general: "top",
  technology: "technology",
  business: "business",
  entertainment: "entertainment",
  sports: "sports",
  health: "health",
  science: "science",
};

// NewsData.io sends "2026-11-21 03:18:50" in UTC; make it a real ISO timestamp
const toIso = (pubDate) => (pubDate ? `${pubDate.replace(" ", "T")}Z` : undefined);

const normalize = (a) => ({
  id: a.article_id ?? a.link,
  title: a.title,
  description: a.description,
  url: a.link,
  imageUrl: a.image_url,
  source: a.source_name,
  publishedAt: toIso(a.pubDate),
});

/**
 * Returns { status, body } ready to send as JSON.
 * @param {{ category?: string|null, page?: string|null }} query
 * @param {string|undefined} apiKey
 */
export async function getNews({ category, page }, apiKey) {
  if (!apiKey) {
    return { status: 500, body: { error: "NEWSDATA_API_KEY is not set on the server." } };
  }
  const apiCategory = CATEGORIES[category ?? "general"];
  if (!apiCategory) {
    return { status: 400, body: { error: `Unknown category "${category}".` } };
  }
  if (page && !/^[\w-]{1,64}$/.test(page)) {
    return { status: 400, body: { error: "Invalid page token." } };
  }

  const params = new URLSearchParams({
    apikey: apiKey,
    category: apiCategory,
    language: "en",
    prioritydomain: "top", // skip press-release sites
    removeduplicate: "1",
    size: String(PAGE_SIZE),
  });
  if (page) params.set("page", page);

  let res, data;
  try {
    res = await fetch(`${ENDPOINT}?${params}`);
    data = await res.json().catch(() => ({}));
  } catch {
    return { status: 502, body: { error: "Couldn't reach NewsData.io." } };
  }

  if (!res.ok || data.status !== "success") {
    return {
      status: res.status === 429 ? 429 : 502,
      body: { error: data.results?.message || data.message || `NewsData.io error (${res.status})` },
    };
  }

  return {
    status: 200,
    body: {
      articles: (data.results ?? []).filter((a) => a.title && a.link).map(normalize),
      totalResults: data.totalResults ?? 0,
      nextPage: data.nextPage ?? null,
    },
  };
}

// Successful responses are cached on Vercel's CDN for 10 min, then served stale
// for up to an hour while refreshing – keeps you well inside the daily request limit.
export const CACHE_HEADER = "public, s-maxage=600, stale-while-revalidate=3600";
