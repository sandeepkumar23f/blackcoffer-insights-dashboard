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
import { useTopicData } from "../hooks/useDashboard";
import { formatInt, formatNumber } from "../utils/format";
import { useTheme } from "../context/ThemeContext";
import { useFilterState } from "../context/FilterContext";

export function TopicChart() {
  const { data, isLoading, isError, error } = useTopicData();
  const { theme } = useTheme();
  const axis = theme === "dark" ? "#94a3b8" : "#64748b";
  const { update } = useFilterState();
  const rows = (data ?? []).map((d) => ({ ...d, name: d.topic ?? "—" }));

  return (
    <Card title="Top topics" description="Ranked by record count. Click a bar to filter the dashboard.">
      <ChartState isLoading={isLoading} isError={isError} error={error} isEmpty={!rows.length}>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rows} layout="vertical" margin={{ top: 4, right: 12, left: 8, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tick={{ fill: axis, fontSize: 11 }} />
              <YAxis type="category" dataKey="name" width={92} tick={{ fill: axis, fontSize: 11 }} />
              <Tooltip
                formatter={(value, name) => {
                  if (name === "count") return [formatInt(Number(value)), "Records"];
                  return [formatNumber(Number(value)), String(name)];
                }}
                labelFormatter={(label) => String(label)}
              />
              <Bar
                dataKey="count"
                fill="#4f46e5"
                radius={[0, 4, 4, 0]}
                cursor="pointer"
                onClick={(d) => {
                  const topic = (d as { topic?: string }).topic;
                  if (topic) update("topics", [topic]);
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartState>
    </Card>
  );
}
