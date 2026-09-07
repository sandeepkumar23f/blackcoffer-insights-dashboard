import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env.js";
import { connectDatabase } from "./config/db.js";
import { apiRouter } from "./routes/index.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

async function bootstrap() {
  await connectDatabase();
  console.log("MongoDB connected");

  const app = express();
  app.disable("x-powered-by");
  app.use(helmet());
  app.use(
    cors({
      origin: env.CLIENT_URL.split(",").map((s) => s.trim()),
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "1mb" }));

  app.get("/", (_req, res) => {
    res.json({ success: true, message: "Blackcoffer Insights API", docs: "/api/health" });
  });

  app.use("/api", apiRouter);
  app.use(notFound);
  app.use(errorHandler);

  app.listen(env.PORT, () => {
    console.log(`API listening on http://127.0.0.1:${env.PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
