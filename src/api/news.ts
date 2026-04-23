import { api } from "./client";

export interface NewsArticle {
  title: string;
  url: string;
  source: string;
  published_at: string;
}

export interface NewsResponse {
  articles: NewsArticle[];
  source_type: "rss" | "static";
}

export async function getNews(country: string) {
  const response = await api.get<NewsResponse>(`/api/news/${encodeURIComponent(country)}`);
  return response.data;
}
