const mongoose = require("mongoose");

// Embedded variant sub-schema. Per ARCHITECTURE.md Section 8,
// variants (size/color/stock) live inside the Product document as an
// array, not as a separate collection. _id: false since variants are
// only ever accessed as part of their parent product, not queried
// independently.
const variantSchema = new mongoose.Schema(
  {
    size: { type: String, required: true, trim: true },
    color: { type: String, required: true, trim: true },
    stock: { type: Number, required: true, min: 0, default: 0 },
    sku: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    description: { type: String, required: true, trim: true },
    images: { type: [String], default: [] },

    price: { type: Number, required: true, min: 0 },
    salePrice: { type: Number, default: null, min: 0 },

    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    subCategory: { type: mongoose.Schema.Types.ObjectId, ref: "SubCategory", required: true },
    brand: { type: String, trim: true, default: "" },

    variants: { type: [variantSchema], default: [] },

    tags: { type: [String], default: [] },

    isFeatured: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isSale: { type: Boolean, default: false },

    // Ratings/reviews aggregate fields exist on the schema now (so the
    // catalog can display "0 reviews" cleanly) but are only ever
    // written to starting Phase 11, when the Review model exists.
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

// Text index for the main search (Product.name, description, tags).
productSchema.index({ name: "text", description: "text", tags: "text" });

// Supports category/subcategory filtering.
productSchema.index({ category: 1, subCategory: 1 });

module.exports = mongoose.model("Product", productSchema);