import { useEffect, useState } from "react";

import type { UserRiskRequest, UserRiskResponse } from "../api/risk";
import { HealthGauge } from "../components/HealthGauge";
import { MiniHistory } from "../components/MiniHistory";
import type { HistoryEntry } from "../components/MiniHistory";
import { SymptomChecker } from "../components/SymptomChecker";
import { getRiskColorByLevel, withAlpha } from "../utils/riskColor";

const HISTORY_STORAGE_KEY = "biosec_history";

function readHistory() {
  if (typeof window === "undefined") {
    return [] as HistoryEntry[];
  }

  try {
    const storedValue = window.localStorage.getItem(HISTORY_STORAGE_KEY);

    if (!storedValue) {
      return [] as HistoryEntry[];
    }

    const parsedValue = JSON.parse(storedValue) as unknown;

    if (!Array.isArray(parsedValue)) {
      return [] as HistoryEntry[];
    }

    return parsedValue.filter(
      (item): item is HistoryEntry =>
        typeof item === "object" &&
        item !== null &&
        "date" in item &&
        "country" in item &&
        "user_risk_score" in item &&
        "risk_level" in item,
    );
  } catch {
    return [] as HistoryEntry[];
  }
}

export function HealthShield() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [latestResult, setLatestResult] = useState<UserRiskResponse | null>(null);

  useEffect(() => {
    setHistory(readHistory());
  }, []);

  function handleResult(result: UserRiskResponse, values: UserRiskRequest) {
    setLatestResult(result);

    const nextEntry: HistoryEntry = {
      date: values.date,
      country: values.country,
      user_risk_score: result.user_risk_score,
      risk_level: result.risk_level,
    };

    setHistory((currentHistory) => {
      const nextHistory = [...currentHistory, nextEntry].slice(-7);
      window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(nextHistory));
      return nextHistory;
    });
  }

  const healthScore = latestResult ? 100 - latestResult.user_risk_score : null;
  const recommendationColor = getRiskColorByLevel(latestResult?.risk_level);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <section className="space-y-3 text-center">
        <span className="inline-flex self-center rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Personal risk tracker
        </span>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">My Health Shield</h1>
        <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base">
          Monitor your symptoms, estimate your exposure level, and keep a lightweight history of recent checks.
        </p>
      </section>

      <HealthGauge score={healthScore} riskLevel={latestResult?.risk_level} />
      <SymptomChecker onResult={handleResult} />

      {latestResult ? (
        <section
          className="panel p-6 sm:p-8"
          style={{
            borderLeftWidth: "4px",
            borderLeftColor: recommendationColor,
          }}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold tracking-tight">Recommendations</h2>
              <p className="text-sm text-muted-foreground">
                Actions tailored to your current risk profile and symptom report.
              </p>
            </div>

            {latestResult.dominant_disease ? (
              <span
                className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]"
                style={{
                  color: recommendationColor,
                  borderColor: withAlpha(recommendationColor, "33"),
                  backgroundColor: withAlpha(recommendationColor, "14"),
                }}
              >
                {latestResult.dominant_disease}
              </span>
            ) : null}
          </div>

          <ul className="mt-6 space-y-3">
            {latestResult.recommendations.map((recommendation) => (
              <li key={recommendation} className="flex items-start gap-3 text-sm text-foreground">
                <span
                  className="mt-1 h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: recommendationColor }}
                  aria-hidden="true"
                />
                <span>{recommendation}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <MiniHistory history={history} />
    </div>
  );
}
