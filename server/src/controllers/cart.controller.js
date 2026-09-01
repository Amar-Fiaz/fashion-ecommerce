const cartService = require("../services/cart.service");

async function getCart(req, res, next) {
  try {
    const cart = await cartService.getCart(req.user.id);
    res.status(200).json({ success: true, cart });
  } catch (error) {
    next(error);
  }
}

async function addItem(req, res, next) {
  try {
    const cart = await cartService.addItem(req.user.id, req.body);
    res.status(201).json({ success: true, cart });
  } catch (error) {
    next(error);
  }
}

async function updateItemQuantity(req, res, next) {
  try {
    const cart = await cartService.updateItemQuantity(
      req.user.id,
      req.params.itemId,
      req.body.quantity
    );
    res.status(200).json({ success: true, cart });
  } catch (error) {
    next(error);
  }
}

async function removeItem(req, res, next) {
  try {
    const cart = await cartService.removeItem(req.user.id, req.params.itemId);
    res.status(200).json({ success: true, cart });
  } catch (error) {
    next(error);
  }
}

async function mergeCart(req, res, next) {
  try {
    const cart = await cartService.mergeGuestCart(req.user.id, req.body.items);
    res.status(200).json({ success: true, cart });
  } catch (error) {
    next(error);
  }
}

module.exports = { getCart, addItem, updateItemQuantity, removeItem, mergeCart };