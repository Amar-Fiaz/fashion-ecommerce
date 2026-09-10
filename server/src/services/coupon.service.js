const Coupon = require("../models/Coupon");

// Validates a coupon and computes the discount amount - this is the
// single source of truth for coupon logic, called both by the
// checkout preview endpoint (below) and by order creation itself
// (order.service.js), so a coupon can never be "previewed" as valid
// but silently ignored/miscalculated at actual order creation.
async function validateAndCalculateDiscount(code, subtotal) {
  const coupon = await Coupon.findOne({ code: code.trim().toUpperCase() });

  if (!coupon || !coupon.isActive) {
    const error = new Error("Invalid coupon code");
    error.statusCode = 400;
    throw error;
  }

  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    const error = new Error("This coupon has expired");
    error.statusCode = 400;
    throw error;
  }

  if (coupon.usageLimit !== null && coupon.usageCount >= coupon.usageLimit) {
    const error = new Error("This coupon has reached its usage limit");
    error.statusCode = 400;
    throw error;
  }

  if (subtotal < coupon.minOrderValue) {
    const error = new Error(
      `This coupon requires a minimum order of $${coupon.minOrderValue}`
    );
    error.statusCode = 400;
    throw error;
  }

  const discount =
    coupon.discountType === "percentage"
      ? subtotal * (coupon.discountValue / 100)
      : Math.min(coupon.discountValue, subtotal); // never discount below $0

  return { coupon, discount: Math.round(discount * 100) / 100 };
}

async function incrementUsage(couponId) {
  await Coupon.findByIdAndUpdate(couponId, { $inc: { usageCount: 1 } });
}

module.exports = { validateAndCalculateDiscount, incrementUsage };