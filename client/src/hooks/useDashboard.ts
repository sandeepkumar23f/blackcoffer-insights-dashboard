import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";
import { useFilterState } from "../context/FilterContext";

export function useFilterOptions() {
  return useQuery({ queryKey: ["filters"], queryFn: api.filters });
}

export function useDashboardSummary() {
  const { filters } = useFilterState();
  return useQuery({
    queryKey: ["summary", filters],
    queryFn: () => api.summary(filters),
  });
}

export function useYearData(yearField = "coalesced") {
  const { filters } = useFilterState();
  return useQuery({
    queryKey: ["by-year", filters, yearField],
    queryFn: () => api.byYear(filters, yearField),
  });
}

export function useTopicData() {
  const { filters } = useFilterState();
  return useQuery({ queryKey: ["by-topic", filters], queryFn: () => api.byTopic(filters) });
}

export function useCountryData() {
  const { filters } = useFilterState();
  return useQuery({ queryKey: ["by-country", filters], queryFn: () => api.byCountry(filters) });
}

export function useRegionData() {
  const { filters } = useFilterState();
  return useQuery({ queryKey: ["by-region", filters], queryFn: () => api.byRegion(filters) });
}

export function useSectorData() {
  const { filters } = useFilterState();
  return useQuery({ queryKey: ["by-sector", filters], queryFn: () => api.bySector(filters) });
}

export function usePestleData() {
  const { filters } = useFilterState();
  return useQuery({ queryKey: ["by-pestle", filters], queryFn: () => api.byPestle(filters) });
}

export function useSourceData() {
  const { filters } = useFilterState();
  return useQuery({ queryKey: ["by-source", filters], queryFn: () => api.bySource(filters) });
}

export function useCityData() {
  const { filters } = useFilterState();
  return useQuery({ queryKey: ["by-city", filters], queryFn: () => api.byCity(filters) });
}

export function useSwotData() {
  const { filters } = useFilterState();
  return useQuery({ queryKey: ["by-swot", filters], queryFn: () => api.bySwot(filters) });
}

export function useRiskMatrix() {
  const { filters } = useFilterState();
  return useQuery({ queryKey: ["risk-matrix", filters], queryFn: () => api.riskMatrix(filters) });
}

export function useHeatmap() {
  const { filters } = useFilterState();
  return useQuery({ queryKey: ["heatmap", filters], queryFn: () => api.heatmap(filters) });
}

export function useInsights(
  page: number,
  limit: number,
  sortBy: string,
  sortOrder: "asc" | "desc",
) {
  const { filters } = useFilterState();
  return useQuery({
    queryKey: ["insights", filters, page, limit, sortBy, sortOrder],
    queryFn: () => api.insights(filters, page, limit, sortBy, sortOrder),
  });
}
