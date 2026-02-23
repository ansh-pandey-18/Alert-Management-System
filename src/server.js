import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";
import { connectRedis } from "./config/redis.js";
import logger from "./config/logger.js";
import { startAutoCloseJob } from "./jobs/autoCloseJob.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
  connectRedis();
  
  startAutoCloseJob();    //For auto closing job after 2 mins

    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error("Server failed to start", {
      message: error.message,
    });
    process.exit(1);
  }
};

startServer();