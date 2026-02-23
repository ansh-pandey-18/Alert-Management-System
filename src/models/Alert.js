import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const { Schema } = mongoose;

// Possible states an alert can be in
export const ALERT_STATES = ["OPEN", "ESCALATED", "AUTO_CLOSED", "RESOLVED"];

// Supported severity levels
export const ALERT_LEVELS = ["INFO", "WARNING", "CRITICAL"];

// Tracks lifecycle changes of an alert
const historySchema = new Schema(
  {
    fromState: {
      type: String,
      enum: ALERT_STATES,
    },
    toState: {
      type: String,
      enum: ALERT_STATES,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    changedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const alertSchema = new Schema(
  {
    alertId: {
      type: String,
      unique: true,
      default: () => uuidv4(),
    },

    sourceType: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    severity: {
      type: String,
      enum: ALERT_LEVELS,
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ALERT_STATES,
      default: "OPEN",
      index: true,
    },

    driverId: {
      type: String,
      required: true,
      index: true,
    },

    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },

    escalationCount: {
      type: Number,
      default: 0,
    },

    history: {
      type: [historySchema],
      default: [],
    },
  },
  {
    timestamps: true,
    strict: true,
  }
);

// Helps rule engine query recent alerts efficiently
alertSchema.index({ driverId: 1, sourceType: 1, createdAt: -1 });

const Alert = mongoose.model("Alert", alertSchema);

export default Alert;