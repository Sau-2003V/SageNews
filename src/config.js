export const SITE_NAME = "SageNews";

export const CATEGORIES = [
  { slug: "general", label: "Top Stories" },
  { slug: "technology", label: "Technology" },
  { slug: "business", label: "Business" },
  { slug: "entertainment", label: "Entertainment" },
  { slug: "sports", label: "Sports" },
  { slug: "health", label: "Health" },
  { slug: "science", label: "Science" },
];

// 1 lead story + 9 cards = three full rows on desktop (10 is also NewsData.io's free-plan max)
export const PAGE_SIZE = 10;
