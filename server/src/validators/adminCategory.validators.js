const { z } = require("zod");

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid id");

const slugField = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens");

const createCategorySchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  slug: slugField,
});

const createSubCategorySchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  slug: slugField,
  category: objectId,
});

module.exports = { createCategorySchema, createSubCategorySchema };