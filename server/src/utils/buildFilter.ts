import { z } from "zod";
import type { FilterQuery } from "mongoose";
import type { InsightDocument } from "../models/Insight.js";

function toList(value: unknown): string[] {
  if (value === undefined || value === null || value === "") return [];
  if (Array.isArray(value)) {
    return value.flatMap((item) => String(item).split(",")).map((s) => s.trim()).filter(Boolean);
  }
  return String(value)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function toNumberList(value: unknown): number[] {
  return toList(value)
    .map((item) => Number(item))
    .filter((n) => Number.isFinite(n));
}

export const filterQuerySchema = z.object({
  startYear: z.unknown().optional(),
  endYear: z.unknown().optional(),
  topics: z.unknown().optional(),
  sector: z.unknown().optional(),
  region: z.unknown().optional(),
  pestle: z.unknown().optional(),
  source: z.unknown().optional(),
  swot: z.unknown().optional(),
  country: z.unknown().optional(),
  city: z.unknown().optional(),
  search: z.unknown().optional(),
  page: z.unknown().optional(),
  limit: z.unknown().optional(),
  sortBy: z.unknown().optional(),
  sortOrder: z.unknown().optional(),
  metric: z.unknown().optional(),
  yearField: z.unknown().optional(),
});

export type ParsedFilters = {
  startYear: number[];
  endYear: number[];
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

export function parseFilters(query: Record<string, unknown>): ParsedFilters {
  return {
    startYear: toNumberList(query.startYear),
    endYear: toNumberList(query.endYear),
    topics: toList(query.topics),
    sector: toList(query.sector),
    region: toList(query.region),
    pestle: toList(query.pestle),
    source: toList(query.source),
    swot: toList(query.swot),
    country: toList(query.country),
    city: toList(query.city),
    search: toList(query.search).join(" ").trim(),
  };
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Shared MongoDB match builder used by every insights/dashboard endpoint.
 * SWOT and city filters are accepted for API symmetry but the supplied dataset
 * has neither field; matching on them yields no documents.
 */
export function buildInsightFilter(filters: ParsedFilters): FilterQuery<InsightDocument> {
  const match: FilterQuery<InsightDocument> = {};

  if (filters.startYear.length) {
    match.start_year = { $in: filters.startYear };
  }
  if (filters.endYear.length) {
    match.end_year = { $in: filters.endYear };
  }
  if (filters.topics.length) {
    match.topic = { $in: filters.topics };
  }
  if (filters.sector.length) {
    match.sector = { $in: filters.sector };
  }
  if (filters.region.length) {
    match.region = { $in: filters.region };
  }
  if (filters.pestle.length) {
    match.pestle = { $in: filters.pestle };
  }
  if (filters.source.length) {
    match.source = { $in: filters.source };
  }
  if (filters.country.length) {
    match.country = { $in: filters.country };
  }
  if (filters.city.length) {
    Object.assign(match, { city: { $in: filters.city } });
  }
  if (filters.swot.length) {
    Object.assign(match, { swot: { $in: filters.swot } });
  }

  if (filters.search) {
    const rx = new RegExp(escapeRegex(filters.search), "i");
    match.$or = [
      { title: rx },
      { insight: rx },
      { topic: rx },
      { sector: rx },
      { country: rx },
      { region: rx },
      { source: rx },
    ];
  }

  return match;
}

export function parsePagination(query: Record<string, unknown>): {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: 1 | -1;
} {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 12));
  const allowedSort = new Set([
    "title",
    "topic",
    "sector",
    "country",
    "region",
    "start_year",
    "end_year",
    "intensity",
    "likelihood",
    "relevance",
    "pestle",
    "source",
    "impact",
  ]);
  const sortBy = allowedSort.has(String(query.sortBy)) ? String(query.sortBy) : "intensity";
  const sortOrder: 1 | -1 = String(query.sortOrder).toLowerCase() === "asc" ? 1 : -1;
  return { page, limit, sortBy, sortOrder };
}
