const Review = require("../models/Review");
const Product = require("../models/Product");
const Order = require("../models/Order");
const { createNotification } = require("./notification.service");

// Recomputes Product.averageRating and reviewCount from all reviews
// for that product - these fields have existed since Phase 5 but were
// never written to until this phase.
async function recomputeProductRating(productId) {
  const reviews = await Review.find({ product: productId });
  const reviewCount = reviews.length;
  const averageRating = reviewCount
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
    : 0;

  await Product.findByIdAndUpdate(productId, {
    averageRating: Math.round(averageRating * 10) / 10,
    reviewCount,
  });
}

async function hasPurchased(userId, productId) {
  const order = await Order.findOne({
    user: userId,
    status: { $ne: "cancelled" },
    "items.product": productId,
  });
  return Boolean(order);
}

async function getReviewsForProduct(productId) {
  return Review.find({ product: productId }).sort({ createdAt: -1 });
}

async function createOrUpdateReview(userId, userName, productId, { rating, comment }) {
  const purchased = await hasPurchased(userId, productId);
  if (!purchased) {
    const error = new Error("You can only review products you have purchased");
    error.statusCode = 403;
    throw error;
  }

  const review = await Review.findOneAndUpdate(
    { product: productId, user: userId },
    { rating, comment, userName },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  await recomputeProductRating(productId);
  await createNotification(
    userId,
    "review_submitted",
    "Thanks for your review!",
    { productId }
  );

  return review;
}

module.exports = { getReviewsForProduct, createOrUpdateReview, hasPurchased };