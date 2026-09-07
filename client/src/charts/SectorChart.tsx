import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, ChartState } from "../components/ui/Card";
import { useSectorData } from "../hooks/useDashboard";
import { formatNumber } from "../utils/format";
import { useTheme } from "../context/ThemeContext";

export function SectorChart() {
  const { data, isLoading, isError, error } = useSectorData();
  const { theme } = useTheme();
  const axis = theme === "dark" ? "#94a3b8" : "#64748b";
  const rows = (data ?? []).map((d) => ({ ...d, name: d.sector ?? "—" }));

  return (
    <Card title="Sectors" description="Count plus average intensity, likelihood, and relevance.">
      <ChartState isLoading={isLoading} isError={isError} error={error} isEmpty={!rows.length}>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rows} margin={{ top: 8, right: 8, left: 0, bottom: 48 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" interval={0} angle={-35} textAnchor="end" tick={{ fill: axis, fontSize: 10 }} />
              <YAxis yAxisId="left" tick={{ fill: axis, fontSize: 11 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: axis, fontSize: 11 }} />
              <Tooltip formatter={(v, n) => [n === "count" ? v : formatNumber(Number(v)), String(n)]} />
              <Legend />
              <Bar yAxisId="left" dataKey="count" fill="#64748b" name="Records" />
              <Bar yAxisId="right" dataKey="avgIntensity" fill="#0f766e" name="Avg intensity" />
              <Bar yAxisId="right" dataKey="avgLikelihood" fill="#4f46e5" name="Avg likelihood" />
              <Bar yAxisId="right" dataKey="avgRelevance" fill="#d97706" name="Avg relevance" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartState>
    </Card>
  );
}
