import express from "express";
import {
  severitySummary,
  topDrivers,
  recentAutoClosed,
  alertTrends,
  getActiveRules
} from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/summary", severitySummary);
router.get("/top-drivers", topDrivers);
router.get("/recent-auto-closed", recentAutoClosed);
router.get("/trends", alertTrends);
router.get("/rules", getActiveRules);

export default router;