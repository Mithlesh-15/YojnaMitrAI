import { Router } from "express";
import {
  getSavedSchemes,
  getSaveStatus,
  toggleSave,
  getSchemeById,
} from "../controllers/schemesController.js";

const router = Router();

// GET /api/schemes/saved/:userId
router.get("/saved/:userId", getSavedSchemes);

// POST /api/schemes/toggle-save
router.post("/toggle-save", toggleSave);
// GET /api/schemes/:schemeId/saved-status
router.get("/:schemeId/saved-status", getSaveStatus);

// GET /api/schemes/:id
router.get("/:id", getSchemeById);

export default router;
