import { RiskBadge } from "./RiskBadge";
import { getRiskColorByScore } from "../utils/riskColor";

interface HealthGaugeProps {
  score: number | null;
  riskLevel?: string | null;
}

export function HealthGauge({ score, riskLevel }: HealthGaugeProps) {
  const normalizedScore = score === null ? 0 : Math.max(0, Math.min(100, Math.round(score)));
  const color = getRiskColorByScore(score);
  const radius = 88;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (normalizedScore / 100) * circumference;

  return (
    <section className="panel overflow-hidden p-6 sm:p-8">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="relative flex h-56 w-56 items-center justify-center">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 220 220" role="img" aria-label="Health score gauge">
            <circle cx="110" cy="110" r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth="16" />
            <circle
              cx="110"
              cy="110"
              r={radius}
              fill="none"
              stroke={color}
              strokeWidth="16"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              className="transition-[stroke-dashoffset] duration-700 ease-out motion-reduce:transition-none"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Health Score
            </span>
            <span className="mt-3 text-5xl font-semibold tracking-tight text-foreground">
              {score === null ? "--" : normalizedScore}
            </span>
            <span className="mt-2 text-sm text-muted-foreground">
              {score === null ? "Check your symptoms below" : "Higher is healthier"}
            </span>
          </div>
        </div>

        {riskLevel ? <RiskBadge level={riskLevel} /> : null}
      </div>
    </section>
  );
}
