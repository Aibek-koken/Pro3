import type { NewsResponse } from "../api/news";
import { formatLongDate } from "../utils/formatDate";
import { LoadingSkeleton } from "./LoadingSkeleton";

interface NewsBlockProps {
  country: string;
  data?: NewsResponse;
  isLoading: boolean;
  errorMessage?: string;
  onRetry: () => void;
}

export function NewsBlock({ country, data, isLoading, errorMessage, onRetry }: NewsBlockProps) {
  return (
    <aside className="panel h-fit p-6 sm:p-8 lg:sticky lg:top-24">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight">Latest Health News — {country}</h2>
        <p className="text-sm text-muted-foreground">Regional outbreak coverage and public-health updates from the backend news feed.</p>
      </div>

      {isLoading ? (
        <div className="mt-6 space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="rounded-3xl border border-border/70 bg-background/70 p-5">
              <LoadingSkeleton className="h-4 w-20" />
              <LoadingSkeleton className="mt-4 h-5 w-full" />
              <LoadingSkeleton className="mt-2 h-5 w-4/5" />
              <LoadingSkeleton className="mt-4 h-4 w-28" />
            </div>
          ))}
        </div>
      ) : errorMessage ? (
        <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/5 p-4">
          <p className="text-sm font-medium text-red-500">Couldn&apos;t load the latest news</p>
          <p className="mt-1 text-sm text-muted-foreground">{errorMessage}</p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-4 inline-flex min-h-10 items-center rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Retry
          </button>
        </div>
      ) : data && data.articles.length > 0 ? (
        <div className="mt-6 space-y-4">
          {data.source_type === "static" ? (
            <p className="rounded-2xl border border-border/70 bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
              Showing WHO global alerts while live RSS coverage is unavailable.
            </p>
          ) : null}

          {data.articles.slice(0, 5).map((article) => (
            <a
              key={`${article.url}-${article.published_at}`}
              href={article.url}
              target="_blank"
              rel="noreferrer"
              className="block rounded-3xl border border-border/70 bg-background/70 p-5 transition-colors hover:border-primary/30 hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                {article.source}
              </span>
              <h3 className="mt-4 text-base font-semibold leading-6 text-foreground">{article.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{formatLongDate(article.published_at)}</p>
            </a>
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-border px-5 py-10 text-center">
          <p className="text-sm font-medium text-foreground">No recent health headlines</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try another country or come back later for fresh reporting.
          </p>
        </div>
      )}
    </aside>
  );
}
