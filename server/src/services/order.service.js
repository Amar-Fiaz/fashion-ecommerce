const Order = require("../models/Order");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const User = require("../models/User");
const { initiatePayment } = require("./paymentService");

const FLAT_SHIPPING_COST = 8;
const FREE_SHIPPING_THRESHOLD = 75;

function generateOrderNumber() {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${datePart}-${randomPart}`;
}

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

async function createOrder({ userId, email, items, addressId, shippingAddress, paymentMethod }) {
  const pricedItems = await validateAndPriceItems(items);
  const { subtotal, shippingCost, total } = calculateTotals(pricedItems);
  const resolvedAddress = await resolveShippingAddress({
    userId,
    addressId,
    inlineAddress: shippingAddress,
  });

  for (const item of pricedItems) {
    item._variantRef.stock -= item.quantity;
    await item._productDoc.save();
  }

  const orderItems = pricedItems.map(({ _productDoc, _variantRef, ...cleanItem }) => cleanItem);

  const order = await Order.create({
    orderNumber: generateOrderNumber(),
    user: userId || null,
    email,
    items: orderItems,
    shippingAddress: resolvedAddress,
    subtotal,
    shippingCost,
    total,
    paymentMethod,
  });

  if (userId) {
    await Cart.findOneAndUpdate({ user: userId }, { items: [] });
  }

  // Payment is initiated immediately after order creation - the
  // order exists (and stock is already deducted) regardless of
  // payment outcome, matching the approved Phase 9 stock-deduction
  // timing decision. Payment success/failure only ever affects
  // paymentStatus, never whether the order itself exists.
  const paymentInit = await initiatePayment(paymentMethod, order);

  return { order, paymentInit };
}

async function getOrderById(orderId, userId) {
  const order = await Order.findById(orderId);
  if (!order) {
    const error = new Error("Order not found");
    error.statusCode = 404;
    throw error;
  }

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