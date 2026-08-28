const mongoose = require("mongoose");

// Core customer/admin account model. Addresses are added to this
// model in a later Phase 7 step (dedicated to profile + saved
// addresses), not here - this step covers auth fundamentals only.
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
    password: { type: String, required: true }, // bcrypt hash, never plaintext

    role: { type: String, enum: ["customer", "admin"], default: "customer" },

    isEmailVerified: { type: Boolean, default: false },
    emailVerificationTokenHash: { type: String, default: null },
    emailVerificationExpires: { type: Date, default: null },

    passwordResetTokenHash: { type: String, default: null },
    passwordResetExpires: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);