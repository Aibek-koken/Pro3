import { useQuery } from "@tanstack/react-query";

import { getNews } from "../api/news";

export function useNews(country: string) {
  return useQuery({
    queryKey: ["news", country],
    queryFn: () => getNews(country),
    enabled: Boolean(country),
  });
}
