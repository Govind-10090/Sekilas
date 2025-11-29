import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Define the NewsItem interface globally
export interface NewsItem {
  id: string; // Add id property
  category?: string; // Add category property (optional)
  title: string;
  description: string; // Add description property
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    name: string;
  };
}

export function categorizeNews(article: NewsItem) {
  // Placeholder categorization logic
  if (article.title.includes("politics")) {
    return "Politics";
  } else if (article.title.includes("sports")) {
    return "Sports";
  } else if (article.title.includes("technology")) {
    return "Technology";
  } else {
    return "General";
  }
}
