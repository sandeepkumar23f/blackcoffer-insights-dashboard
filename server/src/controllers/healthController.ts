import type { Request, Response } from "express";

export function health(_req: Request, res: Response) {
  res.json({
    success: true,
    status: "ok",
    service: "blackcoffer-insights-api",
    timestamp: new Date().toISOString(),
  });
}
