const mongoose = require("mongoose");

// Generic notification shape - `type` distinguishes what triggered
// it, `data` holds a small payload (e.g. orderId) for linking from
// the notification to the relevant page, without needing a different
// schema per notification type.
const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["order_placed", "review_submitted"], required: true },
    message: { type: String, required: true },
    data: { type: mongoose.Schema.Types.Mixed, default: {} },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

notificationSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("Notification", notificationSchema);