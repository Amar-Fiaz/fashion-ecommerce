const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");

async function getOrCreateWishlist(userId) {
  let wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: userId, products: [] });
  }
  return wishlist;
}

async function buildWishlistResponse(wishlist) {
  await wishlist.populate("products");
  return wishlist.products.map((product) => ({
    _id: product._id,
    name: product.name,
    slug: product.slug,
    price: product.price,
    salePrice: product.isSale ? product.salePrice : null,
    image: product.images?.[0] || "",
  }));
}

async function getWishlist(userId) {
  const wishlist = await getOrCreateWishlist(userId);
  return buildWishlistResponse(wishlist);
}

async function addProduct(userId, productId) {
  const product = await Product.findById(productId);
  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  const wishlist = await getOrCreateWishlist(userId);
  const alreadyExists = wishlist.products.some((id) => id.toString() === productId);
  if (!alreadyExists) {
    wishlist.products.push(productId);
    await wishlist.save();
  }

  return buildWishlistResponse(wishlist);
}

async function removeProduct(userId, productId) {
  const wishlist = await getOrCreateWishlist(userId);
  wishlist.products = wishlist.products.filter((id) => id.toString() !== productId);
  await wishlist.save();
  return buildWishlistResponse(wishlist);
}

module.exports = { getWishlist, addProduct, removeProduct };