const mongoose = require("mongoose");

// Category model. Subcategories are stored as a separate collection
// (SubCategory) referencing this model, not embedded here - this
// keeps categories and subcategories independently queryable, which
// the catalog's filtering needs.
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);