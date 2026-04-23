import { getRiskColorByLevel, withAlpha } from "../utils/riskColor";

interface RiskBadgeProps {
  level?: string | null;
  className?: string;
}

export function RiskBadge({ level, className = "" }: RiskBadgeProps) {
  if (!level) {
    return null;
  }

  const color = getRiskColorByLevel(level);

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${className}`.trim()}
      style={{
        color,
        borderColor: withAlpha(color, "33"),
        backgroundColor: withAlpha(color, "14"),
      }}
    >
      {level}
    </span>
  );
}
