const express = require("express");
const { protect, authorize } = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const { updateOrderStatusSchema } = require("../validators/adminOrder.validators");
const { listOrders, getOrder, updateStatus } = require("../controllers/adminOrder.controller");

const router = express.Router();

router.use(protect, authorize("admin"));

router.get("/", listOrders);
router.get("/:id", getOrder);
router.patch("/:id/status", validate(updateOrderStatusSchema), updateStatus);

module.exports = router;