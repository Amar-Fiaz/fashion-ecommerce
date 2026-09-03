const mongoose = require("mongoose");

// Embedded, snapshotted line item - per ARCHITECTURE.md's order
// snapshotting rule, this copies product name/price/image/variant
// details at time of purchase. Orders never reference live Product
// documents for this data, so later catalog changes never alter
// historical orders.
const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    slug: { type: String, required: true },
    image: { type: String, default: "" },
    variantSku: { type: String, required: true },
    size: { type: String, required: true },
    color: { type: String, required: true },
    unitPrice: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    lineTotal: { type: Number, required: true },
  },
  { _id: false }
);

// Embedded shipping address - snapshotted the same way as items, not
// a reference to User.addresses, so a later edit/deletion of a saved
// address never affects a past order. See DATABASE.md for the
// rationale (no standalone Address collection - Phase 9 decision).
const shippingAddressSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    line1: { type: String, required: true },
    line2: { type: String, default: "" },
    city: { type: String, required: true },
    state: { type: String, default: "" },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: String, default: "" },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },

    // Null for guest orders - user is optional, per approved guest
    // checkout support. email is always present regardless, since a
    // guest has no User document to read one from.
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    email: { type: String, required: true },

    items: { type: [orderItemSchema], required: true },
    shippingAddress: { type: shippingAddressSchema, required: true },

    subtotal: { type: Number, required: true },
    shippingCost: { type: Number, required: true },
    total: { type: Number, required: true },

    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid"],
      default: "unpaid",
    },
    // Placeholder only - real payment method/gateway selection is
    // Phase 10 scope. "cod" is the only meaningful value until then.
    paymentMethod: { type: String, default: "cod" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);