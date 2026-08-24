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

async function getProductDetail(req, res, next) {
  try {
    const { slug } = req.params;
    const product = await productService.getProductBySlug(slug);

    if (!product) {
      const error = new Error(`Product not found - ${slug}`);
      error.statusCode = 404;
      throw error;
    }

    const relatedProducts = await productService.getRelatedProducts(product);

    res.status(200).json({ success: true, product, relatedProducts });
  } catch (error) {
    next(error);
  }
}

module.exports = { listProducts, searchSuggestions, getProductDetail };