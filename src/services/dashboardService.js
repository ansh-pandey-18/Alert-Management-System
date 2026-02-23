import Alert from "../models/Alert.js";
import { getRedisClient } from "../config/redis.js";

const CACHE_TTL = 60;

// Safely read from Redis
const getFromCache = async (key) => {
  const redis = getRedisClient();
  if (!redis) return null;

  try {
    const value = await redis.get(key);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};

// Safely write to Redis
const setToCache = async (key, value) => {
  const redis = getRedisClient();
  if (!redis) return;

  try {
    await redis.set(key, JSON.stringify(value), "EX", CACHE_TTL);
  } catch {
    // ignore cache failures silently
  }
};

const getSeveritySummary = async () => {
  const cacheKey = "dashboard:summary";

  const cached = await getFromCache(cacheKey);
  if (cached) return cached;

  const data = await Alert.aggregate([
    { $match: { status: { $in: ["OPEN", "ESCALATED"] } } },
    {
      $group: {
        _id: "$severity",
        count: { $sum: 1 },
      },
    },
  ]);

  await setToCache(cacheKey, data);

  return data;
};

const getTopDrivers = async () => {
  const cacheKey = "dashboard:topDrivers";

  const cached = await getFromCache(cacheKey);
  if (cached) return cached;

  const data = await Alert.aggregate([
    { $match: { status: { $in: ["OPEN", "ESCALATED"] } } },
    {
      $group: {
        _id: "$driverId",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 5 },
  ]);

  await setToCache(cacheKey, data);

  return data;
};

const getRecentAutoClosed = async () => {
  return Alert.find({ status: "AUTO_CLOSED" })
    .sort({ updatedAt: -1 })
    .limit(10);
};

const getAlertTrends = async () => {
  return Alert.aggregate([
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$createdAt",
          },
        },
        total: { $sum: 1 },
        escalated: {
          $sum: {
            $cond: [{ $eq: ["$status", "ESCALATED"] }, 1, 0],
          },
        },
        autoClosed: {
          $sum: {
            $cond: [{ $eq: ["$status", "AUTO_CLOSED"] }, 1, 0],
          },
        },
      },
    },
    { $sort: { _id: 1 } },
  ]);
};

export {
  getSeveritySummary,
  getTopDrivers,
  getRecentAutoClosed,
  getAlertTrends,
};