import { Card, ChartState, UnavailableState } from "../components/ui/Card";
import { useCityData } from "../hooks/useDashboard";

export function CityChart() {
  const { data, isLoading, isError, error } = useCityData();
  return (
    <Card title="Cities" description="Required assignment dimension — only shown if the dataset contains city values.">
      <ChartState
        isLoading={isLoading}
        isError={isError}
        error={error}
        isEmpty={false}
      >
        <UnavailableState message={data?.message ?? "City data unavailable"} />
      </ChartState>
    </Card>
  );
}
