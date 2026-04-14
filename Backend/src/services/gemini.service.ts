import { GoogleGenerativeAI } from "@google/generative-ai";
import type { GeminiExtracted } from "../types/ai.types.js";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY ?? "";

const VALID_CATEGORIES = [
  "education", "student", "agriculture", "farmer", "health",
  "housing", "women", "finance", "employment", "skill", "general",
];

const VALID_STATES = [
  "andhra pradesh", "arunachal pradesh", "assam", "bihar", "chhattisgarh",
  "goa", "gujarat", "haryana", "himachal pradesh", "jharkhand", "karnataka",
  "kerala", "madhya pradesh", "maharashtra", "manipur", "meghalaya",
  "mizoram", "nagaland", "odisha", "punjab", "rajasthan", "sikkim",
  "tamil nadu", "telangana", "tripura", "uttar pradesh", "uttarakhand",
  "west bengal", "delhi", "jammu and kashmir", "ladakh",
  "andaman and nicobar", "chandigarh", "dadra and nagar haveli",
  "daman and diu", "lakshadweep", "puducherry", "all india",
];

const EXTRACTION_PROMPT = (query: string) => `
You are a JSON extractor for a government scheme search system.

Extract from the user query:
- "category": one of [${VALID_CATEGORIES.join(", ")}]
- "state": the Indian state mentioned, or "All India" if not specified

Rules:
- Return ONLY valid JSON. No markdown. No explanation. No extra text.
- If no category is found, use "general"
- Normalize state names to title case (e.g., "madhya pradesh" → "Madhya Pradesh")

User query: "${query}"

JSON:
`.trim();

/**
 * Calls Gemini and returns structured { category, state } filters.
 * Throws on unrecoverable failure; returns safe fallback on bad JSON.
 */
export async function extractFiltersWithGemini(
  query: string,
): Promise<GeminiExtracted> {
  if (!GEMINI_API_KEY) {
    console.warn("[gemini] GEMINI_API_KEY not set — using fallback filters");
    return { category: "general", state: "All India" };
  }

  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

  const result = await model.generateContent(EXTRACTION_PROMPT(query));
  const raw = result.response.text().trim();

  // Strip accidental markdown fences
  const cleaned = raw.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();

  let parsed: Partial<GeminiExtracted>;
  try {
    parsed = JSON.parse(cleaned) as Partial<GeminiExtracted>;
  } catch {
    console.warn("[gemini] Bad JSON from model, using fallback. Raw:", raw);
    return { category: "general", state: "All India" };
  }

  // Validate fields — don't trust the model blindly
  const category = typeof parsed.category === "string"
    ? parsed.category.toLowerCase().trim()
    : "general";

  const state = typeof parsed.state === "string"
    ? parsed.state.trim()
    : "All India";

  const safeCategory = VALID_CATEGORIES.includes(category) ? category : "general";
  const safeState = VALID_STATES.includes(state.toLowerCase()) ? state : "All India";

  return { category: safeCategory, state: safeState };
}
