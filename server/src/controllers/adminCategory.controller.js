const categoryService = require("../services/category.service");

async function listCategories(req, res, next) {
  try {
    const categories = await categoryService.getCategoriesWithSubcategories();
    res.status(200).json({ success: true, categories });
  } catch (error) {
    next(error);
  }
}

async function createCategory(req, res, next) {
  try {
    const category = await categoryService.createCategory(req.body);
    res.status(201).json({ success: true, category });
  } catch (error) {
    next(error);
  }
}

async function updateCategory(req, res, next) {
  try {
    const category = await categoryService.updateCategory(req.params.id, req.body);
    res.status(200).json({ success: true, category });
  } catch (error) {
    next(error);
  }
}

async function deleteCategory(req, res, next) {
  try {
    await categoryService.deleteCategory(req.params.id);
    res.status(200).json({ success: true, message: "Category deleted" });
  } catch (error) {
    next(error);
  }
}

async function createSubCategory(req, res, next) {
  try {
    const subCategory = await categoryService.createSubCategory(req.body);
    res.status(201).json({ success: true, subCategory });
  } catch (error) {
    next(error);
  }
}

async function deleteSubCategory(req, res, next) {
  try {
    await categoryService.deleteSubCategory(req.params.id);
    res.status(200).json({ success: true, message: "Subcategory deleted" });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  createSubCategory,
  deleteSubCategory,
};