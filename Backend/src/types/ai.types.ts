// ─── Request / Response ───────────────────────────────────────────────────────

export interface AiQueryRequest {
  query: string;
}

export interface AiFilters {
  category: string;
  state: string;
}

export interface Scheme {
  id: string;
  title: string;
  description: string;
  category: string;
  state: string;
  eligibility: string;
  applyLink: string;
}

export interface AiQueryResponse {
  success: boolean;
  filters?: AiFilters;
  results?: Scheme[];
  message?: string;
}

// ─── Gemini raw parse result ──────────────────────────────────────────────────

export interface GeminiExtracted {
  category: string;
  state: string;
}
