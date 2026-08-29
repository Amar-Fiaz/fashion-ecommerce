const mongoose = require("mongoose");

// Embedded address sub-schema - a customer's personal saved address
// book, managed from their profile (this phase). Kept embedded here
// rather than a separate collection, matching the pattern already
// approved for Product.variants (ARCHITECTURE.md Section 8). Phase 9
// (Checkout & Orders) will decide separately how order-time address
// snapshots relate to this - not decided here.
const addressSchema = new mongoose.Schema({
  label: { type: String, trim: true, default: "" }, // e.g. "Home", "Work"
  fullName: { type: String, required: true, trim: true },
  line1: { type: String, required: true, trim: true },
  line2: { type: String, trim: true, default: "" },
  city: { type: String, required: true, trim: true },
  state: { type: String, trim: true, default: "" },
  postalCode: { type: String, required: true, trim: true },
  country: { type: String, required: true, trim: true },
  phone: { type: String, trim: true, default: "" },
  isDefault: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: { type: String, required: true },

    role: { type: String, enum: ["customer", "admin"], default: "customer" },

    isEmailVerified: { type: Boolean, default: false },
    emailVerificationTokenHash: { type: String, default: null },
    emailVerificationExpires: { type: Date, default: null },

    passwordResetTokenHash: { type: String, default: null },
    passwordResetExpires: { type: Date, default: null },

    addresses: { type: [addressSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);