import { createHash } from "node:crypto";

export type RawInsight = Record<string, unknown>;

export type NormalizedInsight = {
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

function emptyToNullString(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const text = String(value).trim();
  return text.length === 0 ? null : text;
}

function toNullableNumber(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "string" && value.trim() === "") return null;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeRegion(value: string | null): string | null {
  if (!value) return null;
  if (value.toLowerCase() === "world") return "World";
  return value;
}

export function makeFingerprint(url: string | null, title: string | null, added: string | null): string {
  return createHash("sha256")
    .update(`${url ?? ""}|${title ?? ""}|${added ?? ""}`)
    .digest("hex");
}

export function normalizeRecord(raw: RawInsight): NormalizedInsight | null {
  if (!raw || typeof raw !== "object") return null;

  const title = emptyToNullString(raw.title);
  const url = emptyToNullString(raw.url);
  const added = emptyToNullString(raw.added);

  if (!title && !url) return null;

  return {
    fingerprint: makeFingerprint(url, title, added),
    end_year: toNullableNumber(raw.end_year),
    intensity: toNullableNumber(raw.intensity),
    sector: emptyToNullString(raw.sector),
    topic: emptyToNullString(raw.topic),
    insight: emptyToNullString(raw.insight),
    url,
    region: normalizeRegion(emptyToNullString(raw.region)),
    start_year: toNullableNumber(raw.start_year),
    impact: toNullableNumber(raw.impact),
    added,
    published: emptyToNullString(raw.published),
    country: emptyToNullString(raw.country),
    relevance: toNullableNumber(raw.relevance),
    pestle: emptyToNullString(raw.pestle),
    source: emptyToNullString(raw.source),
    title,
    likelihood: toNullableNumber(raw.likelihood),
  };
}
