const { z } = require("zod");

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid id");

const orderItemInputSchema = z.object({
  productId: objectId,
  variantSku: z.string().min(1),
  quantity: z.number().int().positive(),
});

const shippingAddressInputSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required"),
  line1: z.string().trim().min(1, "Address line 1 is required"),
  line2: z.string().trim().optional(),
  city: z.string().trim().min(1, "City is required"),
  state: z.string().trim().optional(),
  postalCode: z.string().trim().min(1, "Postal code is required"),
  country: z.string().trim().min(1, "Country is required"),
  phone: z.string().trim().optional(),
});

// A saved address (authenticated users may pass addressId instead of
// a full inline address) OR an inline address is required - not both
// missing. Validated in the service layer (needs the user's saved
// addresses to check addressId), not here.
const createOrderSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  items: z.array(orderItemInputSchema).min(1, "Cart is empty"),
  addressId: z.string().optional(),
  shippingAddress: shippingAddressInputSchema.optional(),
});

module.exports = { createOrderSchema };