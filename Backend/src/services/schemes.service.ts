import { supabase } from "../config/supabase.js";
import type { AiFilters, Scheme } from "../types/ai.types.js";

const SCHEME_LIMIT = 8;

/**
 * Queries the `schemes` table using category + state ilike filters.
 * Falls back to a broader search if no exact matches are found.
 */
export async function querySchemes(filters: AiFilters): Promise<Scheme[]> {
  const { category, state } = filters;

  // Primary query: match both category AND state
  const { data: primary, error: primaryError } = await supabase
    .from("schemes")
    .select("id, title, description, category, state, eligibility, applyLink")
    .ilike("category", `%${category}%`)
    .or(`state.ilike.%${state}%,state.ilike.%All India%`)
    .limit(SCHEME_LIMIT);

  if (primaryError) throw primaryError;

  if (primary && primary.length > 0) return primary as Scheme[];

  // Fallback 1: category only (ignore state)
  const { data: fallback1, error: fallback1Error } = await supabase
    .from("schemes")
    .select("id, title, description, category, state, eligibility, applyLink")
    .ilike("category", `%${category}%`)
    .limit(SCHEME_LIMIT);

  if (fallback1Error) throw fallback1Error;

  if (fallback1 && fallback1.length > 0) return fallback1 as Scheme[];

  // Fallback 2: state only
  const { data: fallback2, error: fallback2Error } = await supabase
    .from("schemes")
    .select("id, title, description, category, state, eligibility, applyLink")
    .ilike("state", `%${state}%`)
    .limit(SCHEME_LIMIT);

  if (fallback2Error) throw fallback2Error;

  return (fallback2 ?? []) as Scheme[];
}

/**
 * Builds a human-readable summary message for the response.
 */
export function buildMessage(
  filters: AiFilters,
  schemes: Scheme[],
): string {
  const profile = `${capitalize(filters.category)} from ${filters.state}`;

  if (schemes.length === 0) {
    return `We couldn't find any schemes for ${profile} right now. Try a broader query.`;
  }

  const titles = schemes
    .slice(0, 3)
    .map((s) => `"${s.title}"`)
    .join(", ");

  return `Based on your profile (${profile}), we found ${schemes.length} relevant scheme(s) for you. Here are some highlights: ${titles}${schemes.length > 3 ? ", and more below." : "."}`;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
