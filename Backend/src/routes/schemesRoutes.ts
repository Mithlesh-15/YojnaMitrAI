import { Router } from "express";
import { getSavedSchemes, toggleSave, getSchemeById } from "../controllers/schemesController.js";

const router = Router();

// GET /api/schemes/saved/:userId
router.get("/saved/:userId", getSavedSchemes);

// POST /api/schemes/toggle-save
router.post("/toggle-save", toggleSave);

// GET /api/schemes/:id
router.get("/:id", getSchemeById);

export default router;
