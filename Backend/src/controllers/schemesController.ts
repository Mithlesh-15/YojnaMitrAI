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
