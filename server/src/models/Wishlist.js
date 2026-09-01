const mongoose = require("mongoose");

// Product-level wishlist (no variant/size/color tracking), per the
// approved Phase 8 decision. One wishlist per authenticated user.
const wishlistSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    products: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Wishlist", wishlistSchema);