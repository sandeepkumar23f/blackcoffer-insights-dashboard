import { useState } from "react";
import { Header } from "../components/layout/Header";
import { KpiCards } from "../components/kpi/KpiCards";
import { FilterPanel } from "../components/filters/FilterPanel";
import { YearChart } from "../charts/YearChart";
import { TopicChart } from "../charts/TopicChart";
import { CountryChart } from "../charts/CountryChart";
import { RegionChart } from "../charts/RegionChart";
import { SectorChart } from "../charts/SectorChart";
import { PestleChart } from "../charts/PestleChart";
import { SourceChart } from "../charts/SourceChart";
import { CityChart } from "../charts/CityChart";
import { SwotChart } from "../charts/SwotChart";
import { RiskMatrixChart } from "../charts/RiskMatrixChart";
import { TopicRegionHeatmap } from "../charts/TopicRegionHeatmap";
import { InsightsTable } from "../components/insights/InsightsTable";
import { InsightDrawer } from "../components/insights/InsightDrawer";
import type { Insight } from "../types/api";

export function DashboardPage() {
  const [selected, setSelected] = useState<Insight | null>(null);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      <Header />
      <main className="mx-auto max-w-[1440px] space-y-6 px-4 py-6 sm:px-6">
        <KpiCards />
        <FilterPanel />
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <YearChart />
          <TopicChart />
          <CountryChart />
          <RegionChart />
          <SectorChart />
          <PestleChart />
          <SourceChart />
          <CityChart />
        </div>
        <SwotChart />
        <RiskMatrixChart />
        <TopicRegionHeatmap />
        <InsightsTable onSelect={setSelected} />
      </main>
      <InsightDrawer insight={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
