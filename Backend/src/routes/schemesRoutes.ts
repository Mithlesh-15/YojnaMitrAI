import { Router } from "express";
import { getSavedSchemes } from "../controllers/schemesController.js";

const router = Router();

// GET /api/schemes/saved/:userId
router.get("/saved/:userId", getSavedSchemes);

export default router;
