const { z } = require("zod");

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid id");

const addCartItemSchema = z.object({
  productId: objectId,
  variantSku: z.string().min(1, "variantSku is required"),
  quantity: z.number().int().positive("Quantity must be a positive whole number"),
});

const updateCartItemSchema = z.object({
  quantity: z.number().int().positive("Quantity must be a positive whole number"),
});

const mergeCartSchema = z.object({
  items: z.array(
    z.object({
      productId: objectId,
      variantSku: z.string().min(1),
      quantity: z.number().int().positive(),
    })
  ),
});

module.exports = { addCartItemSchema, updateCartItemSchema, mergeCartSchema };