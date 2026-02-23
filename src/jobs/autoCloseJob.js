import cron from "node-cron";
import { processAutoClose } from "../services/autoCloseService.js";
import logger from "../config/logger.js";

// Runs every 2 minutes
const startAutoCloseJob = () => {
  const schedule = "*/2 * * * *";

  cron.schedule(schedule, async () => {
    try {
      await processAutoClose();
      logger.info("Auto-close cycle completed");
    } catch (err) {
      logger.error("Auto-close job error", { error: err.message });
    }
  });
};

export { startAutoCloseJob };