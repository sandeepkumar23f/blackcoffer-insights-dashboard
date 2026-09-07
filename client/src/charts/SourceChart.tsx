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
import { useSourceData } from "../hooks/useDashboard";
import { formatInt, formatNumber } from "../utils/format";
import { useTheme } from "../context/ThemeContext";

export function SourceChart() {
  const { data, isLoading, isError, error } = useSourceData();
  const { theme } = useTheme();
  const axis = theme === "dark" ? "#94a3b8" : "#64748b";
  const rows = (data ?? []).map((d) => ({ ...d, name: d.source ?? "—" }));

  return (
    <Card title="Top sources" description="403 unique sources exist; this chart shows the most frequent.">
      <ChartState isLoading={isLoading} isError={isError} error={error} isEmpty={!rows.length}>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rows} layout="vertical" margin={{ top: 4, right: 12, left: 8, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tick={{ fill: axis, fontSize: 11 }} />
              <YAxis type="category" dataKey="name" width={140} tick={{ fill: axis, fontSize: 10 }} />
              <Tooltip
                formatter={(value, name) =>
                  name === "count" ? [formatInt(Number(value)), "Records"] : [formatNumber(Number(value)), String(name)]
                }
              />
              <Bar dataKey="count" fill="#0891b2" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartState>
    </Card>
  );
}
