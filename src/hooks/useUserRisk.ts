import { useMutation } from "@tanstack/react-query";

import { postUserRisk } from "../api/risk";

export function useUserRisk() {
  return useMutation({
    mutationFn: postUserRisk,
  });
}
