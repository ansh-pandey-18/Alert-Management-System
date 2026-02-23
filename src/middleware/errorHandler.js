import logger from "../config/logger.js";
import { ApiError } from "../utils/apiError.js";

const errorHandler = (err, req, res, next) => {
  let error = err;

  // If not instance of ApiError, wrap it
  if (!(error instanceof ApiError)) {
    error = new ApiError(
      error.statusCode || 500,
      error.message || "Internal Server Error"
    );
  }

  logger.error("Error Occurred", {
    message: error.message,
    statusCode: error.statusCode,
    stack: error.stack,
  });

  res.status(error.statusCode).json({
    statusCode: error.statusCode,
    success: error.success,
    message: error.message,
    errors: error.errors,
  });
};

export default errorHandler;