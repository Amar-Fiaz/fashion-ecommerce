const mongoose = require("mongoose");

// SubCategory model. References its parent Category by ObjectId.
const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true }
);

// A subcategory slug only needs to be unique within its parent
// category (e.g. "outerwear" exists under both Women and Men).
subCategorySchema.index({ category: 1, slug: 1 }, { unique: true });

module.exports = mongoose.model("SubCategory", subCategorySchema);