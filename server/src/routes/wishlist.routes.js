const express = require("express");
const { protect } = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const { addWishlistItemSchema } = require("../validators/wishlist.validators");
const {
  getWishlist,
  addProduct,
  removeProduct,
} = require("../controllers/wishlist.controller");

const router = express.Router();

router.use(protect); // wishlist always requires login, per approved decision

router.get("/", getWishlist);
router.post("/", validate(addWishlistItemSchema), addProduct);
router.delete("/:productId", removeProduct);

module.exports = router;