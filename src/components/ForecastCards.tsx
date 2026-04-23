import type { CountryRiskResponse } from "../api/risk";
import { LoadingSkeleton } from "./LoadingSkeleton";

interface ForecastCardsProps {
  data?: CountryRiskResponse;
  isLoading: boolean;
  errorMessage?: string;
  onRetry: () => void;
}

const forecastPeriods = [
  { label: "7 days", key: "7d" },
  { label: "14 days", key: "14d" },
  { label: "30 days", key: "30d" },
] as const;

function getDeltaLabel(currentCases: number, forecastCases: number) {
  const difference = forecastCases - currentCases;

  if (difference > 0) {
    return {
      icon: "↑",
      text: `Up ${Math.round(difference).toLocaleString()} vs current`,
      className: "text-red-500",
    };
  }

  if (difference < 0) {
    return {
      icon: "↓",
      text: `Down ${Math.abs(Math.round(difference)).toLocaleString()} vs current`,
      className: "text-emerald-600",
    };
  }

  return {
    icon: "→",
    text: "Holding steady",
    className: "text-muted-foreground",
  };
}

export function ForecastCards({ data, isLoading, errorMessage, onRetry }: ForecastCardsProps) {
  if (isLoading) {
    return (
      <section className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="panel p-6">
            <LoadingSkeleton className="h-4 w-20" />
            <LoadingSkeleton className="mt-6 h-10 w-24" />
            <LoadingSkeleton className="mt-4 h-4 w-32" />
          </div>
        ))}
      </section>
    );
  }

  if (errorMessage) {
    return (
      <section className="panel p-6 sm:p-8">
        <p className="text-sm font-medium text-red-500">Couldn&apos;t load the forecast</p>
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
    <section className="grid gap-4 md:grid-cols-3">
      {forecastPeriods.map((period) => {
        const forecastValue = data.forecast[period.key];
        const delta = getDeltaLabel(data.current_cases, forecastValue);

        return (
          <article key={period.key} className="panel p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{period.label}</p>
            <p className="mt-4 text-4xl font-semibold tracking-tight text-foreground">
              {Math.round(forecastValue).toLocaleString()}
            </p>
            <p className={`mt-3 text-sm font-medium ${delta.className}`}>
              <span aria-hidden="true" className="mr-2">
                {delta.icon}
              </span>
              {delta.text}
            </p>
          </article>
        );
      })}
    </section>
  );
}
