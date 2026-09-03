const express = require("express");
const { protect, optionalProtect } = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const { createOrderSchema } = require("../validators/order.validators");
const { createOrder, getMyOrders, getOrderById } = require("../controllers/order.controller");

const router = express.Router();

// Checkout works for both guests and authenticated users.
router.post("/", optionalProtect, validate(createOrderSchema), createOrder);

// Order history/detail require login - guests have no persistent
// order lookup, per the approved Phase 9 scope.
router.get("/", protect, getMyOrders);
router.get("/:id", protect, getOrderById);

module.exports = router;