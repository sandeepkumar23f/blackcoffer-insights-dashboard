import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { emptyFilters, type DashboardFilters } from "../types/api";
import { activeFilterCount } from "../utils/format";

type FilterContextValue = {
  filters: DashboardFilters;
  setFilters: (next: DashboardFilters) => void;
  update: <K extends keyof DashboardFilters>(key: K, value: DashboardFilters[K]) => void;
  clear: () => void;
  activeCount: number;
};

const FilterContext = createContext<FilterContextValue | null>(null);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<DashboardFilters>(emptyFilters);

  const update = useCallback(<K extends keyof DashboardFilters>(key: K, value: DashboardFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const clear = useCallback(() => setFilters(emptyFilters()), []);

  const value = useMemo(
    () => ({
      filters,
      setFilters,
      update,
      clear,
      activeCount: activeFilterCount(filters),
    }),
    [filters, update, clear],
  );

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
}

export function useFilterState() {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error("useFilterState must be used within FilterProvider");
  return ctx;
}
