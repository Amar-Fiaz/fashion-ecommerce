const Category = require("../models/Category");
const SubCategory = require("../models/SubCategory");

// Returns all categories, each with its subcategories nested under
// it - convenient shape for the frontend's category filter UI,
// without requiring two separate API calls.
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

module.exports = { getCategoriesWithSubcategories };