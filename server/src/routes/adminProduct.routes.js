const express = require("express");
const { protect, authorize } = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const { createProductSchema, updateProductSchema } = require("../validators/adminProduct.validators");
const {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/adminProduct.controller");

const router = express.Router();

router.use(protect, authorize("admin"));

router.get("/", listProducts);
router.get("/:id", getProduct);
router.post("/", validate(createProductSchema), createProduct);
router.patch("/:id", validate(updateProductSchema), updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;