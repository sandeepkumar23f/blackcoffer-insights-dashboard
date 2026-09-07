import type { Request, Response } from "express";
import { Insight } from "../models/Insight.js";
import { buildInsightFilter, parseFilters } from "../utils/buildFilter.js";

function topLimit(query: Record<string, unknown>, fallback = 15): number {
  const n = Number(query.limit);
  return Number.isFinite(n) ? Math.min(50, Math.max(5, n)) : fallback;
}

export async function getSummary(req: Request, res: Response) {
  const match = buildInsightFilter(parseFilters(req.query as Record<string, unknown>));

  const [stats] = await Insight.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        totalRecords: { $sum: 1 },
        averageIntensity: { $avg: "$intensity" },
        averageLikelihood: { $avg: "$likelihood" },
        averageRelevance: { $avg: "$relevance" },
        averageImpact: { $avg: "$impact" },
        countries: { $addToSet: "$country" },
        topics: { $addToSet: "$topic" },
      },
    },
    {
      $project: {
        _id: 0,
        totalRecords: 1,
        averageIntensity: 1,
        averageLikelihood: 1,
        averageRelevance: 1,
        averageImpact: 1,
        countriesCount: {
          $size: {
            $filter: {
              input: "$countries",
              as: "c",
              cond: { $and: [{ $ne: ["$$c", null] }, { $ne: ["$$c", ""] }] },
            },
          },
        },
        topicsCount: {
          $size: {
            $filter: {
              input: "$topics",
              as: "t",
              cond: { $and: [{ $ne: ["$$t", null] }, { $ne: ["$$t", ""] }] },
            },
          },
        },
      },
    },
  ]);

  res.json({
    success: true,
    data: stats ?? {
      totalRecords: 0,
      averageIntensity: null,
      averageLikelihood: null,
      averageRelevance: null,
      averageImpact: null,
      countriesCount: 0,
      topicsCount: 0,
    },
  });
}

export async function getByYear(req: Request, res: Response) {
  const match = buildInsightFilter(parseFilters(req.query as Record<string, unknown>));
  const yearField = String(req.query.yearField ?? "coalesced");

  const yearExpr =
    yearField === "start_year"
      ? "$start_year"
      : yearField === "end_year"
        ? "$end_year"
        : { $ifNull: ["$end_year", "$start_year"] };

  const data = await Insight.aggregate([
    { $match: match },
    { $addFields: { year: yearExpr } },
    { $match: { year: { $ne: null } } },
    {
      $group: {
        _id: "$year",
        count: { $sum: 1 },
        avgIntensity: { $avg: "$intensity" },
        avgLikelihood: { $avg: "$likelihood" },
        avgRelevance: { $avg: "$relevance" },
      },
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        _id: 0,
        year: "$_id",
        count: 1,
        avgIntensity: 1,
        avgLikelihood: 1,
        avgRelevance: 1,
      },
    },
  ]);

  res.json({ success: true, data });
}

async function groupedDimension(
  req: Request,
  field: "topic" | "country" | "region" | "sector" | "pestle" | "source",
  defaultLimit: number,
) {
  const match = buildInsightFilter(parseFilters(req.query as Record<string, unknown>));
  const limit = topLimit(req.query as Record<string, unknown>, defaultLimit);

  return Insight.aggregate([
    { $match: match },
    { $match: { [field]: { $nin: [null, ""] } } },
    {
      $group: {
        _id: `$${field}`,
        count: { $sum: 1 },
        avgIntensity: { $avg: "$intensity" },
        avgLikelihood: { $avg: "$likelihood" },
        avgRelevance: { $avg: "$relevance" },
        avgImpact: { $avg: "$impact" },
      },
    },
    { $sort: { count: -1, avgIntensity: -1 } },
    { $limit: limit },
    {
      $project: {
        _id: 0,
        [field]: "$_id",
        count: 1,
        avgIntensity: 1,
        avgLikelihood: 1,
        avgRelevance: 1,
        avgImpact: 1,
      },
    },
  ]);
}

