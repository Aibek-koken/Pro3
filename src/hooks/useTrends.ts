import { useQuery } from "@tanstack/react-query";

import { getTrends } from "../api/risk";

export function useTrends(country: string, months = 6) {
  return useQuery({
    queryKey: ["trends", country, months],
    queryFn: () => getTrends(country, months),
    enabled: Boolean(country),
  });
}
