const express = require("express");
const { protect, authorize } = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const {
  createCategorySchema,
  createSubCategorySchema,
} = require("../validators/adminCategory.validators");
const {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  createSubCategory,
  deleteSubCategory,
} = require("../controllers/adminCategory.controller");

const router = express.Router();

router.use(protect, authorize("admin"));

router.get("/", listCategories);
router.post("/", validate(createCategorySchema), createCategory);
router.patch("/:id", updateCategory);
router.delete("/:id", deleteCategory);

router.post("/subcategories", validate(createSubCategorySchema), createSubCategory);
router.delete("/subcategories/:id", deleteSubCategory);

module.exports = router;