import { supabaseAdmin } from "../config/supabase.js";

export interface ToggleSavedSchemeResult {
  saved: boolean;
}

/**
 * Toggles saved state for a scheme for a specific authenticated user.
 * Uses service-role client on server to avoid exposing privileged keys in frontend.
 */
export async function toggleSavedScheme(
  userId: string,
  schemeId: string,
): Promise<ToggleSavedSchemeResult> {
  const { data: existingRows, error: fetchError } = await supabaseAdmin
    .from("saved_schemes")
    .select("scheme_id")
    .eq("user_id", userId)
    .eq("scheme_id", schemeId)
    .limit(1);

  if (fetchError) throw fetchError;

  const isAlreadySaved = (existingRows?.length ?? 0) > 0;

  if (isAlreadySaved) {
    const { error: deleteError } = await supabaseAdmin
      .from("saved_schemes")
      .delete()
      .eq("user_id", userId)
      .eq("scheme_id", schemeId);

    if (deleteError) throw deleteError;
    return { saved: false };
  }

  const { error: insertError } = await supabaseAdmin
    .from("saved_schemes")
    .insert({ user_id: userId, scheme_id: schemeId });

  if (insertError) {
    // Unique constraint race case: record was inserted by another request.
    if (insertError.code === "23505") {
      return { saved: true };
    }
    throw insertError;
  }

  return { saved: true };
}

export async function isSchemeSaved(userId: string, schemeId: string): Promise<boolean> {
  const { data, error } = await supabaseAdmin
    .from("saved_schemes")
    .select("scheme_id")
    .eq("user_id", userId)
    .eq("scheme_id", schemeId)
    .limit(1);

  if (error) throw error;

  return (data?.length ?? 0) > 0;
}
