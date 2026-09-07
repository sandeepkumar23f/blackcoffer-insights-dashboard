import type { Request, Response } from "express";
import { Insight } from "../models/Insight.js";

async function distinctSortedStrings(field: string): Promise<string[]> {
  const values = await Insight.distinct(field, { [field]: { $nin: [null, ""] } });
  return values
    .map((v) => String(v))
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
}

async function distinctSortedNumbers(field: string): Promise<number[]> {
  const values = await Insight.distinct(field, { [field]: { $nin: [null, ""] } });
  return values
    .map((v) => Number(v))
    .filter((n) => Number.isFinite(n))
    .sort((a, b) => a - b);
}

export async function getFilters(_req: Request, res: Response) {
  const [startYears, endYears, topics, sectors, regions, pestles, sources, countries] =
    await Promise.all([
      distinctSortedNumbers("start_year"),
      distinctSortedNumbers("end_year"),
      distinctSortedStrings("topic"),
      distinctSortedStrings("sector"),
      distinctSortedStrings("region"),
      distinctSortedStrings("pestle"),
      distinctSortedStrings("source"),
      distinctSortedStrings("country"),
    ]);

  res.json({
    success: true,
    data: {
      startYears,
      endYears,
      topics,
      sectors,
      regions,
      pestles,
      sources,
      countries,
      cities: {
        available: false,
        values: [] as string[],
        message: "City is not present in the supplied dataset.",
      },
      swots: {
        available: false,
        values: [] as string[],
        message: "SWOT is not present in the supplied dataset.",
      },
    },
  });
}
