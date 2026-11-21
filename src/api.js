// Talks to our own /api/news endpoint (api/news.js), which calls NewsData.io
// server-side so the API key never ships to the browser.

/**
 * Fetch one page of headlines for a category.
 * `pageToken` is the `nextPage` value from the previous response (omit for the first page).
 * Resolves to { articles, totalResults, nextPage } – nextPage is null when there are no more.
 */
export async function fetchNews({ category, pageToken }) {
  const params = new URLSearchParams({ category });
  if (pageToken) params.set("page", pageToken);

  const res = await fetch(`/api/news?${params}`);
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}