export async function getByTopic(req: Request, res: Response) {
  const data = await groupedDimension(req, "topic", 15);
  res.json({ success: true, data });
}

export async function getByCountry(req: Request, res: Response) {
  const data = await groupedDimension(req, "country", 20);
  res.json({ success: true, data });
}

export async function getByRegion(req: Request, res: Response) {
  const data = await groupedDimension(req, "region", 25);
  res.json({ success: true, data });
}

export async function getBySector(req: Request, res: Response) {
  const data = await groupedDimension(req, "sector", 20);
  res.json({ success: true, data });
}

export async function getByPestle(req: Request, res: Response) {
  const data = await groupedDimension(req, "pestle", 20);
  res.json({ success: true, data });
}

export async function getBySource(req: Request, res: Response) {
  const data = await groupedDimension(req, "source", 15);
  res.json({ success: true, data });
}

export async function getByCity(_req: Request, res: Response) {
  res.json({
    success: true,
    data: {
      available: false,
      items: [],
      message: "City data unavailable. The supplied JSON dataset has no city field.",
    },
  });
}

export async function getBySwot(_req: Request, res: Response) {
  res.json({
    success: true,
    data: {
      available: false,
      items: [],
      message: "SWOT data unavailable in supplied dataset. Values were not inferred from other fields.",
    },
  });
}

export async function getRiskMatrix(req: Request, res: Response) {
  const match = buildInsightFilter(parseFilters(req.query as Record<string, unknown>));
  const data = await Insight.aggregate([
    { $match: match },
    {
      $match: {
        likelihood: { $ne: null },
        intensity: { $ne: null },
        topic: { $nin: [null, ""] },
      },
    },
    {
      $group: {
        _id: "$topic",
        count: { $sum: 1 },
        avgLikelihood: { $avg: "$likelihood" },
        avgIntensity: { $avg: "$intensity" },
        avgRelevance: { $avg: "$relevance" },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 40 },
    {
      $project: {
        _id: 0,
        topic: "$_id",
        count: 1,
        likelihood: "$avgLikelihood",
        intensity: "$avgIntensity",
        relevance: "$avgRelevance",
      },
    },
  ]);

  res.json({
    success: true,
    data,
    meta: {
      note: "Quadrants are visual analytical guides only; the dataset has no risk category field.",
    },
  });
}

export async function getTopicRegionHeatmap(req: Request, res: Response) {
  const match = buildInsightFilter(parseFilters(req.query as Record<string, unknown>));
  const cells = await Insight.aggregate([
    { $match: match },
    {
      $match: {
        topic: { $nin: [null, ""] },
        region: { $nin: [null, ""] },
      },
    },
    {
      $group: {
        _id: { topic: "$topic", region: "$region" },
        count: { $sum: 1 },
        avgIntensity: { $avg: "$intensity" },
        avgRelevance: { $avg: "$relevance" },
        avgLikelihood: { $avg: "$likelihood" },
      },
    },
    { $match: { count: { $gte: 1 } } },
    { $sort: { count: -1 } },
    {
      $project: {
        _id: 0,
        topic: "$_id.topic",
        region: "$_id.region",
        count: 1,
        avgIntensity: 1,
        avgRelevance: 1,
        avgLikelihood: 1,
      },
    },
  ]);

  const topicTotals = new Map<string, number>();
  const regionTotals = new Map<string, number>();
  for (const cell of cells) {
    topicTotals.set(cell.topic, (topicTotals.get(cell.topic) ?? 0) + cell.count);
    regionTotals.set(cell.region, (regionTotals.get(cell.region) ?? 0) + cell.count);
  }

  const topTopics = [...topicTotals.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([topic]) => topic);
  const topRegions = [...regionTotals.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([region]) => region);

  const topicSet = new Set(topTopics);
  const regionSet = new Set(topRegions);

  res.json({
    success: true,
    data: {
      topics: topTopics,
      regions: topRegions,
      cells: cells.filter((c) => topicSet.has(c.topic) && regionSet.has(c.region)),
    },
  });
}
