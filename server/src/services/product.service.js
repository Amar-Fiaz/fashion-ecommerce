const Product = require("../models/Product");

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

async function getSearchSuggestions(query) {
  if (!query || query.trim().length === 0) return [];

  const regex = new RegExp(`^${query.trim()}`, "i");

  return Product.find({ name: regex }).select("name slug").limit(8);
}

// Fetches a single product by its slug, with category/subCategory
// populated. Returns null if not found - the controller is
// responsible for turning that into a 404.
async function getProductBySlug(slug) {
  return Product.findOne({ slug })
    .populate("category", "name slug")
    .populate("subCategory", "name slug");
}

// Related products: same subCategory first (excluding the current
// product), falling back to same category if fewer than `limit`
// subCategory matches exist - handles categories with no
// subcategories (e.g. "Sale") and small catalogs gracefully.
async function getRelatedProducts(product, limit = 4) {
  const subCategoryMatches = await Product.find({
    subCategory: product.subCategory,
    _id: { $ne: product._id },
  })
    .populate("category", "name slug")
    .populate("subCategory", "name slug")
    .limit(limit);

  if (subCategoryMatches.length >= limit) {
    return subCategoryMatches;
  }

  const excludeIds = [product._id, ...subCategoryMatches.map((p) => p._id)];
  const remaining = limit - subCategoryMatches.length;

  const categoryMatches = await Product.find({
    category: product.category,
    _id: { $nin: excludeIds },
  })
    .populate("category", "name slug")
    .populate("subCategory", "name slug")
    .limit(remaining);

  return [...subCategoryMatches, ...categoryMatches];
}

module.exports = {
  getProducts,
  getSearchSuggestions,
  getProductBySlug,
  getRelatedProducts,
};