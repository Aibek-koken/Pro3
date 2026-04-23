import type { CountryRiskResponse } from "../api/risk";
import { getRiskColorByLevel, withAlpha } from "../utils/riskColor";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { RiskBadge } from "./RiskBadge";

interface RiskOverviewProps {
  country: string;
  data?: CountryRiskResponse;
  isLoading: boolean;
  errorMessage?: string;
  onRetry: () => void;
}

export function RiskOverview({ country, data, isLoading, errorMessage, onRetry }: RiskOverviewProps) {
  if (isLoading) {
    return (
      <section className="panel p-6 sm:p-8">
        <LoadingSkeleton className="h-5 w-36" />
        <LoadingSkeleton className="mt-6 h-16 w-32" />
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <LoadingSkeleton className="h-24 w-full" />
          <LoadingSkeleton className="h-24 w-full" />
        </div>
      </section>
    );
  }

  if (errorMessage) {
    return (
      <section className="panel p-6 sm:p-8">
        <p className="text-sm font-medium text-red-500">Couldn&apos;t load the risk overview</p>
        <p className="mt-1 text-sm text-muted-foreground">{errorMessage}</p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex min-h-10 items-center rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Retry
        </button>
      </section>
    );
  }

  if (!data) {
    return null;
  }

  const accentColor = getRiskColorByLevel(data.risk_level);
  const dominantDisease = data.dominant_disease ?? "Regional risk";

  return (
    <section className="panel overflow-hidden p-6 sm:p-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Current outbreak signal
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">{country}</h2>
          </div>

          <RiskBadge level={data.risk_level} />
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Risk score</p>
            <p className="text-6xl font-semibold tracking-tight text-foreground">{Math.round(data.risk_score)}</p>
          </div>

          <div
            className="inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold uppercase tracking-[0.16em]"
            style={{
              color: accentColor,
              borderColor: withAlpha(accentColor, "33"),
              backgroundColor: withAlpha(accentColor, "14"),
            }}
          >
            {dominantDisease}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-muted/50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Current cases</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
              {Math.round(data.current_cases).toLocaleString()}
            </p>
          </div>
          <div className="rounded-2xl bg-muted/50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Risk outlook</p>
            <p className="mt-2 text-lg font-semibold text-foreground">
              {data.risk_level === "HIGH"
                ? "Immediate caution advised"
                : data.risk_level === "MEDIUM"
                  ? "Conditions need monitoring"
                  : "Signal remains manageable"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
