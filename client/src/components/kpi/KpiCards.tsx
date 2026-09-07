import { BarChart3, FileText, Gauge, Globe2, Hash, Sparkles } from "lucide-react";
import { useDashboardSummary } from "../../hooks/useDashboard";
import { formatNumber, formatInt } from "../../utils/format";

const cards = [
  { key: "totalRecords", label: "Total insights", icon: FileText },
  { key: "averageIntensity", label: "Avg intensity", icon: Gauge },
  { key: "averageLikelihood", label: "Avg likelihood", icon: Sparkles },
  { key: "averageRelevance", label: "Avg relevance", icon: BarChart3 },
  { key: "countriesCount", label: "Countries", icon: Globe2 },
  { key: "topicsCount", label: "Topics", icon: Hash },
] as const;

export function KpiCards() {
  const { data, isLoading, isError, error } = useDashboardSummary();

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
        KPI data failed to load: {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((card) => {
        const Icon = card.icon;
        let display = "—";
        if (data) {
          const raw = data[card.key];
          display = card.key.startsWith("average") ? formatNumber(raw) : formatInt(raw);
        }
        return (
          <article
            key={card.key}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/80"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {card.label}
              </p>
              <Icon className="h-4 w-4 text-teal-700 dark:text-teal-400" aria-hidden />
            </div>
            <p className="mt-3 text-2xl font-semibold tabular-nums text-slate-900 dark:text-white">
              {isLoading ? <span className="inline-block h-7 w-16 animate-pulse rounded bg-slate-200 dark:bg-slate-700" /> : display}
            </p>
          </article>
        );
      })}
    </div>
  );
}
