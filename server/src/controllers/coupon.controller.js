const couponService = require("../services/coupon.service");

async function applyCoupon(req, res, next) {
  try {
    const { code, subtotal } = req.body;
    const { discount } = await couponService.validateAndCalculateDiscount(code, subtotal);
    res.status(200).json({ success: true, discount, code: code.trim().toUpperCase() });
  } catch (error) {
    next(error);
  }
}

module.exports = { applyCoupon };