import type { Request, Response } from "express";
import { supabase, supabaseAdmin } from "../config/supabase.js";
import {
  isSchemeSaved,
  toggleSavedScheme,
} from "../services/savedSchemes.service.js";

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
  schemeId: string;
}

interface ToggleSaveResponse {
  success: boolean;
  saved?: boolean;
  message?: string;
}
interface SaveStatusResponse {
  success: boolean;
  saved?: boolean;
  message?: string;
}

function getAccessToken(req: { headers: Request["headers"] }): string | null {
  const authHeader = req.headers.authorization;

  if (!authHeader) return null;

  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Bearer" || !token) return null;

  return token;
}

export const toggleSave = async (
  req: Request<object, ToggleSaveResponse, ToggleSaveBody>,
  res: Response<ToggleSaveResponse>,
): Promise<void> => {
  const { schemeId } = req.body;

  if (!schemeId || typeof schemeId !== "string") {
    res.status(400).json({ success: false, message: "schemeId is required" });
    return;
  }
  const accessToken = getAccessToken(req);
  if (!accessToken) {
    res.status(401).json({ success: false, message: "Unauthorized request" });
    return;
  }

  try {
    const { data: authData, error: authError } = await supabaseAdmin.auth.getUser(accessToken);
    if (authError || !authData.user) {
      res.status(401).json({ success: false, message: "Invalid or expired token" });
      return;
    }

    const result = await toggleSavedScheme(authData.user.id, schemeId);
    res.status(200).json({ success: true, saved: result.saved });
  } catch (error) {
    console.error("[toggleSave]", error);
    res.status(500).json({ success: false, message: "Failed to toggle save" });
  }
};

export const getSaveStatus = async (
  req: Request<{ schemeId: string }, SaveStatusResponse>,
  res: Response<SaveStatusResponse>,
): Promise<void> => {
  const { schemeId } = req.params;
  const accessToken = getAccessToken(req);

  if (!schemeId) {
    res.status(400).json({ success: false, message: "schemeId is required" });
    return;
  }

  if (!accessToken) {
    res.status(401).json({ success: false, message: "Unauthorized request" });
    return;
  }

  try {
    const { data: authData, error: authError } = await supabaseAdmin.auth.getUser(accessToken);
    if (authError || !authData.user) {
      res.status(401).json({ success: false, message: "Invalid or expired token" });
      return;
    }

    const saved = await isSchemeSaved(authData.user.id, schemeId);
    res.status(200).json({ success: true, saved });
  } catch (error) {
    console.error("[getSaveStatus]", error);
    res.status(500).json({ success: false, message: "Failed to fetch save status" });
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

// ─── Get scheme by ID ────────────────────────────────────────────────────────

export const getSchemeById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = req.params;

  try {
    const { data: scheme, error } = await supabase
      .from("schemes")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // not found
        res.status(404).json({ success: false, message: "Scheme not found" });
        return;
      }
      throw error;
    }

    if (!scheme) {
      res.status(404).json({ success: false, message: "Scheme not found" });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        id: scheme.id,
        title: scheme.title,
        description: scheme.description,
        category: scheme.category,
        state: scheme.state,
        eligibility: scheme.eligibility,
        applyLink: scheme.applyLink,
        benefits: scheme.benefits || scheme.benefit || "",
        documentsRequired: scheme.documentsRequired || scheme.documents_required || "",
        lastDate: scheme.lastDate || scheme.deadline || "",
        ministry: scheme.ministry || "",
      },
    });
  } catch (error) {
    console.error("[getSchemeById]", error);
    res.status(500).json({ success: false, message: "Failed to fetch scheme details" });
  }
};
