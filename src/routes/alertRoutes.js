import express from "express";
import {
  createAlert,
  getAlert,
  resolveAlert
} from "../controllers/alertController.js";

const router = express.Router();

router.post("/", createAlert);
router.get("/:alertId", getAlert);
router.patch("/:alertId/resolve", resolveAlert);

export default router;