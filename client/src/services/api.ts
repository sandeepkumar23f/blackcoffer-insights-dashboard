import type {
  DashboardFilters,
  DimensionRow,
  FilterOptions,
  HeatmapPayload,
  InsightsPage,
  RiskPoint,
  Summary,
  UnavailableSet,
  YearPoint,
  Insight,
} from "../types/api";
import { filtersToQuery } from "../utils/format";

async function request<T>(path: string): Promise<T> {
  const res = await fetch(path);
  const json = (await res.json()) as { success: boolean; data: T; message?: string };
  if (!res.ok || json.success === false) {
    throw new Error(json.message || `Request failed: ${res.status}`);
  }
  return json.data;
}

export const api = {
  health: () => request<{ status: string }>("/api/health"),
  filters: () => request<FilterOptions>("/api/filters"),
  summary: (filters: DashboardFilters) =>
    request<Summary>(`/api/dashboard/summary?${filtersToQuery(filters)}`),
  byYear: (filters: DashboardFilters, yearField = "coalesced") =>
    request<YearPoint[]>(`/api/dashboard/by-year?${filtersToQuery(filters, { yearField })}`),
  byTopic: (filters: DashboardFilters) =>
    request<DimensionRow[]>(`/api/dashboard/by-topic?${filtersToQuery(filters, { limit: 15 })}`),
  byCountry: (filters: DashboardFilters) =>
    request<DimensionRow[]>(`/api/dashboard/by-country?${filtersToQuery(filters, { limit: 15 })}`),
  byRegion: (filters: DashboardFilters) =>
    request<DimensionRow[]>(`/api/dashboard/by-region?${filtersToQuery(filters, { limit: 20 })}`),
  bySector: (filters: DashboardFilters) =>
    request<DimensionRow[]>(`/api/dashboard/by-sector?${filtersToQuery(filters, { limit: 18 })}`),
  byPestle: (filters: DashboardFilters) =>
    request<DimensionRow[]>(`/api/dashboard/by-pestle?${filtersToQuery(filters)}`),
  bySource: (filters: DashboardFilters) =>
    request<DimensionRow[]>(`/api/dashboard/by-source?${filtersToQuery(filters, { limit: 12 })}`),
  byCity: (filters: DashboardFilters) =>
    request<UnavailableSet>(`/api/dashboard/by-city?${filtersToQuery(filters)}`),
  bySwot: (filters: DashboardFilters) =>
    request<UnavailableSet>(`/api/dashboard/by-swot?${filtersToQuery(filters)}`),
  riskMatrix: (filters: DashboardFilters) =>
    request<RiskPoint[]>(`/api/dashboard/risk-matrix?${filtersToQuery(filters)}`),
  heatmap: (filters: DashboardFilters) =>
    request<HeatmapPayload>(`/api/dashboard/topic-region-heatmap?${filtersToQuery(filters)}`),
  insights: (
    filters: DashboardFilters,
    page: number,
    limit: number,
    sortBy: string,
    sortOrder: "asc" | "desc",
  ) =>
    request<InsightsPage>(
      `/api/insights?${filtersToQuery(filters, { page, limit, sortBy, sortOrder })}`,
    ),
  insight: (id: string) => request<Insight>(`/api/insights/${id}`),
};
