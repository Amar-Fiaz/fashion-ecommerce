const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Finds a specific variant within a product's embedded variants array
// by sku. Throws a clean 404 if the product or variant no longer
// exists - this can legitimately happen if a product was removed or
// its variants changed since being added to a cart.
async function getProductAndVariant(productId, variantSku) {
  const product = await Product.findById(productId);
  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  const variant = product.variants.find((v) => v.sku === variantSku);
  if (!variant) {
    const error = new Error("Product variant not found");
    error.statusCode = 404;
    throw error;
  }

  return { product, variant };
}

async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
}

// Builds the response shape: populated product data, live-computed
// per-item and cart-level totals, and a flag on any item whose
// requested quantity now exceeds current stock (e.g. stock dropped
// after the item was added) - a form of backend stock validation
// surfaced to the frontend, not silently corrected here.
async function buildCartResponse(cart) {
  await cart.populate("items.product");

  const items = cart.items.map((item) => {
    const product = item.product;
    const variant = product?.variants.find((v) => v.sku === item.variantSku);
    const unitPrice = product?.isSale && product.salePrice ? product.salePrice : product?.price;
    const availableStock = variant ? variant.stock : 0;

    return {
      _id: item._id,
      product: product
        ? {
            _id: product._id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            salePrice: product.isSale ? product.salePrice : null,
            image: product.images?.[0] || "",
          }
        : null,
      variantSku: item.variantSku,
      size: item.size,
      color: item.color,
      quantity: item.quantity,
      unitPrice,
      lineTotal: unitPrice != null ? unitPrice * item.quantity : null,
      availableStock,
      insufficientStock: item.quantity > availableStock,
    };
  });

  const subtotal = items.reduce((sum, item) => sum + (item.lineTotal || 0), 0);

  return { items, subtotal };
}

async function getCart(userId) {
  const cart = await getOrCreateCart(userId);
  return buildCartResponse(cart);
}

async function addItem(userId, { productId, variantSku, quantity }) {
  const { variant } = await getProductAndVariant(productId, variantSku);

  const cart = await getOrCreateCart(userId);
  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId && item.variantSku === variantSku
  );

  const requestedTotal = (existingItem?.quantity || 0) + quantity;
  if (requestedTotal > variant.stock) {
    const error = new Error(
      `Only ${variant.stock} available for this size/color combination`
    );
    error.statusCode = 400;
    throw error;
  }

  if (existingItem) {
    existingItem.quantity = requestedTotal;
  } else {
    cart.items.push({
      product: productId,
      variantSku,
      size: variant.size,
      color: variant.color,
      quantity,
    });
  }

  await cart.save();
  return buildCartResponse(cart);
}

async function updateItemQuantity(userId, itemId, quantity) {
  const cart = await getOrCreateCart(userId);
  const item = cart.items.id(itemId);
  if (!item) {
    const error = new Error("Cart item not found");
    error.statusCode = 404;
    throw error;
  }

  const { variant } = await getProductAndVariant(item.product.toString(), item.variantSku);
  if (quantity > variant.stock) {
    const error = new Error(`Only ${variant.stock} available for this size/color combination`);
    error.statusCode = 400;
    throw error;
  }

  item.quantity = quantity;
  await cart.save();
  return buildCartResponse(cart);
}

async function removeItem(userId, itemId) {
  const cart = await getOrCreateCart(userId);
  const item = cart.items.id(itemId);
  if (!item) {
    const error = new Error("Cart item not found");
    error.statusCode = 404;
    throw error;
  }

  item.deleteOne();
  await cart.save();
  return buildCartResponse(cart);
}

// Merges a guest's localStorage cart into the authenticated user's
// DB-persisted cart on login/register. Matching product+variant lines
// have their quantities summed (capped at current stock); new lines
// are appended (also capped). Items referencing a product/variant
// that no longer exists are silently skipped, since there is nothing
// valid to merge.
async function mergeGuestCart(userId, guestItems) {
  const cart = await getOrCreateCart(userId);

  for (const guestItem of guestItems) {
    let product;
    let variant;
    try {
      ({ product, variant } = await getProductAndVariant(
        guestItem.productId,
        guestItem.variantSku
      ));
    } catch {
      continue; // product/variant no longer exists - skip this line
    }

    const existingItem = cart.items.find(
      (item) =>
        item.product.toString() === guestItem.productId && item.variantSku === guestItem.variantSku
    );

    if (existingItem) {
      existingItem.quantity = Math.min(
        existingItem.quantity + guestItem.quantity,
        variant.stock
      );
    } else {
      cart.items.push({
        product: guestItem.productId,
        variantSku: guestItem.variantSku,
        size: variant.size,
        color: variant.color,
        quantity: Math.min(guestItem.quantity, variant.stock),
      });
    }
  }

  await cart.save();
  return buildCartResponse(cart);
}

module.exports = { getCart, addItem, updateItemQuantity, removeItem, mergeGuestCart };