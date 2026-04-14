import type { Request, Response } from "express";
import { extractFiltersWithGemini } from "../services/gemini.service.js";
import { querySchemes, buildMessage } from "../services/schemes.service.js";
import type { AiQueryRequest, AiQueryResponse } from "../types/ai.types.js";

export const handleAiQuery = async (
  req: Request<object, AiQueryResponse, AiQueryRequest>,
  res: Response<AiQueryResponse>,
): Promise<void> => {
  // ── 1. Validate request body ──────────────────────────────────────────────
  const { query } = req.body;

  if (!query || typeof query !== "string" || query.trim().length === 0) {
    res.status(400).json({
      success: false,
      message: "Request body must contain a non-empty 'query' string.",
    });
    return;
  }

  const trimmedQuery = query.trim();

  try {
    // ── 2. Extract filters via Gemini ───────────────────────────────────────
    let filters: Awaited<ReturnType<typeof extractFiltersWithGemini>>;

    try {
      filters = await extractFiltersWithGemini(trimmedQuery);
    } catch (geminiError) {
      console.error("[aiController] Gemini failed:", geminiError);
      // Graceful degradation — proceed with generic filters
      filters = { category: "general", state: "All India" };
    }

    // ── 3. Query Supabase ───────────────────────────────────────────────────
    const schemes = await querySchemes(filters);

    // ── 4. Build human-readable message ────────────────────────────────────
    const message = buildMessage(filters, schemes);

    // ── 5. Respond ──────────────────────────────────────────────────────────
    res.status(200).json({
      success: true,
      filters,
      results: schemes,
      message,
    });
  } catch (error) {
    console.error("[aiController] Unhandled error:", error);
    res.status(500).json({
      success: false,
      message: "An internal error occurred while processing your query.",
    });
  }
};
