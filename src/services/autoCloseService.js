import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Alert from "../models/Alert.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load rules once
const rulesPath = path.join(__dirname, "../config/rules.json");
const rules = JSON.parse(fs.readFileSync(rulesPath, "utf-8"));

const processAutoClose = async () => {
  const activeAlerts = await Alert.find({
    status: { $in: ["OPEN", "ESCALATED"] },
  });

  for (const alert of activeAlerts) {
    const rule = rules[alert.sourceType];
    if (!rule) continue;

    let reason = null;

    // Condition 1: compliance flag
    if (
      rule.auto_close_if &&
      alert.metadata?.[rule.auto_close_if] === true
    ) {
      reason = "Compliance condition satisfied";
    }

    // Condition 2: expiry window
    if (!reason && rule.expire_after_mins) {
      const expiryTimestamp =
        alert.createdAt.getTime() +
        rule.expire_after_mins * 60 * 1000;

      if (Date.now() > expiryTimestamp) {
        reason = "Alert expired";
      }
    }

    if (!reason) continue;

    const previousState = alert.status;

    alert.status = "AUTO_CLOSED";

    alert.history.push({
      fromState: previousState,
      toState: "AUTO_CLOSED",
      reason,
    });

    await alert.save();
  }
};

export { processAutoClose };