const productService = require("../services/product.service");

async function listProducts(req, res, next) {
  try {
    const result = await productService.getProducts(req.query);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

async function searchSuggestions(req, res, next) {
  try {
    const { q } = req.query;
    const suggestions = await productService.getSearchSuggestions(q);
    res.status(200).json({ success: true, suggestions });
  } catch (error) {
    next(error);
  }
}

module.exports = { listProducts, searchSuggestions };