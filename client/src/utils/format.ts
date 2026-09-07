import type { DashboardFilters } from "../types/api";

export function formatNumber(value: number | null | undefined, digits = 1): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  return Number(value).toLocaleString(undefined, {
    maximumFractionDigits: digits,
    minimumFractionDigits: Number.isInteger(value) ? 0 : Math.min(digits, 1),
  });
}

export function formatInt(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  return Math.round(value).toLocaleString();
}

export function displayText(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === "") return "—";
  return String(value);
}

export function filtersToQuery(filters: DashboardFilters, extra?: Record<string, string | number>): string {
  const params = new URLSearchParams();
  const appendList = (key: string, values: string[]) => {
    if (values.length) params.set(key, values.join(","));
  };
  appendList("startYear", filters.startYear);
  appendList("endYear", filters.endYear);
  appendList("topics", filters.topics);
  appendList("sector", filters.sector);
  appendList("region", filters.region);
  appendList("pestle", filters.pestle);
  appendList("source", filters.source);
  appendList("swot", filters.swot);
  appendList("country", filters.country);
  appendList("city", filters.city);
  if (filters.search.trim()) params.set("search", filters.search.trim());
  if (extra) {
    for (const [k, v] of Object.entries(extra)) {
      params.set(k, String(v));
    }
  }
  return params.toString();
}

export function activeFilterCount(filters: DashboardFilters): number {
  return (
    [
      filters.startYear,
      filters.endYear,
      filters.topics,
      filters.sector,
      filters.region,
      filters.pestle,
      filters.source,
      filters.swot,
      filters.country,
      filters.city,
    ].filter((arr) => arr.length > 0).length + (filters.search.trim() ? 1 : 0)
  );
}

export const CHART_COLORS = [
  "#0f766e",
  "#4f46e5",
  "#d97706",
  "#dc2626",
  "#7c3aed",
  "#0891b2",
  "#65a30d",
  "#ea580c",
  "#db2777",
  "#2563eb",
];
