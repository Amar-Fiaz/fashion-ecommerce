const wishlistService = require("../services/wishlist.service");

async function getWishlist(req, res, next) {
  try {
    const products = await wishlistService.getWishlist(req.user.id);
    res.status(200).json({ success: true, products });
  } catch (error) {
    next(error);
  }
}

async function addProduct(req, res, next) {
  try {
    const products = await wishlistService.addProduct(req.user.id, req.body.productId);
    res.status(201).json({ success: true, products });
  } catch (error) {
    next(error);
  }
}

async function removeProduct(req, res, next) {
  try {
    const products = await wishlistService.removeProduct(req.user.id, req.params.productId);
    res.status(200).json({ success: true, products });
  } catch (error) {
    next(error);
  }
}

module.exports = { getWishlist, addProduct, removeProduct };