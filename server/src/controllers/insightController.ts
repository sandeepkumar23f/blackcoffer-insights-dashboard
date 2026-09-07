import type { Request, Response } from "express";
import mongoose from "mongoose";
import { Insight } from "../models/Insight.js";
import { buildInsightFilter, parseFilters, parsePagination } from "../utils/buildFilter.js";
import { HttpError } from "../middleware/errorHandler.js";

export async function getInsights(req: Request, res: Response) {
  const filters = parseFilters(req.query as Record<string, unknown>);
  const { page, limit, sortBy, sortOrder } = parsePagination(req.query as Record<string, unknown>);
  const match = buildInsightFilter(filters);

  const [items, total] = await Promise.all([
    Insight.find(match)
      .sort({ [sortBy]: sortOrder, _id: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Insight.countDocuments(match),
  ]);

  res.json({
    success: true,
    data: {
      items,
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  });
}

export async function getInsightById(req: Request, res: Response) {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new HttpError(400, "Invalid insight id");
  }
  const item = await Insight.findById(id).lean();
  if (!item) {
    throw new HttpError(404, "Insight not found");
  }
  res.json({ success: true, data: item });
}
