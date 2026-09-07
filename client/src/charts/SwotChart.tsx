import { Card, ChartState, UnavailableState } from "../components/ui/Card";
import { useSwotData } from "../hooks/useDashboard";

export function SwotChart() {
  const { data, isLoading, isError, error } = useSwotData();
  return (
    <Card title="SWOT" description="Not inferred from PESTLE or other fields.">
      <ChartState isLoading={isLoading} isError={isError} error={error} isEmpty={false}>
        <UnavailableState message={data?.message ?? "SWOT data unavailable in supplied dataset"} />
      </ChartState>
    </Card>
  );
}
