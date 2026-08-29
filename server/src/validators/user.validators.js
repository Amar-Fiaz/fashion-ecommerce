const { z } = require("zod");

const updateProfileSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
});

const addressSchema = z.object({
  label: z.string().trim().optional(),
  fullName: z.string().trim().min(1, "Full name is required"),
  line1: z.string().trim().min(1, "Address line 1 is required"),
  line2: z.string().trim().optional(),
  city: z.string().trim().min(1, "City is required"),
  state: z.string().trim().optional(),
  postalCode: z.string().trim().min(1, "Postal code is required"),
  country: z.string().trim().min(1, "Country is required"),
  phone: z.string().trim().optional(),
  isDefault: z.boolean().optional(),
});

module.exports = { updateProfileSchema, addressSchema };