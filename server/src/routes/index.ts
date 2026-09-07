import { Router } from "express";
import { health } from "../controllers/healthController.js";
import { getFilters } from "../controllers/filterController.js";
import { getInsightById, getInsights } from "../controllers/insightController.js";
import {
  getByCity,
  getByCountry,
  getByPestle,
  getByRegion,
  getBySector,
  getBySource,
  getBySwot,
  getByTopic,
  getByYear,
  getRiskMatrix,
  getSummary,
  getTopicRegionHeatmap,
} from "../controllers/dashboardController.js";
import { validateQuery } from "../middleware/validateQuery.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const apiRouter = Router();

apiRouter.use(validateQuery);

apiRouter.get("/health", health);
apiRouter.get("/filters", asyncHandler(getFilters));
apiRouter.get("/insights", asyncHandler(getInsights));
apiRouter.get("/insights/:id", asyncHandler(getInsightById));

apiRouter.get("/dashboard/summary", asyncHandler(getSummary));
apiRouter.get("/dashboard/by-year", asyncHandler(getByYear));
apiRouter.get("/dashboard/by-topic", asyncHandler(getByTopic));
apiRouter.get("/dashboard/by-country", asyncHandler(getByCountry));
apiRouter.get("/dashboard/by-region", asyncHandler(getByRegion));
apiRouter.get("/dashboard/by-sector", asyncHandler(getBySector));
apiRouter.get("/dashboard/by-pestle", asyncHandler(getByPestle));
apiRouter.get("/dashboard/by-source", asyncHandler(getBySource));
apiRouter.get("/dashboard/by-city", asyncHandler(getByCity));
apiRouter.get("/dashboard/by-swot", asyncHandler(getBySwot));
apiRouter.get("/dashboard/risk-matrix", asyncHandler(getRiskMatrix));
apiRouter.get("/dashboard/topic-region-heatmap", asyncHandler(getTopicRegionHeatmap));
