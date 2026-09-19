const { z } = require("zod");

const updateOrderStatusSchema = z.object({
  status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]),
});

module.exports = { updateOrderStatusSchema };