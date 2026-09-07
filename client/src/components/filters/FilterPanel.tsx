import { Search, X } from "lucide-react";
import { useFilterState } from "../../context/FilterContext";
import { useFilterOptions } from "../../hooks/useDashboard";
import { MultiSelect } from "./MultiSelect";

export function FilterPanel() {
  const { filters, update, clear, activeCount } = useFilterState();
  const { data, isLoading, isError, error } = useFilterOptions();

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Global filters</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Applied to every KPI, chart, and table. {activeCount} active.
          </p>
        </div>
        <button
          type="button"
          onClick={clear}
          disabled={activeCount === 0}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 enabled:hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:text-slate-200 dark:enabled:hover:bg-slate-800"
        >
          <X className="h-3.5 w-3.5" />
          Clear all
        </button>
      </div>

      {isError ? (
        <p className="text-sm text-red-600">{error instanceof Error ? error.message : "Failed to load filters"}</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <MultiSelect
            id="endYear"
            label="End year"
            options={(data?.endYears ?? []).map(String)}
            value={filters.endYear}
            onChange={(v) => update("endYear", v)}
          />
          <MultiSelect
            id="startYear"
            label="Start year"
            options={(data?.startYears ?? []).map(String)}
            value={filters.startYear}
            onChange={(v) => update("startYear", v)}
          />
          <MultiSelect
            id="topics"
            label="Topics"
            options={data?.topics ?? []}
            value={filters.topics}
            onChange={(v) => update("topics", v)}
          />
          <MultiSelect
            id="sector"
            label="Sector"
            options={data?.sectors ?? []}
            value={filters.sector}
            onChange={(v) => update("sector", v)}
          />
          <MultiSelect
            id="region"
            label="Region"
            options={data?.regions ?? []}
            value={filters.region}
            onChange={(v) => update("region", v)}
          />
          <MultiSelect
            id="pestle"
            label="PESTLE"
            options={data?.pestles ?? []}
            value={filters.pestle}
            onChange={(v) => update("pestle", v)}
          />
          <MultiSelect
            id="source"
            label="Source"
            options={data?.sources ?? []}
            value={filters.source}
            onChange={(v) => update("source", v)}
          />
          <MultiSelect
            id="country"
            label="Country"
            options={data?.countries ?? []}
            value={filters.country}
            onChange={(v) => update("country", v)}
          />
          <MultiSelect
            id="swot"
            label="SWOT"
            options={[]}
            value={filters.swot}
            onChange={(v) => update("swot", v)}
            disabled
            disabledReason={data?.swots.message ?? "SWOT data unavailable in supplied dataset"}
          />
          <MultiSelect
            id="city"
            label="City"
            options={[]}
            value={filters.city}
            onChange={(v) => update("city", v)}
            disabled
            disabledReason={data?.cities.message ?? "City data unavailable"}
          />
          <div className="sm:col-span-2">
            <label htmlFor="search" className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">
              Search
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                id="search"
                value={filters.search}
                onChange={(e) => update("search", e.target.value)}
                placeholder="Title, insight, topic, country…"
                className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-teal-600 dark:border-slate-700 dark:bg-slate-950"
              />
            </div>
          </div>
        </div>
      )}
      {isLoading ? <p className="mt-3 text-xs text-slate-500">Loading filter options…</p> : null}
    </section>
  );
}
