const { z } = require("zod");

const verifyMockPaymentSchema = z.object({
  paymentId: z.string().min(1),
  outcome: z.enum(["success", "failure"]),
  signature: z.string().min(1),
});

module.exports = { verifyMockPaymentSchema };