const { z } = require("zod");

const applyCouponSchema = z.object({
  code: z.string().trim().min(1, "Coupon code is required"),
  subtotal: z.number().positive(),
});

module.exports = { applyCouponSchema };