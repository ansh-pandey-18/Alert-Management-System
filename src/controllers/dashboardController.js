import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import {
  getSeveritySummary,
  getTopDrivers,
  getRecentAutoClosed,
  getAlertTrends,
} from "../services/dashboardService.js";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const severitySummary = asyncHandler(async (req, res) => {
  const data = await getSeveritySummary();
  return res.status(200).json(new ApiResponse(200, data, "Severity summary"));
});

const topDrivers = asyncHandler(async (req, res) => {
  const data = await getTopDrivers();
  return res.status(200).json(new ApiResponse(200, data, "Top drivers"));
});

const recentAutoClosed = asyncHandler(async (req, res) => {
  const data = await getRecentAutoClosed();
  return res
    .status(200)
    .json(new ApiResponse(200, data, "Recently auto-closed alerts"));
});

const alertTrends = asyncHandler(async (req, res) => {
  const data = await getAlertTrends();
  return res.status(200).json(new ApiResponse(200, data, "Alert trends"));
});

const getActiveRules = asyncHandler(async (req, res) => {
  const rulesPath = path.join(__dirname, "../config/rules.json");
  const rules = JSON.parse(fs.readFileSync(rulesPath, "utf-8"));

  return res.status(200).json(new ApiResponse(200, rules, "Active rules"));
});

export {
  severitySummary,
  topDrivers,
  recentAutoClosed,
  alertTrends,
  getActiveRules,
};