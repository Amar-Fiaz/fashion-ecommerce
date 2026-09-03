const Order = require("../models/Order");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const User = require("../models/User");

const FLAT_SHIPPING_COST = 8;
const FREE_SHIPPING_THRESHOLD = 75; // subtotal > 75 qualifies, per approved decision

function generateOrderNumber() {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${datePart}-${randomPart}`;
}

// Resolves the shipping address for this order: either a saved
// address (authenticated users, by addressId) or an inline address
// (guests, or an authenticated user entering a new one). Either way,
// the result is a plain object snapshotted onto the order - never a
// reference to User.addresses, per the approved Phase 9 decision.
async function resolveShippingAddress({ userId, addressId, inlineAddress }) {
  if (addressId) {
    if (!userId) {
      const error = new Error("A saved address can only be used when logged in");
      error.statusCode = 400;
      throw error;
    }
    const user = await User.findById(userId);
    const saved = user?.addresses.id(addressId);
    if (!saved) {
      const error = new Error("Saved address not found");
      error.statusCode = 404;
      throw error;
    }
    return {
      fullName: saved.fullName,
      line1: saved.line1,
      line2: saved.line2,
      city: saved.city,
      state: saved.state,
      postalCode: saved.postalCode,
      country: saved.country,
      phone: saved.phone,
    };
  }

  if (!inlineAddress) {
    const error = new Error("A shipping address is required");
    error.statusCode = 400;
    throw error;
  }
  return inlineAddress;
}

// Re-validates and re-prices every item against live Product data.
// This is the actual enforcement of CLAUDE.md Section 15 - client-
// supplied prices/quantities are never trusted, only used to know
// *which* products/variants/quantities were requested.
async function validateAndPriceItems(requestedItems) {
  const pricedItems = [];

  for (const requested of requestedItems) {
    const product = await Product.findById(requested.productId);
    if (!product) {
      const error = new Error("One or more products in your order no longer exist");
      error.statusCode = 400;
      throw error;
    }

    const variant = product.variants.find((v) => v.sku === requested.variantSku);
    if (!variant) {
      const error = new Error(`${product.name}: selected size/color is no longer available`);
      error.statusCode = 400;
      throw error;
    }

    if (variant.stock < requested.quantity) {
      const error = new Error(
        `${product.name} (${variant.size}/${variant.color}): only ${variant.stock} available`
      );
      error.statusCode = 400;
      throw error;
    }

    const unitPrice = product.isSale && product.salePrice ? product.salePrice : product.price;

    pricedItems.push({
      product: product._id,
      name: product.name,
      slug: product.slug,
      image: product.images?.[0] || "",
      variantSku: variant.sku,
      size: variant.size,
      color: variant.color,
      unitPrice,
      quantity: requested.quantity,
      lineTotal: unitPrice * requested.quantity,
      // kept only for the deduction step below, stripped before saving
      _productDoc: product,
      _variantRef: variant,
    });
  }

  return pricedItems;
}

function calculateTotals(pricedItems) {
  const subtotal = pricedItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const shippingCost = subtotal > FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_COST;
  const total = subtotal + shippingCost;
  return { subtotal, shippingCost, total };
}

async function createOrder({ userId, email, items, addressId, shippingAddress }) {
  const pricedItems = await validateAndPriceItems(items);
  const { subtotal, shippingCost, total } = calculateTotals(pricedItems);
  const resolvedAddress = await resolveShippingAddress({
    userId,
    addressId,
    inlineAddress: shippingAddress,
  });

  // Deduct stock now (Phase 9 decision: deduct at order creation, not
  // deferred to payment confirmation - there is no payment gateway
  // yet, so order placement is the only real commitment point).
  // Sequential, not wrapped in a formal DB transaction - see this
  // step's introduction for the known limitation under concurrent
  // race conditions.
  for (const item of pricedItems) {
    item._variantRef.stock -= item.quantity;
    await item._productDoc.save();
  }

  const orderItems = pricedItems.map(
    ({ _productDoc, _variantRef, ...cleanItem }) => cleanItem
  );

  const order = await Order.create({
    orderNumber: generateOrderNumber(),
    user: userId || null,
    email,
    items: orderItems,
    shippingAddress: resolvedAddress,
    subtotal,
    shippingCost,
    total,
  });

  // Clear the authenticated user's persisted cart after a successful
  // order - the guest cart (localStorage) is cleared by the frontend.
  if (userId) {
    await Cart.findOneAndUpdate({ user: userId }, { items: [] });
  }

  return order;
}

async function getOrderById(orderId, userId) {
  const order = await Order.findById(orderId);
  if (!order) {
    const error = new Error("Order not found");
    error.statusCode = 404;
    throw error;
  }

  // Authorization: an authenticated user may only view their own
  // orders. (Guest orders have no persistent lookup at all, per the
  // approved scope - this function is only reached via the
  // authenticated order-history/detail routes.)
  if (!order.user || order.user.toString() !== userId) {
    const error = new Error("Order not found");
    error.statusCode = 404;
    throw error;
  }

  return order;
}

async function getOrdersForUser(userId) {
  return Order.find({ user: userId }).sort({ createdAt: -1 });
}

module.exports = { createOrder, getOrderById, getOrdersForUser };