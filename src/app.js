import express from "express";
import cors from "cors";
import morgan from "morgan";
import errorHandler from "./middleware/errorHandler.js";
import { ApiResponse } from "./utils/apiResponse.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (req, res) => {
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {
          uptime: process.uptime(),
          timestamp: new Date(),
        },
        "Service is healthy"
      )
    );
});

import alertRoutes from "./routes/alertRoutes.js";
app.use("/api/v1/alerts", alertRoutes);

import dashboardRoutes from "./routes/dashboardRoutes.js";
app.use("/api/v1/dashboard", dashboardRoutes);

app.use(errorHandler);

export default app;