const Category = require("../models/Category");
const SubCategory = require("../models/SubCategory");
const Product = require("../models/Product");

async function getCategoriesWithSubcategories() {
  const categories = await Category.find().sort({ name: 1 });

  const results = await Promise.all(
    categories.map(async (category) => {
      const subcategories = await SubCategory.find({ category: category._id }).sort({
        name: 1,
      });
      return {
        _id: category._id,
        name: category.name,
        slug: category.slug,
        subcategories,
      };
    })
  );

  return results;
}

// --- Admin CRUD functions below ---

async function createCategory(data) {
  const existing = await Category.findOne({ slug: data.slug });
  if (existing) {
    const error = new Error("A category with this slug already exists");
    error.statusCode = 409;
    throw error;
  }
  return Category.create(data);
}

async function updateCategory(categoryId, data) {
  if (data.slug) {
    const existing = await Category.findOne({ slug: data.slug, _id: { $ne: categoryId } });
    if (existing) {
      const error = new Error("A category with this slug already exists");
      error.statusCode = 409;
      throw error;
    }
  }
  const category = await Category.findByIdAndUpdate(categoryId, data, { new: true });
  if (!category) {
    const error = new Error("Category not found");
    error.statusCode = 404;
    throw error;
  }
  return category;
}

// Prevents deleting a category still in use, rather than silently
// leaving orphaned products/subcategories pointing at a nonexistent
// category - a data-integrity guard, not an arbitrary restriction.
async function deleteCategory(categoryId) {
  const productCount = await Product.countDocuments({ category: categoryId });
  if (productCount > 0) {
    const error = new Error(
      `Cannot delete: ${productCount} product(s) still use this category`
    );
    error.statusCode = 400;
    throw error;
  }
  await SubCategory.deleteMany({ category: categoryId });
  const category = await Category.findByIdAndDelete(categoryId);
  if (!category) {
    const error = new Error("Category not found");
    error.statusCode = 404;
    throw error;
  }
}

async function createSubCategory(data) {
  const category = await Category.findById(data.category);
  if (!category) {
    const error = new Error("Parent category not found");
    error.statusCode = 404;
    throw error;
  }
  const existing = await SubCategory.findOne({ category: data.category, slug: data.slug });
  if (existing) {
    const error = new Error("A subcategory with this slug already exists in this category");
    error.statusCode = 409;
    throw error;
  }
  return SubCategory.create(data);
}

async function deleteSubCategory(subCategoryId) {
  const productCount = await Product.countDocuments({ subCategory: subCategoryId });
  if (productCount > 0) {
    const error = new Error(
      `Cannot delete: ${productCount} product(s) still use this subcategory`
    );
    error.statusCode = 400;
    throw error;
  }
  const subCategory = await SubCategory.findByIdAndDelete(subCategoryId);
  if (!subCategory) {
    const error = new Error("Subcategory not found");
    error.statusCode = 404;
    throw error;
  }
}

module.exports = {
  getCategoriesWithSubcategories,
  createCategory,
  updateCategory,
  deleteCategory,
  createSubCategory,
  deleteSubCategory,
};