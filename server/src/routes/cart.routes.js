const express = require("express");
const { protect } = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const {
  addCartItemSchema,
  updateCartItemSchema,
  mergeCartSchema,
} = require("../validators/cart.validators");
const {
  getCart,
  addItem,
  updateItemQuantity,
  removeItem,
  mergeCart,
} = require("../controllers/cart.controller");

const router = express.Router();

router.use(protect); // the entire authenticated cart requires login

router.get("/", getCart);
router.post("/items", validate(addCartItemSchema), addItem);
router.patch("/items/:itemId", validate(updateCartItemSchema), updateItemQuantity);
router.delete("/items/:itemId", removeItem);
router.post("/merge", validate(mergeCartSchema), mergeCart);

module.exports = router;