const mongoose = require("mongoose");

// Embedded cart item - references a specific product + variant (by
// sku, since Product.variants entries have no _id of their own).
// No price is stored here; prices are computed live from the
// referenced Product at read time - see cart.service.js. Final,
// backend-verified order totals are Phase 9's responsibility.
const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  variantSku: { type: String, required: true },
  size: { type: String, required: true },
  color: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
});

// One cart per authenticated user - the DB-persisted half of the
// cart-duality pattern from ARCHITECTURE.md Section 11 / DATABASE.md.
// The guest half is entirely client-side (localStorage), built in
// Phase 8 Step 2 - there is no backend representation of a guest cart.
const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    items: { type: [cartItemSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);