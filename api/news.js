// Vercel serverless function: GET /api/news?category=technology&page=<nextPage token>
// The NewsData.io key lives in the NEWSDATA_API_KEY environment variable and never reaches the browser.
import { getNews, CACHE_HEADER } from "./_newsdata.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { status, body } = await getNews(
    { category: req.query.category, page: req.query.page },
    process.env.NEWSDATA_API_KEY,
  );

  res.setHeader("Cache-Control", status === 200 ? CACHE_HEADER : "no-store");
  return res.status(status).json(body);
}
