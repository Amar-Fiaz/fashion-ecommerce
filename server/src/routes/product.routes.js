const express = require("express");
const {
  listProducts,
  searchSuggestions,
  getProductDetail,
} = require("../controllers/product.controller");

const router = express.Router();

// GET /api/products?category=&subCategory=&brand=&minPrice=&maxPrice=&size=&color=&sort=&search=&page=&limit=
router.get("/", listProducts);

// GET /api/products/search-suggestions?q=
// Must be registered before the /:slug route below, or Express would
// match this path as a slug value instead.
router.get("/search-suggestions", searchSuggestions);

// GET /api/products/:slug
router.get("/:slug", getProductDetail);

module.exports = router;