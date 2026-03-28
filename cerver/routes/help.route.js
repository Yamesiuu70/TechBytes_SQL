import express from "express";
import { submitHelp } from "../controllers/help.controller.js";

const router = express.Router();

// POST /api/help
router.post("/", submitHelp);

export default router;
