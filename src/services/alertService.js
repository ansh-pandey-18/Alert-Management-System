import Alert from "../models/Alert.js";
import { ApiError } from "../utils/apiError.js";
import { evaluateEscalation } from "./ruleEngine.js";
import { getRedisClient } from "../config/redis.js";

// Clears cached dashboard aggregates
const invalidateDashboardCache = async () => {
  const redis = getRedisClient();
  if (!redis) return;

  await redis.del("dashboard:summary");
  await redis.del("dashboard:topDrivers");
};

const createAlertService = async (data) => {
  const { sourceType, severity, driverId, metadata } = data;

  if (!sourceType || !severity || !driverId) {
    throw new ApiError(400, "sourceType, severity and driverId are required");
  }

  const alert = new Alert({
    sourceType,
    severity,
    driverId,
    metadata,
    history: [
      {
        fromState: null,
        toState: "OPEN",
        reason: "Alert created",
      },
    ],
  });

  await alert.save();

  // Run rule engine after creation
  await evaluateEscalation(alert);

  await invalidateDashboardCache();

  return alert;
};

const getAlertByAlertId = async (alertId) => {
  const alert = await Alert.findOne({ alertId });

  if (!alert) {
    throw new ApiError(404, "Alert not found");
  }

  return alert;
};

const resolveAlertService = async (alertId) => {
  const alert = await Alert.findOne({ alertId });

  if (!alert) {
    throw new ApiError(404, "Alert not found");
  }

  if (alert.status === "RESOLVED") {
    throw new ApiError(400, "Alert already resolved");
  }

  if (alert.status === "AUTO_CLOSED") {
    throw new ApiError(400, "Auto-closed alert cannot be resolved manually");
  }

  const previousState = alert.status;

  alert.status = "RESOLVED";

  alert.history.push({
    fromState: previousState,
    toState: "RESOLVED",
    reason: "Resolved manually",
  });

  await alert.save();

  await invalidateDashboardCache();

  return alert;
};

export {
  createAlertService,
  getAlertByAlertId,
  resolveAlertService,
};