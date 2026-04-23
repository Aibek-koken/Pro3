import { useDeferredValue, useEffect, useState } from "react";

import { LoadingSkeleton } from "./LoadingSkeleton";

interface CountrySelectorProps {
  countries: string[];
  value: string;
  onChange: (country: string) => void;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

export function CountrySelector({
  countries,
  value,
  onChange,
  isLoading,
  isError,
  onRetry,
}: CountrySelectorProps) {
  const [query, setQuery] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  const filteredCountries = countries
    .filter((country) => country.toLowerCase().includes(deferredQuery.trim().toLowerCase()))
    .slice(0, 8);

  return (
    <section className="panel p-6 sm:p-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Country selector</h2>
        <p className="text-sm text-muted-foreground">
          Search the surveillance feed and switch between countries without leaving the page.
        </p>
      </div>

      <div className="mt-6 space-y-3">
        <label htmlFor="country-search" className="text-sm font-medium text-foreground">
          Country
        </label>

        {isLoading ? (
          <div className="space-y-3">
            <LoadingSkeleton className="h-12 w-full rounded-2xl" />
            <LoadingSkeleton className="h-40 w-full rounded-3xl" />
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4">
            <p className="text-sm font-medium text-red-500">Couldn&apos;t load countries</p>
            <p className="mt-1 text-sm text-muted-foreground">
              The list is unavailable right now. Try again to refresh the selector.
            </p>
            <button
              type="button"
              onClick={onRetry}
              className="mt-4 inline-flex min-h-10 items-center rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <input
              id="country-search"
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              onBlur={() => {
                window.setTimeout(() => {
                  setIsOpen(false);
                  setQuery(value);
                }, 120);
              }}
              autoComplete="off"
              spellCheck={false}
              placeholder="Search a country"
              className="min-h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            />

            <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
              <span>{countries.length} countries available</span>
              <span>Showing {filteredCountries.length}</span>
            </div>

            <div className="rounded-3xl border border-border/70 bg-background/70 p-2">
              {filteredCountries.length > 0 ? (
                <div className="max-h-64 space-y-1 overflow-auto pr-1">
                  {filteredCountries.map((country) => {
                    const isSelected = country === value;

                    return (
                      <button
                        key={country}
                        type="button"
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => {
                          onChange(country);
                          setQuery(country);
                          setIsOpen(false);
                        }}
                        className={`flex min-h-11 w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                          isSelected
                            ? "bg-primary/10 text-primary"
                            : "text-foreground hover:bg-muted"
                        } ${!isOpen && !isSelected ? "hidden" : ""}`}
                      >
                        <span>{country}</span>
                        {isSelected ? (
                          <span className="text-xs font-semibold uppercase tracking-[0.2em]">Active</span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-border px-4 py-8 text-center">
                  <p className="text-sm font-medium text-foreground">No countries match your search</p>
                  <p className="mt-1 text-sm text-muted-foreground">Try a broader search term or clear the field.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
