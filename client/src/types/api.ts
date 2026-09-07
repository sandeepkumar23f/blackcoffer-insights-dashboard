export type Insight = {
  _id: string;
  fingerprint: string;
  end_year: number | null;
  intensity: number | null;
  sector: string | null;
  topic: string | null;
  insight: string | null;
  url: string | null;
  region: string | null;
  start_year: number | null;
  impact: number | null;
  added: string | null;
  published: string | null;
  country: string | null;
  relevance: number | null;
  pestle: string | null;
  source: string | null;
  title: string | null;
  likelihood: number | null;
};

export type DashboardFilters = {
  startYear: string[];
  endYear: string[];
  topics: string[];
  sector: string[];
  region: string[];
  pestle: string[];
  source: string[];
  swot: string[];
  country: string[];
  city: string[];
  search: string;
};

export const emptyFilters = (): DashboardFilters => ({
  startYear: [],
  endYear: [],
  topics: [],
  sector: [],
  region: [],
  pestle: [],
  source: [],
  swot: [],
  country: [],
  city: [],
  search: "",
});

export type Summary = {
  totalRecords: number;
  averageIntensity: number | null;
  averageLikelihood: number | null;
  averageRelevance: number | null;
  averageImpact: number | null;
  countriesCount: number;
  topicsCount: number;
};

export type YearPoint = {
  year: number;
  count: number;
  avgIntensity: number | null;
  avgLikelihood: number | null;
  avgRelevance: number | null;
};

export type DimensionRow = {
  topic?: string;
  country?: string;
  region?: string;
  sector?: string;
  pestle?: string;
  source?: string;
  count: number;
  avgIntensity: number | null;
  avgLikelihood: number | null;
  avgRelevance: number | null;
  avgImpact: number | null;
};

export type FilterOptions = {
  startYears: number[];
  endYears: number[];
  topics: string[];
  sectors: string[];
  regions: string[];
  pestles: string[];
  sources: string[];
  countries: string[];
  cities: { available: boolean; values: string[]; message: string };
  swots: { available: boolean; values: string[]; message: string };
};

export type HeatmapPayload = {
  topics: string[];
  regions: string[];
  cells: {
    topic: string;
    region: string;
    count: number;
    avgIntensity: number | null;
    avgRelevance: number | null;
    avgLikelihood: number | null;
  }[];
};

export type RiskPoint = {
  topic: string;
  count: number;
  likelihood: number;
  intensity: number;
  relevance: number | null;
};

export type InsightsPage = {
  items: Insight[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type UnavailableSet = {
  available: false;
  items: [];
  message: string;
};
