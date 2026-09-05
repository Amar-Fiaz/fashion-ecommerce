const crypto = require("crypto");
const Payment = require("../../models/Payment");
const Order = require("../../models/Order");

// Self-built simulated gateway, shaped after a real hosted-checkout
// flow (e.g. JazzCash): initiate() returns a redirect target the
// frontend sends the customer to; that page (built in Step 2) lets
// the customer pick a simulated outcome; the return trip hits verify()
// with a signed payload, mimicking exactly how a real gateway's
// callback signature would be checked. No real third party is ever
// contacted - this is a deliberate stand-in per the approved Phase 10
// decision, chosen because every real Pakistani gateway option
// requires an external merchant registration step that doesn't fit
// this project's current stage. Swapping in a real gateway later only
// requires replacing this file's internals, not the surrounding
// order/payment flow.
const MOCK_SECRET = "mock-gateway-secret-not-for-production"; // fine as a constant - this is a simulation, not a real credential

function signPayload(paymentId, outcome) {
  return crypto.createHmac("sha256", MOCK_SECRET).update(`${paymentId}:${outcome}`).digest("hex");
}

async function initiate(order) {
  const payment = await Payment.create({
    order: order._id,
    method: "mock_gateway",
    status: "pending",
    amount: order.total,
  });

  return {
    paymentId: payment._id,
    redirectRequired: true,
    redirectUrl: `/mock-gateway/${payment._id}`,
  };
}

// Verifies a callback the same way a real gateway's server-side
// signature check would work: recompute the expected signature from
// known values and compare, rather than trusting the outcome field
// alone. This is the actual enforcement point - a forged or tampered
// "success" claim without a valid signature is rejected.
async function verify({ paymentId, outcome, signature }) {
  const expectedSignature = signPayload(paymentId, outcome);
  if (signature !== expectedSignature) {
    const error = new Error("Invalid payment signature");
    error.statusCode = 400;
    throw error;
  }

  const payment = await Payment.findById(paymentId);
  if (!payment) {
    const error = new Error("Payment not found");
    error.statusCode = 404;
    throw error;
  }

  payment.status = outcome === "success" ? "succeeded" : "failed";
  payment.gatewayReference = `MOCK-${Date.now()}`;
  await payment.save();

  if (payment.status === "succeeded") {
    await Order.findByIdAndUpdate(payment.order, { paymentStatus: "paid" });
  }

  return payment;
}

module.exports = { initiate, verify, signPayload };