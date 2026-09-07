import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, ChartState } from "../components/ui/Card";
import { useRegionData } from "../hooks/useDashboard";
import { CHART_COLORS, formatInt, formatNumber } from "../utils/format";
import { useFilterState } from "../context/FilterContext";

export function RegionChart() {
  const { data, isLoading, isError, error } = useRegionData();
  const { update } = useFilterState();
  const rows = (data ?? []).map((d) => ({ ...d, name: d.region ?? "—" }));

  return (
    <Card title="Regions" description="Distribution of insights with a populated region.">
      <ChartState isLoading={isLoading} isError={isError} error={error} isEmpty={!rows.length}>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={rows}
                dataKey="count"
                nameKey="name"
                innerRadius={58}
                outerRadius={96}
                paddingAngle={1}
                cursor="pointer"
                onClick={(d) => {
                  const region = (d as { region?: string }).region;
                  if (region) update("region", [region]);
                }}
              >
                {rows.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, _n, item) => {
                  const row = item.payload as (typeof rows)[number];
                  return [
                    `${formatInt(Number(value))} records · intensity ${formatNumber(row.avgIntensity)}`,
                    row.name,
                  ];
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </ChartState>
    </Card>
  );
}
