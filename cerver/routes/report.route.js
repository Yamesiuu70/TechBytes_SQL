// routes/report.route.js
import express from "express";
import { createReportController } from "../controllers/report.controller.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

// Only authenticated users can submit reports
router.post("/", auth, createReportController);

export default router;
