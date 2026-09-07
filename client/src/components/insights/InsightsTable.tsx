import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { Card } from "../ui/Card";
import { useInsights } from "../../hooks/useDashboard";
import { useFilterState } from "../../context/FilterContext";
import { displayText, formatInt } from "../../utils/format";
import type { Insight } from "../../types/api";

const columns: { key: keyof Insight | "actions"; label: string; sort?: string }[] = [
  { key: "title", label: "Title", sort: "title" },
  { key: "topic", label: "Topic", sort: "topic" },
  { key: "sector", label: "Sector", sort: "sector" },
  { key: "country", label: "Country", sort: "country" },
  { key: "region", label: "Region", sort: "region" },
  { key: "start_year", label: "Start", sort: "start_year" },
  { key: "end_year", label: "End", sort: "end_year" },
  { key: "intensity", label: "Int.", sort: "intensity" },
  { key: "likelihood", label: "Like.", sort: "likelihood" },
  { key: "relevance", label: "Rel.", sort: "relevance" },
  { key: "pestle", label: "PESTLE", sort: "pestle" },
  { key: "source", label: "Source", sort: "source" },
  { key: "actions", label: "" },
];

export function InsightsTable({ onSelect }: { onSelect: (insight: Insight) => void }) {
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("intensity");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const { filters } = useFilterState();
  const { data, isLoading, isError, error } = useInsights(page, 12, sortBy, sortOrder);

  useEffect(() => {
    setPage(1);
  }, [filters]);

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
    setPage(1);
  };

  return (
    <Card
      title="Insight records"
      description="Paginated view of MongoDB documents matching the current filters. Click a row for full detail."
      action={
        <p className="text-xs text-slate-500">
          {data ? `${formatInt(data.total)} rows` : ""}
        </p>
      }
    >
      {isError ? (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {error instanceof Error ? error.message : "Failed to load insights"}
        </p>
      ) : isLoading ? (
        <div className="flex h-40 items-center justify-center" role="status">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-teal-600 border-t-transparent" />
        </div>
      ) : !data?.items.length ? (
        <p className="rounded-xl border border-dashed border-slate-200 px-4 py-10 text-center text-sm text-slate-500 dark:border-slate-700">
          No insights match the current filters.
        </p>
      ) : (
        <>
          <div className="hidden overflow-x-auto md:block">
            <table className="min-w-[960px] w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-800">
                  {columns.map((col) => (
                    <th key={col.key} className="px-2 py-2 font-medium">
                      {col.sort ? (
                        <button type="button" className="hover:text-teal-700" onClick={() => toggleSort(col.sort!)}>
                          {col.label}
                          {sortBy === col.sort ? (sortOrder === "asc" ? " ↑" : " ↓") : ""}
                        </button>
                      ) : (
                        col.label
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.items.map((row) => (
                  <tr
                    key={row._id}
                    className="cursor-pointer border-b border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/60"
                    onClick={() => onSelect(row)}
                  >
                    <td className="max-w-[220px] truncate px-2 py-2 font-medium">{displayText(row.title)}</td>
                    <td className="px-2 py-2">{displayText(row.topic)}</td>
                    <td className="px-2 py-2">{displayText(row.sector)}</td>
                    <td className="px-2 py-2">{displayText(row.country)}</td>
                    <td className="px-2 py-2">{displayText(row.region)}</td>
                    <td className="px-2 py-2">{displayText(row.start_year)}</td>
                    <td className="px-2 py-2">{displayText(row.end_year)}</td>
                    <td className="px-2 py-2">{displayText(row.intensity)}</td>
                    <td className="px-2 py-2">{displayText(row.likelihood)}</td>
                    <td className="px-2 py-2">{displayText(row.relevance)}</td>
                    <td className="px-2 py-2">{displayText(row.pestle)}</td>
                    <td className="max-w-[120px] truncate px-2 py-2">{displayText(row.source)}</td>
                    <td className="px-2 py-2">
                      {row.url ? (
                        <a
                          href={row.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-teal-700 dark:text-teal-400"
                          onClick={(e) => e.stopPropagation()}
                          aria-label="Open source URL"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="space-y-3 md:hidden">
            {data.items.map((row) => (
              <li key={row._id}>
                <button
                  type="button"
                  onClick={() => onSelect(row)}
                  className="w-full rounded-xl border border-slate-200 p-3 text-left dark:border-slate-800"
                >
                  <p className="text-sm font-medium">{displayText(row.title)}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {displayText(row.topic)} · {displayText(row.country)} · intensity {displayText(row.intensity)}
                  </p>
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex items-center justify-between text-sm">
            <p className="text-slate-500">
              Page {data.page} of {data.totalPages}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-lg border border-slate-200 p-2 disabled:opacity-40 dark:border-slate-700"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                disabled={page >= data.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg border border-slate-200 p-2 disabled:opacity-40 dark:border-slate-700"
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </Card>
  );
}
