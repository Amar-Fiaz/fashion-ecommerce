const express = require("express");
const validate = require("../middlewares/validate");
const { verifyMockPaymentSchema } = require("../validators/payment.validators");
const { getMockPayment, verifyMockPayment } = require("../controllers/payment.controller");

const router = express.Router();

// No auth required - the simulated gateway page is a public,
// redirect-based flow (matching how a real hosted checkout redirect
// works), same as a real gateway wouldn't require your site's login
// to display its own payment page.
router.get("/mock/:paymentId", getMockPayment);
router.post("/mock/verify", validate(verifyMockPaymentSchema), verifyMockPayment);

module.exports = router;