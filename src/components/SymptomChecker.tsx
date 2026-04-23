import { useEffect, useState, type FormEvent } from "react";

import type { UserRiskRequest, UserRiskResponse } from "../api/risk";
import { useCountries } from "../hooks/useCountries";
import { useUserRisk } from "../hooks/useUserRisk";
import { getTodayISO } from "../utils/formatDate";

const symptomFields: Array<{ key: keyof UserRiskRequest; label: string }> = [
  { key: "fever", label: "Fever" },
  { key: "cough", label: "Cough" },
  { key: "fatigue", label: "Fatigue" },
  { key: "breathing_issues", label: "Breathing issues" },
  { key: "headache", label: "Headache" },
  { key: "body_aches", label: "Body aches" },
];

const defaultFormState: UserRiskRequest = {
  country: "Kazakhstan",
  date: getTodayISO(),
  fever: 0,
  cough: 0,
  fatigue: 0,
  breathing_issues: 0,
  headache: 0,
  body_aches: 0,
};

interface SymptomCheckerProps {
  onResult: (result: UserRiskResponse, values: UserRiskRequest) => void;
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "We couldn't complete the risk check. Try again.";
}

export function SymptomChecker({ onResult }: SymptomCheckerProps) {
  const [formValues, setFormValues] = useState<UserRiskRequest>(defaultFormState);
  const countriesQuery = useCountries();
  const userRiskMutation = useUserRisk();

  useEffect(() => {
    const countries = countriesQuery.data?.countries;

    if (!countries || countries.length === 0) {
      return;
    }

    const nextCountry = countries.includes(formValues.country) ? formValues.country : countries[0];

    if (nextCountry !== formValues.country) {
      setFormValues((currentValues) => ({
        ...currentValues,
        country: nextCountry,
      }));
    }
  }, [countriesQuery.data?.countries, formValues.country]);

  function updateField(field: keyof UserRiskRequest, value: number | string) {
    setFormValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const result = await userRiskMutation.mutateAsync(formValues);
      onResult(result, formValues);
    } catch {
      // Mutation state drives the inline error UI.
    }
  }

  return (
    <section className="panel p-6 sm:p-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Symptom checker</h2>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Share how you feel today to estimate your personal risk and get tailored recommendations.
        </p>
      </div>

      <form className="mt-8 space-y-8" onSubmit={handleSubmit}>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="country" className="text-sm font-medium text-foreground">
              Country
            </label>
            <select
              id="country"
              value={formValues.country}
              onChange={(event) => updateField("country", event.target.value)}
              className="min-h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60"
              disabled={countriesQuery.isLoading || countriesQuery.isError}
            >
              {countriesQuery.isLoading ? <option>Loading countries...</option> : null}
              {countriesQuery.isError ? <option>Unable to load countries</option> : null}
              {countriesQuery.data?.countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
            {countriesQuery.isError ? (
              <p className="text-xs text-red-500">Country list is unavailable. Refresh and try again.</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label htmlFor="check-date" className="text-sm font-medium text-foreground">
              Check date
            </label>
            <input
              id="check-date"
              type="date"
              value={formValues.date}
              onChange={(event) => updateField("date", event.target.value)}
              className="min-h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            />
          </div>
        </div>

        <fieldset className="space-y-5">
          <legend className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Symptom severity
          </legend>

          <div className="grid gap-5">
            {symptomFields.map((field) => {
              const fieldValue = Number(formValues[field.key]);
              const inputId = `symptom-${field.key}`;

              return (
                <div key={field.key} className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <label htmlFor={inputId} className="text-sm font-medium text-foreground">
                      {field.label}
                    </label>
                    <span className="rounded-full bg-muted px-3 py-1 text-sm font-semibold text-foreground">
                      {fieldValue}
                    </span>
                  </div>

                  <input
                    id={inputId}
                    type="range"
                    min="0"
                    max="10"
                    step="1"
                    value={fieldValue}
                    onChange={(event) => updateField(field.key, Number(event.target.value))}
                    className="h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-primary"
                  />
                </div>
              );
            })}
          </div>
        </fieldset>

        {userRiskMutation.isError ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4">
            <p className="text-sm font-medium text-red-500">Couldn&apos;t check your risk</p>
            <p className="mt-1 text-sm text-muted-foreground">{getErrorMessage(userRiskMutation.error)}</p>
          </div>
        ) : null}

        <button
          type="submit"
          disabled={userRiskMutation.isPending || countriesQuery.isLoading || countriesQuery.isError}
          aria-busy={userRiskMutation.isPending}
          className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {userRiskMutation.isPending ? "Checking risk..." : "Check My Risk"}
        </button>
      </form>
    </section>
  );
}
