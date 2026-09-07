import {
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Card, ChartState } from "../components/ui/Card";
import { useRiskMatrix } from "../hooks/useDashboard";
import { formatInt, formatNumber } from "../utils/format";
import { useTheme } from "../context/ThemeContext";

export function RiskMatrix() {
  const { data, isLoading, isError, error } = useRiskMatrix();
  const { theme } = useTheme();
  const axis = theme === "dark" ? "#94a3b8" : "#64748b";

  return (
    <Card
      title="Strategic risk matrix"
      description="X = average likelihood, Y = average intensity, bubble = average relevance (by topic). Quadrant lines are visual guides only — the dataset has no risk category field."
    >
      <ChartState isLoading={isLoading} isError={isError} error={error} isEmpty={!data?.length}>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 12, right: 16, left: 8, bottom: 12 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                dataKey="likelihood"
                name="Likelihood"
                domain={[0.8, 4.2]}
                tick={{ fill: axis, fontSize: 11 }}
                label={{ value: "Likelihood", position: "insideBottom", offset: -4, fill: axis }}
              />
              <YAxis
                type="number"
                dataKey="intensity"
                name="Intensity"
                tick={{ fill: axis, fontSize: 11 }}
                label={{ value: "Intensity", angle: -90, position: "insideLeft", fill: axis }}
              />
              <ZAxis type="number" dataKey="relevance" range={[60, 280]} name="Relevance" />
              <ReferenceLine x={2.5} stroke="#94a3b8" strokeDasharray="4 4" />
              <ReferenceLine y={20} stroke="#94a3b8" strokeDasharray="4 4" />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                content={({ payload }) => {
                  const row = payload?.[0]?.payload as
                    | { topic: string; count: number; likelihood: number; intensity: number; relevance: number | null }
                    | undefined;
                  if (!row) return null;
                  return (
                    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow dark:border-slate-700 dark:bg-slate-900">
                      <p className="font-semibold">{row.topic}</p>
                      <p>Records: {formatInt(row.count)}</p>
                      <p>Likelihood: {formatNumber(row.likelihood)}</p>
                      <p>Intensity: {formatNumber(row.intensity)}</p>
                      <p>Relevance: {formatNumber(row.relevance)}</p>
                    </div>
                  );
                }}
              />
              <Scatter data={data} fill="#0f766e" fillOpacity={0.75} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </ChartState>
    </Card>
  );
}
