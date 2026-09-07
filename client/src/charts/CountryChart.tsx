import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, ChartState } from "../components/ui/Card";
import { useCountryData } from "../hooks/useDashboard";
import { formatInt, formatNumber } from "../utils/format";
import { useTheme } from "../context/ThemeContext";
import { useFilterState } from "../context/FilterContext";

export function CountryChart() {
  const { data, isLoading, isError, error } = useCountryData();
  const { theme } = useTheme();
  const axis = theme === "dark" ? "#94a3b8" : "#64748b";
  const { update } = useFilterState();
  const rows = (data ?? []).map((d) => ({ ...d, name: d.country ?? "—" }));

  return (
    <Card
      title="Countries"
      description="Ranked bar chart (country populated on 350 of 1,000 records). Mapping omitted to avoid unreliable geocoding."
    >
      <ChartState isLoading={isLoading} isError={isError} error={error} isEmpty={!rows.length}>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rows} layout="vertical" margin={{ top: 4, right: 12, left: 8, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tick={{ fill: axis, fontSize: 11 }} />
              <YAxis type="category" dataKey="name" width={120} tick={{ fill: axis, fontSize: 11 }} />
              <Tooltip
                formatter={(value, name) =>
                  name === "count" ? [formatInt(Number(value)), "Records"] : [formatNumber(Number(value)), String(name)]
                }
              />
              <Bar
                dataKey="count"
                fill="#0f766e"
                radius={[0, 4, 4, 0]}
                cursor="pointer"
                onClick={(d) => {
                  const country = (d as { country?: string }).country;
                  if (country) update("country", [country]);
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartState>
    </Card>
  );
}
