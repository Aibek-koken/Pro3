import type { CountryRiskResponse } from "../api/risk";
import { LoadingSkeleton } from "./LoadingSkeleton";

interface RiskBreakdownProps {
  data?: CountryRiskResponse;
  isLoading: boolean;
  errorMessage?: string;
  onRetry: () => void;
}

const breakdownConfig = [
  { key: "classification", label: "Classification", max: 50, color: "#ef4444" },
  { key: "forecast_trend", label: "Forecast trend", max: 30, color: "#f59e0b" },
  { key: "anomaly_signal", label: "Anomaly signal", max: 20, color: "hsl(var(--primary))" },
] as const;

export function RiskBreakdown({ data, isLoading, errorMessage, onRetry }: RiskBreakdownProps) {
  if (isLoading) {
    return (
      <section className="panel p-6 sm:p-8">
        <LoadingSkeleton className="h-5 w-36" />
        <div className="mt-6 space-y-5">
          {Array.from({ length: 3 }).map((_, index) => (
            <LoadingSkeleton key={index} className="h-16 w-full rounded-2xl" />
          ))}
        </div>
      </section>
    );
  }

  if (errorMessage) {
    return (
      <section className="panel p-6 sm:p-8">
        <p className="text-sm font-medium text-red-500">Couldn&apos;t load the breakdown</p>
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

  return (
    <section className="panel p-6 sm:p-8">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight">Risk breakdown</h2>
        <p className="text-sm text-muted-foreground">How the classification, forecast, and anomaly signals shape the score.</p>
      </div>

      <div className="mt-6 space-y-5">
        {breakdownConfig.map((item) => {
          const value = data.breakdown[item.key];
          const progress = Math.min((value / item.max) * 100, 100);

          return (
            <div key={item.key} className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-sm font-semibold text-foreground">
                  {Math.round(value)} / {item.max}
                </p>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full transition-[width] duration-700 ease-out motion-reduce:transition-none"
                  style={{ width: `${progress}%`, backgroundColor: item.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
