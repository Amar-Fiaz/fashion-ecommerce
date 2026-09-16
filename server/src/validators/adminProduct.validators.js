const { z } = require("zod");

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid id");

const variantSchema = z.object({
  size: z.string().trim().min(1, "Size is required"),
  color: z.string().trim().min(1, "Color is required"),
  stock: z.number().int().min(0, "Stock cannot be negative"),
  sku: z.string().trim().min(1, "SKU is required"),
});

const createProductSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  description: z.string().trim().min(1, "Description is required"),
  images: z.array(z.string().trim().url("Each image must be a valid URL")).default([]),
  price: z.number().positive("Price must be greater than 0"),
  salePrice: z.number().positive().nullable().optional(),
  category: objectId,
  subCategory: objectId,
  brand: z.string().trim().optional(),
  variants: z.array(variantSchema).min(1, "At least one variant is required"),
  tags: z.array(z.string().trim()).default([]),
  isFeatured: z.boolean().default(false),
  isNewArrival: z.boolean().default(false),
  isSale: z.boolean().default(false),
});

// Same shape, but every field optional - a partial update.
const updateProductSchema = createProductSchema.partial();

module.exports = { createProductSchema, updateProductSchema };