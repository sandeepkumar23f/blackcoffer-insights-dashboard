import type { Request, Response, NextFunction } from "express";
import { filterQuerySchema } from "../utils/buildFilter.js";

export function validateQuery(req: Request, _res: Response, next: NextFunction) {
  const parsed = filterQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    next(parsed.error);
    return;
  }
  next();
}
