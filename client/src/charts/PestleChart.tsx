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
import { usePestleData } from "../hooks/useDashboard";
import { formatInt, formatNumber } from "../utils/format";
import { useTheme } from "../context/ThemeContext";
import { useFilterState } from "../context/FilterContext";

export function PestleChart() {
  const { data, isLoading, isError, error } = usePestleData();
  const { theme } = useTheme();
  const axis = theme === "dark" ? "#94a3b8" : "#64748b";
  const { update } = useFilterState();
  const rows = (data ?? []).map((d) => ({ ...d, name: d.pestle ?? "—" }));

  return (
    <Card
      title="PESTLE"
      description="Actual pestle labels in the dataset (includes Industries, Organization, Lifestyles, Healthcare)."
    >
      <ChartState isLoading={isLoading} isError={isError} error={error} isEmpty={!rows.length}>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rows} margin={{ top: 8, right: 8, left: 0, bottom: 24 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" interval={0} angle={-20} textAnchor="end" tick={{ fill: axis, fontSize: 11 }} />
              <YAxis tick={{ fill: axis, fontSize: 11 }} />
              <Tooltip
                formatter={(value, name) =>
                  name === "count" ? [formatInt(Number(value)), "Records"] : [formatNumber(Number(value)), String(name)]
                }
              />
              <Bar
                dataKey="count"
                fill="#7c3aed"
                radius={[4, 4, 0, 0]}
                cursor="pointer"
                onClick={(d) => {
                  const pestle = (d as { pestle?: string }).pestle;
                  if (pestle) update("pestle", [pestle]);
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartState>
    </Card>
  );
}
