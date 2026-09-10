const express = require("express");
const { protect } = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const { createReviewSchema } = require("../validators/review.validators");
const { getReviews, createReview, checkEligibility } = require("../controllers/review.controller");

const router = express.Router();

router.get("/:productId", getReviews); // public - anyone can read reviews
router.get("/:productId/eligibility", protect, checkEligibility);
router.post("/:productId", protect, validate(createReviewSchema), createReview);

module.exports = router;