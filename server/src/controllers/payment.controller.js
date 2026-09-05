const Payment = require("../models/Payment");
const mockGateway = require("../services/payments/mockGateway");
const { verifyPayment } = require("../services/paymentService");

// Fetches the pending mock payment for display on the simulated
// gateway page (Step 2's frontend), and pre-signs both possible
// outcomes so the simulated page can post back a valid signature
// without needing the secret itself exposed beyond this response.
async function getMockPayment(req, res, next) {
  try {
    const payment = await Payment.findById(req.params.paymentId).populate("order");
    if (!payment) {
      const error = new Error("Payment not found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      success: true,
      payment,
      signatures: {
        success: mockGateway.signPayload(payment._id.toString(), "success"),
        failure: mockGateway.signPayload(payment._id.toString(), "failure"),
      },
    });
  } catch (error) {
    next(error);
  }
}

async function verifyMockPayment(req, res, next) {
  try {
    const payment = await verifyPayment("mock_gateway", req.body);
    res.status(200).json({ success: true, payment });
  } catch (error) {
    next(error);
  }
}

module.exports = { getMockPayment, verifyMockPayment };