const categoryService = require("../services/category.service");

async function listCategories(req, res, next) {
  try {
    const categories = await categoryService.getCategoriesWithSubcategories();
    res.status(200).json({ success: true, categories });
  } catch (error) {
    next(error);
  }
}

module.exports = { listCategories };