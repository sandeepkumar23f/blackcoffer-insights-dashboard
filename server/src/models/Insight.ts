import mongoose, { Schema, type InferSchemaType } from "mongoose";

const insightSchema = new Schema(
  {
    fingerprint: { type: String, required: true, unique: true, index: true },
    end_year: { type: Number, default: null, index: true },
    intensity: { type: Number, default: null },
    sector: { type: String, default: null, index: true },
    topic: { type: String, default: null, index: true },
    insight: { type: String, default: null },
    url: { type: String, default: null },
    region: { type: String, default: null, index: true },
    start_year: { type: Number, default: null, index: true },
    impact: { type: Number, default: null },
    added: { type: String, default: null },
    published: { type: String, default: null },
    country: { type: String, default: null, index: true },
    relevance: { type: Number, default: null },
    pestle: { type: String, default: null, index: true },
    source: { type: String, default: null, index: true },
    title: { type: String, default: null },
    likelihood: { type: Number, default: null },
  },
  {
    collection: "insights",
    timestamps: false,
  },
);

export type InsightDocument = InferSchemaType<typeof insightSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Insight = mongoose.model("Insight", insightSchema);
