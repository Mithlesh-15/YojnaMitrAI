import type { Request, Response } from "express";
import { supabase } from "../config/supabase.js";

interface Scheme {
  id: string;
  title: string;
  description: string;
  category: string;
  state: string;
  eligibility: string;
  ministry?: string;
  benefit?: string;
  ageRequirement?: string;
  qualification?: string;
  deadline: Date;
  applyLink: string;
  created_at: string;
}

interface ApiResponse {
  success: boolean;
  data?: Scheme[];
  message?: string;
}

// ─── Toggle save ──────────────────────────────────────────────────────────────

interface ToggleSaveBody {
  user_id: string;
  scheme_id: string;
}

interface ToggleSaveResponse {
  success: boolean;
  saved?: boolean;
  message?: string;
}

export const toggleSave = async (
  req: Request<object, ToggleSaveResponse, ToggleSaveBody>,
  res: Response<ToggleSaveResponse>,
): Promise<void> => {
  const { user_id, scheme_id } = req.body;

  if (!user_id || !scheme_id) {
    res.status(400).json({ success: false, message: "user_id and scheme_id are required" });
    return;
  }

  try {
    // Check if a record already exists
    const { data: existing, error: fetchError } = await supabase
      .from("saved_schemes")
      .select("id")
      .eq("user_id", user_id)
      .eq("scheme_id", scheme_id)
      .maybeSingle();

    if (fetchError) throw fetchError;

    if (existing) {
      // Record exists → unsave (delete)
      const { error: deleteError } = await supabase
        .from("saved_schemes")
        .delete()
        .eq("user_id", user_id)
        .eq("scheme_id", scheme_id);

      if (deleteError) throw deleteError;

      res.status(200).json({ success: true, saved: false });
    } else {
      // Record does not exist → save (insert)
      const { error: insertError } = await supabase
        .from("saved_schemes")
        .insert({ user_id, scheme_id });

      if (insertError) throw insertError;

      res.status(200).json({ success: true, saved: true });
    }
  } catch (error) {
    console.error("[toggleSave]", error);
    res.status(500).json({ success: false, message: "Failed to toggle save" });
  }
};

// ─── Get saved schemes ────────────────────────────────────────────────────────

export const getSavedSchemes = async (
  req: Request,
  res: Response<ApiResponse>,
): Promise<void> => {
  const { userId } = req.params;

  try {
    const { data: saved, error: savedError } = await supabase
      .from("saved_schemes")
      .select("scheme_id")
      .eq("user_id", userId);

    if (savedError) throw savedError;

    if (!saved || saved.length === 0) {
      res.status(200).json({
        success: true,
        data: [],
      });
      return;
    }

    const schemeIds = saved.map((item) => item.scheme_id);

    const { data: schemesData, error: schemeError } = await supabase
      .from("schemes")
      .select("*")
      .in("id", schemeIds);

    if (schemeError) throw schemeError;

    res.status(200).json({
      success: true,
      data: schemesData as Scheme[],
    });
    return;
  } catch (error) {
    console.error("[getSavedSchemes]", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch saved schemes",
    });
    return;
  }
};
