import type { Request, Response } from "express";
import { supabase } from "../config/supabase.js";

export const getSavedSchemes = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { userId } = req.params;

  try {
    const { data: saved, error:sevedError } = await supabase
      .from("saved_schemes")
      .select("*")
      .eq("user_id", userId);

    if (sevedError) throw sevedError;
    // extract scheme ids
    const schemeIds = saved.map((item) => item.scheme_id);

    // fetch schemes
    const { data: schemesData, error: schemeError } = await supabase
      .from("schemes")
      .select("*")
      .in("id", schemeIds);

    if (schemeError) throw schemeError;

    res.status(200).json({
      success: true,
      data: schemesData ?? [],
    });
  } catch (err) {
    console.error("[getSavedSchemes]", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch saved schemes",
    });
  }
};
