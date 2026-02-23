import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import {
  createAlertService,
  getAlertByAlertId,
  resolveAlertService,
} from "../services/alertService.js";

const createAlert = asyncHandler(async (req, res) => {
  const alert = await createAlertService(req.body);

  return res
    .status(201)
    .json(new ApiResponse(201, alert, "Alert created"));
});

const getAlert = asyncHandler(async (req, res) => {
  const alert = await getAlertByAlertId(req.params.alertId);

  return res
    .status(200)
    .json(new ApiResponse(200, alert, "Alert details"));
});

const resolveAlert = asyncHandler(async (req, res) => {
  const alert = await resolveAlertService(req.params.alertId);

  return res
    .status(200)
    .json(new ApiResponse(200, alert, "Alert resolved"));
});

export { createAlert, getAlert, resolveAlert };