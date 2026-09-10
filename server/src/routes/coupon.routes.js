const express = require("express");
const validate = require("../middlewares/validate");
const { applyCouponSchema } = require("../validators/coupon.validators");
const { applyCoupon } = require("../controllers/coupon.controller");

const router = express.Router();

// No auth required - matches checkout, which must work for guests.
// This is a preview only; the real, authoritative discount is
// recalculated identically inside order creation itself.
router.post("/apply", validate(applyCouponSchema), applyCoupon);

module.exports = router;