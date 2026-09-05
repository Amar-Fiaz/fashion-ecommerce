const mongoose = require("mongoose");

// One Payment record per order's payment attempt. Kept separate from
// Order (rather than embedding payment state directly) since a
// payment can be retried/re-attempted independently of the order
// itself, and this cleanly separates "what was ordered" from "how it
// was paid for" - the paymentService abstraction from
// ARCHITECTURE.md Section 7.
const paymentSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    method: {
      type: String,
      enum: ["cod", "bank_transfer", "mock_gateway"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "succeeded", "failed"],
      default: "pending",
    },
    amount: { type: Number, required: true },
    // Gateway-specific reference (e.g. a mock transaction id). Never
    // used for authorization decisions on its own - always paired
    // with server-side verification. Null for cod/bank_transfer.
    gatewayReference: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);