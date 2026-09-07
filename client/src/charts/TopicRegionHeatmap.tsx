import { Card, ChartState } from "../components/ui/Card";
import { useHeatmap } from "../hooks/useDashboard";
import { formatInt, formatNumber } from "../utils/format";

function intensityColor(value: number | null, dark: boolean): string {
  if (value === null || Number.isNaN(value)) return dark ? "#1e293b" : "#f1f5f9";
  const t = Math.min(1, Math.max(0, value / 40));
  const start = dark ? [15, 23, 42] : [240, 253, 250];
  const end = [13, 148, 136];
  const mix = start.map((c, i) => Math.round(c + (end[i] - c) * t));
  return `rgb(${mix.join(",")})`;
}

export function TopicRegionHeatmap() {
  const { data, isLoading, isError, error } = useHeatmap();
  const dark = document.documentElement.classList.contains("dark");

  return (
    <Card
      title="Topic × region intensity"
      description="Cell color is average intensity. Empty combinations are omitted from the underlying aggregation."
    >
      <ChartState
        isLoading={isLoading}
        isError={isError}
        error={error}
        isEmpty={!data?.cells.length}
        emptyMessage="No overlapping topic/region combinations for the current filters."
      >
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-xs">
            <caption className="sr-only">Average intensity by topic and region</caption>
            <thead>
              <tr>
                <th className="sticky left-0 z-10 bg-white px-2 py-2 text-left font-medium dark:bg-slate-900">Topic</th>
                {data?.regions.map((region) => (
                  <th key={region} className="min-w-[88px] px-1 py-2 text-center font-medium text-slate-600 dark:text-slate-300">
                    {region}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data?.topics.map((topic) => (
                <tr key={topic}>
                  <th className="sticky left-0 z-10 bg-white px-2 py-1 text-left font-medium dark:bg-slate-900">{topic}</th>
                  {data.regions.map((region) => {
                    const cell = data.cells.find((c) => c.topic === topic && c.region === region);
                    return (
                      <td
                        key={region}
                        className="px-1 py-1 text-center"
                        title={
                          cell
                            ? `${topic} × ${region}: ${formatInt(cell.count)} records, intensity ${formatNumber(cell.avgIntensity)}, relevance ${formatNumber(cell.avgRelevance)}`
                            : `${topic} × ${region}: no records`
                        }
                      >
                        <span
                          className="block rounded px-1 py-2 tabular-nums text-slate-900 dark:text-slate-100"
                          style={{ background: intensityColor(cell?.avgIntensity ?? null, dark) }}
                        >
                          {cell ? formatNumber(cell.avgIntensity, 0) : "—"}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartState>
    </Card>
  );
}
