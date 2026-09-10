const reviewService = require("../services/review.service");

async function getReviews(req, res, next) {
  try {
    const reviews = await reviewService.getReviewsForProduct(req.params.productId);
    res.status(200).json({ success: true, reviews });
  } catch (error) {
    next(error);
  }
}

async function createReview(req, res, next) {
  try {
    const review = await reviewService.createOrUpdateReview(
      req.user.id,
      req.user.name || "Anonymous",
      req.params.productId,
      req.body
    );
    res.status(201).json({ success: true, review });
  } catch (error) {
    next(error);
  }
}

async function checkEligibility(req, res, next) {
  try {
    const purchased = await reviewService.hasPurchased(req.user.id, req.params.productId);
    res.status(200).json({ success: true, canReview: purchased });
  } catch (error) {
    next(error);
  }
}

module.exports = { getReviews, createReview, checkEligibility };