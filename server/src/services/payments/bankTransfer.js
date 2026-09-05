const Payment = require("../../models/Payment");

// Static, configurable bank details shown to the customer at
// checkout - approved Phase 10 decision: no proof-of-payment upload,
// purely informational. Payment stays "pending" until manually
// confirmed (a later phase's admin panel would do this - Phase 12).
const BANK_DETAILS = {
  accountTitle: "Fashion Co (Pvt) Ltd",
  accountNumber: "1234-5678901-23",
  bankName: "Example Bank Ltd",
  iban: "PK00EXAM0001234567890123",
};

async function initiate(order) {
  const payment = await Payment.create({
    order: order._id,
    method: "bank_transfer",
    status: "pending",
    amount: order.total,
  });
  return { paymentId: payment._id, redirectRequired: false, bankDetails: BANK_DETAILS };
}

module.exports = { initiate, BANK_DETAILS };