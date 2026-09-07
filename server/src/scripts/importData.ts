import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { connectDatabase, disconnectDatabase } from "../config/db.js";
import { Insight } from "../models/Insight.js";
import { normalizeRecord, type RawInsight } from "../utils/normalize.js";

const dataPath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../data/jsondata.json",
);

async function main() {
  console.log("Connecting to MongoDB…");
  await connectDatabase();

  console.log(`Reading ${dataPath}`);
  const rawText = await fs.readFile(dataPath, "utf8");
  const parsed = JSON.parse(rawText) as unknown;

  if (!Array.isArray(parsed)) {
    throw new Error("jsondata.json must be a JSON array");
  }

  const read = parsed.length;
  const docs = [];
  let skipped = 0;

  for (const item of parsed as RawInsight[]) {
    const normalized = normalizeRecord(item);
    if (!normalized) {
      skipped += 1;
      continue;
    }
    docs.push(normalized);
  }

  const unique = new Map(docs.map((d) => [d.fingerprint, d]));
  const duplicatesInFile = docs.length - unique.size;

  await Insight.deleteMany({});
  const inserted = await Insight.insertMany([...unique.values()], { ordered: false });

  const indexes = await Insight.collection.indexes();

  console.log("--- Import complete ---");
  console.log(`Records read:            ${read}`);
  console.log(`Normalized:              ${docs.length}`);
  console.log(`Skipped / invalid:       ${skipped}`);
  console.log(`Duplicates in file:      ${duplicatesInFile}`);
  console.log(`Imported (unique):       ${inserted.length}`);
  console.log(`Indexes:                 ${indexes.map((i) => i.name).join(", ")}`);

  await disconnectDatabase();
}

main().catch(async (err) => {
  console.error("Import failed:", err);
  await disconnectDatabase().catch(() => undefined);
  process.exit(1);
});
