import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { TrendsResponse } from "../api/risk";
import { formatShortDate } from "../utils/formatDate";
import { LoadingSkeleton } from "./LoadingSkeleton";

interface TrendChartProps {
  data?: TrendsResponse;
  isLoading: boolean;
  errorMessage?: string;
  onRetry: () => void;
}

function getTrendColor(direction?: string) {
  if (direction === "Decreasing") {
    return "#22c55e";
  }

  if (direction === "Increasing") {
    return "#ef4444";
  }

  return "hsl(var(--muted-foreground))";
}

export function TrendChart({ data, isLoading, errorMessage, onRetry }: TrendChartProps) {
  if (isLoading) {
    return (
      <section className="panel p-6 sm:p-8">
        <LoadingSkeleton className="h-5 w-40" />
        <LoadingSkeleton className="mt-4 h-4 w-32" />
        <LoadingSkeleton className="mt-6 h-56 w-full rounded-3xl" />
      </section>
    );
  }

  if (errorMessage) {
    return (
      <section className="panel p-6 sm:p-8">
        <p className="text-sm font-medium text-red-500">Couldn&apos;t load trend data</p>
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

  if (!data || data.data.length === 0) {
    return (
      <section className="panel p-6 sm:p-8">
        <p className="text-sm font-medium text-foreground">No trend data available</p>
        <p className="mt-1 text-sm text-muted-foreground">Try another country to review the six-month case trajectory.</p>
      </section>
    );
  }

  const trendColor = getTrendColor(data.trend_direction);
  const signedChange = `${data.change_pct > 0 ? "+" : ""}${data.change_pct.toFixed(1)}%`;

  return (
    <section className="panel p-6 sm:p-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight">Trend chart</h2>
          <p className="text-sm text-muted-foreground">30-day moving average of reported cases per 100k across the last six months.</p>
        </div>

        <div className="text-left sm:text-right">
          <p className="text-sm font-medium text-foreground">{data.trend_direction}</p>
          <p className="text-sm" style={{ color: trendColor }}>
            {signedChange}
          </p>
        </div>
      </div>

      <div className="mt-6 h-64 rounded-3xl border border-border/70 bg-background/70 p-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data.data}>
            <defs>
              <linearGradient id="trendGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor={trendColor} stopOpacity={0.24} />
                <stop offset="95%" stopColor={trendColor} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="4 4" vertical={false} />
            <XAxis dataKey="date" tickFormatter={formatShortDate} tick={{ fill: "hsl(var(--muted-foreground))" }} />
            <YAxis tick={{ fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip
              contentStyle={{
                borderRadius: "1rem",
                border: "1px solid hsl(var(--border))",
                backgroundColor: "hsl(var(--card))",
              }}
              formatter={(value) => [`${Number(value ?? 0).toFixed(1)} cases`, "30d average"]}
              labelFormatter={(value) => formatShortDate(String(value))}
            />
            <Area
              type="monotone"
              dataKey="cases_ma_30d"
              stroke={trendColor}
              strokeWidth={3}
              fill="url(#trendGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
