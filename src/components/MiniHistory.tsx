import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatShortDate } from "../utils/formatDate";
import { RiskBadge } from "./RiskBadge";

export interface HistoryEntry {
  date: string;
  country: string;
  user_risk_score: number;
  risk_level: string;
}

interface MiniHistoryProps {
  history: HistoryEntry[];
}

export function MiniHistory({ history }: MiniHistoryProps) {
  const latestEntry = history[history.length - 1];

  return (
    <section className="panel p-6 sm:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight">Recent checks</h2>
          <p className="text-sm text-muted-foreground">Your last seven symptom checks, stored in this browser.</p>
        </div>

        {latestEntry ? <RiskBadge level={latestEntry.risk_level} /> : null}
      </div>

      {history.length < 2 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-border bg-muted/30 px-5 py-10 text-center">
          <p className="text-sm font-medium text-foreground">Complete more checks to see your trend</p>
          <p className="mt-1 text-sm text-muted-foreground">
            We&apos;ll chart your personal risk once you have at least two entries.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-muted/50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Latest score</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
                {Math.round(latestEntry.user_risk_score)}
              </p>
            </div>
            <div className="rounded-2xl bg-muted/50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Country</p>
              <p className="mt-2 text-lg font-semibold text-foreground">{latestEntry.country}</p>
            </div>
            <div className="rounded-2xl bg-muted/50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Updated</p>
              <p className="mt-2 text-lg font-semibold text-foreground">{formatShortDate(latestEntry.date)}</p>
            </div>
          </div>

          <div className="h-56 rounded-3xl border border-border/70 bg-background/70 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="date" tickFormatter={formatShortDate} tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <YAxis domain={[0, 100]} tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "1rem",
                    border: "1px solid hsl(var(--border))",
                    backgroundColor: "hsl(var(--card))",
                  }}
                  formatter={(value) => [`${Math.round(Number(value ?? 0))} risk`, "User risk"]}
                  labelFormatter={(value) => formatShortDate(String(value))}
                />
                <Line
                  type="monotone"
                  dataKey="user_risk_score"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))", r: 4 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </section>
  );
}
