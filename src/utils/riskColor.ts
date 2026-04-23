export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export const RISK_COLORS: Record<RiskLevel, string> = {
  LOW: "#22c55e",
  MEDIUM: "#f59e0b",
  HIGH: "#ef4444",
};

export function getRiskColorByLevel(level?: string | null) {
  if (!level) {
    return "hsl(var(--muted-foreground))";
  }

  const normalizedLevel = level.toUpperCase() as RiskLevel;
  return RISK_COLORS[normalizedLevel] ?? "hsl(var(--muted-foreground))";
}

export function getRiskColorByScore(score?: number | null) {
  if (score === null || score === undefined || Number.isNaN(score)) {
    return "hsl(var(--muted-foreground))";
  }

  if (score >= 67) {
    return RISK_COLORS.LOW;
  }

  if (score >= 34) {
    return RISK_COLORS.MEDIUM;
  }

  return RISK_COLORS.HIGH;
}

export function withAlpha(hexColor: string, alpha: string) {
  return `${hexColor}${alpha}`;
}
