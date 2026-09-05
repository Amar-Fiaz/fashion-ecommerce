const Payment = require("../../models/Payment");

// Cash on Delivery: no external interaction at all. Payment record is
// created in "pending" state (paid only on physical delivery, which
// this project has no mechanism to confirm yet - acceptable, since
// COD's real-world confirmation is inherently offline/manual).
async function initiate(order) {
  const payment = await Payment.create({
    order: order._id,
    method: "cod",
    status: "pending",
    amount: order.total,
  });
  return { paymentId: payment._id, redirectRequired: false };
}

module.exports = { initiate };