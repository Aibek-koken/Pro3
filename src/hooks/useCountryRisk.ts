import { useQuery } from "@tanstack/react-query";

import { postCountryRisk } from "../api/risk";

export function useCountryRisk(country: string, date: string) {
  return useQuery({
    queryKey: ["country-risk", country, date],
    queryFn: () => postCountryRisk({ country, date }),
    enabled: Boolean(country && date),
  });
}
