import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Alert from "../models/Alert.js";
import logger from "../config/logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load rule configuration once at startup
const rulesPath = path.join(__dirname, "../config/rules.json");
const rules = JSON.parse(fs.readFileSync(rulesPath, "utf-8"));

const evaluateEscalation = async (alert) => {
  const rule = rules[alert.sourceType];

  if (!rule || !rule.escalate_if_count) return;

  // If already escalated, no need to re-evaluate
  if (alert.status === "ESCALATED") return;

  const windowStart = new Date(Date.now() - rule.window_mins * 60 * 1000);

  const countInWindow = await Alert.countDocuments({
    driverId: alert.driverId,
    sourceType: alert.sourceType,
    createdAt: { $gte: windowStart },
  });

  if (countInWindow < rule.escalate_if_count) return;

  const previousState = alert.status;

  alert.status = "ESCALATED";
  alert.severity = "CRITICAL";
  alert.escalationCount += 1;

  alert.history.push({
    fromState: previousState,
    toState: "ESCALATED",
    reason: "Escalation threshold reached",
  });

  await alert.save();

  logger.info(`Alert escalated: ${alert.alertId}`);
};

export { evaluateEscalation };