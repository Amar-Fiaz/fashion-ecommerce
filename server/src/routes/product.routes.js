const express = require("express");
const { listProducts, searchSuggestions } = require("../controllers/product.controller");

const router = express.Router();

// GET /api/products?category=&subCategory=&brand=&minPrice=&maxPrice=&size=&color=&sort=&search=&page=&limit=
router.get("/", listProducts);

// GET /api/products/search-suggestions?q=
router.get("/search-suggestions", searchSuggestions);

module.exports = router;