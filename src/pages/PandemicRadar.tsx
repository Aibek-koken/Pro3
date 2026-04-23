import { useEffect, useState } from "react";

import { CountrySelector } from "../components/CountrySelector";
import { ForecastCards } from "../components/ForecastCards";
import { NewsBlock } from "../components/NewsBlock";
import { RiskBreakdown } from "../components/RiskBreakdown";
import { RiskOverview } from "../components/RiskOverview";
import { TrendChart } from "../components/TrendChart";
import { useCountries } from "../hooks/useCountries";
import { useCountryRisk } from "../hooks/useCountryRisk";
import { useNews } from "../hooks/useNews";
import { useTrends } from "../hooks/useTrends";
import { getTodayISO } from "../utils/formatDate";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "This request failed. Try again in a moment.";
}

export function PandemicRadar() {
  const [selectedCountry, setSelectedCountry] = useState("Kazakhstan");
  const [selectedDate] = useState(getTodayISO());

  const countriesQuery = useCountries();
  const countryRiskQuery = useCountryRisk(selectedCountry, selectedDate);
  const trendsQuery = useTrends(selectedCountry, 6);
  const newsQuery = useNews(selectedCountry);

  useEffect(() => {
    const countries = countriesQuery.data?.countries;

    if (!countries || countries.length === 0) {
      return;
    }

    if (!countries.includes(selectedCountry)) {
      setSelectedCountry(countries.includes("Kazakhstan") ? "Kazakhstan" : countries[0]);
    }
  }, [countriesQuery.data?.countries, selectedCountry]);

  return (
    <div className="flex flex-col gap-8">
      <section className="space-y-3">
        <span className="inline-flex rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Regional surveillance
        </span>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">Global Pandemic Radar</h1>
        <p className="max-w-3xl text-sm text-muted-foreground sm:text-base">
          Compare country-level outbreak signals, forecast trajectories, historical case trends, and the latest public-health headlines.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.75fr)_minmax(320px,1fr)]">
        <div className="space-y-6">
          <CountrySelector
            countries={countriesQuery.data?.countries ?? []}
            value={selectedCountry}
            onChange={setSelectedCountry}
            isLoading={countriesQuery.isLoading}
            isError={countriesQuery.isError}
            onRetry={() => void countriesQuery.refetch()}
          />

          <RiskOverview
            country={selectedCountry}
            data={countryRiskQuery.data}
            isLoading={countryRiskQuery.isLoading}
            errorMessage={countryRiskQuery.isError ? getErrorMessage(countryRiskQuery.error) : undefined}
            onRetry={() => void countryRiskQuery.refetch()}
          />

          <RiskBreakdown
            data={countryRiskQuery.data}
            isLoading={countryRiskQuery.isLoading}
            errorMessage={countryRiskQuery.isError ? getErrorMessage(countryRiskQuery.error) : undefined}
            onRetry={() => void countryRiskQuery.refetch()}
          />

          <ForecastCards
            data={countryRiskQuery.data}
            isLoading={countryRiskQuery.isLoading}
            errorMessage={countryRiskQuery.isError ? getErrorMessage(countryRiskQuery.error) : undefined}
            onRetry={() => void countryRiskQuery.refetch()}
          />

          <TrendChart
            data={trendsQuery.data}
            isLoading={trendsQuery.isLoading}
            errorMessage={trendsQuery.isError ? getErrorMessage(trendsQuery.error) : undefined}
            onRetry={() => void trendsQuery.refetch()}
          />
        </div>

        <NewsBlock
          country={selectedCountry}
          data={newsQuery.data}
          isLoading={newsQuery.isLoading}
          errorMessage={newsQuery.isError ? getErrorMessage(newsQuery.error) : undefined}
          onRetry={() => void newsQuery.refetch()}
        />
      </div>
    </div>
  );
}
