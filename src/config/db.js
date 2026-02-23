import mongoose from "mongoose";
import logger from "./logger.js";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    logger.info(`Mongo connected (${connection.connection.host})`);
  } catch (err) {
    logger.error(`Mongo connection failed: ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;