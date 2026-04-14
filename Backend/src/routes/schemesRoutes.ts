import { Router } from "express";
import { getSavedSchemes, toggleSave } from "../controllers/schemesController.js";

const router = Router();

// GET /api/schemes/saved/:userId
router.get("/saved/:userId", getSavedSchemes);

// POST /api/schemes/toggle-save
router.post("/toggle-save", toggleSave);

export default router;
