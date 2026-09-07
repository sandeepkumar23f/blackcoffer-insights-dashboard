import { useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, ChartState } from "../components/ui/Card";
import { useYearData } from "../hooks/useDashboard";
import { formatNumber } from "../utils/format";
import { useTheme } from "../context/ThemeContext";

const metrics = [
  { id: "avgIntensity", label: "Intensity" },
  { id: "avgLikelihood", label: "Likelihood" },
  { id: "avgRelevance", label: "Relevance" },
] as const;

export function YearChart() {
  const [metric, setMetric] = useState<(typeof metrics)[number]["id"]>("avgIntensity");
  const [yearField, setYearField] = useState("coalesced");
  const { data, isLoading, isError, error } = useYearData(yearField);
  const { theme } = useTheme();
  const axis = theme === "dark" ? "#94a3b8" : "#64748b";

  return (
    <Card
      title="Trends over years"
      description="Uses years present in MongoDB (end year, else start year). Metric averages ignore missing values."
      action={
        <div className="flex flex-wrap gap-2">
          <label className="sr-only" htmlFor="yearField">
            Year field
          </label>
          <select
            id="yearField"
            value={yearField}
            onChange={(e) => setYearField(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-950"
          >
            <option value="coalesced">End year → start year</option>
            <option value="end_year">End year only</option>
            <option value="start_year">Start year only</option>
          </select>
          <div className="flex rounded-lg border border-slate-200 p-0.5 dark:border-slate-700">
            {metrics.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMetric(m.id)}
                className={`rounded-md px-2 py-1 text-xs ${
                  metric === m.id
                    ? "bg-teal-700 text-white"
                    : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      }
    >
      <ChartState isLoading={isLoading} isError={isError} error={error} isEmpty={!data?.length}>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" tick={{ fill: axis, fontSize: 12 }} />
              <YAxis tick={{ fill: axis, fontSize: 12 }} />
              <Tooltip
                formatter={(value, name) => [
                  formatNumber(typeof value === "number" ? value : null),
                  name === metric ? metrics.find((m) => m.id === metric)?.label : String(name),
                ]}
                labelFormatter={(label) => `Year ${label}`}
              />
              <Line type="monotone" dataKey={metric} stroke="#0f766e" strokeWidth={2} dot={{ r: 3 }} name={metric} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartState>
    </Card>
  );
}
