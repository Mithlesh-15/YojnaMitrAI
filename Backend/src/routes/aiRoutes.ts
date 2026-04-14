import { Router } from "express";
import { handleAiQuery } from "../controllers/aiController.js";

const router = Router();

// POST /api/ai/query
router.post("/query", handleAiQuery);

export default router;
