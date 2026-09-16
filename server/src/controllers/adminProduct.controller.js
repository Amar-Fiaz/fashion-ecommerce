const productService = require("../services/product.service");

async function listProducts(req, res, next) {
  try {
    const result = await productService.getProducts(req.query);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

async function getProduct(req, res, next) {
  try {
    const product = await productService.getProductByIdForAdmin(req.params.id);
    res.status(200).json({ success: true, product });
  } catch (error) {
    next(error);
  }
}

async function createProduct(req, res, next) {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json({ success: true, product });
  } catch (error) {
    next(error);
  }
}

async function updateProduct(req, res, next) {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    res.status(200).json({ success: true, product });
  } catch (error) {
    next(error);
  }
}

async function deleteProduct(req, res, next) {
  try {
    await productService.deleteProduct(req.params.id);
    res.status(200).json({ success: true, message: "Product deleted" });
  } catch (error) {
    next(error);
  }
}

module.exports = { listProducts, getProduct, createProduct, updateProduct, deleteProduct };