const Product = require("../models/Product");

// Builds and executes the product listing query: filtering, sorting,
// pagination, and text search all live here, not in the controller,
// per ARCHITECTURE.md's rule that business/query logic belongs in
// services/.
async function getProducts(queryParams) {
  const {
    category,
    subCategory,
    brand,
    minPrice,
    maxPrice,
    size,
    color,
    sort,
    search,
    page = 1,
    limit = 12,
  } = queryParams;

  const filter = {};

  if (category) filter.category = category;
  if (subCategory) filter.subCategory = subCategory;
  if (brand) filter.brand = brand;

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  // size/color filter against the embedded variants array
  if (size) filter["variants.size"] = size;
  if (color) filter["variants.color"] = color;

  if (search) {
    filter.$text = { $search: search };
  }

  const sortMap = {
    "price-asc": { price: 1 },
    "price-desc": { price: -1 },
    newest: { createdAt: -1 },
    name: { name: 1 },
  };
  const sortOption = sortMap[sort] || sortMap.newest;

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Number(limit));
  const skip = (pageNum - 1) * limitNum;

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate("category", "name slug")
      .populate("subCategory", "name slug")
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum),
    Product.countDocuments(filter),
  ]);

  return {
    products,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    },
  };
}

// Simple regex "starts with" search against product names, for
// lightweight search-as-you-type suggestions. Kept separate from the
// main $text search, which is better suited for full result listings
// than for fast, partial-input suggestions.
async function getSearchSuggestions(query) {
  if (!query || query.trim().length === 0) return [];

  const regex = new RegExp(`^${query.trim()}`, "i");

  return Product.find({ name: regex })
    .select("name slug")
    .limit(8);
}

module.exports = { getProducts, getSearchSuggestions };