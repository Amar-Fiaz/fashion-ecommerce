const orderService = require("../services/order.service");

async function createOrder(req, res, next) {
  try {
    const userId = req.user?.id || null;
    const { order, paymentInit } = await orderService.createOrder({
      userId,
      email: req.body.email,
      items: req.body.items,
      addressId: req.body.addressId,
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
    });
    res.status(201).json({ success: true, order, payment: paymentInit });
  } catch (error) {
    next(error);
  }
}

async function getMyOrders(req, res, next) {
  try {
    const orders = await orderService.getOrdersForUser(req.user.id);
    res.status(200).json({ success: true, orders });
  } catch (error) {
    next(error);
  }
}

async function getOrderById(req, res, next) {
  try {
    const order = await orderService.getOrderById(req.params.id, req.user.id);
    res.status(200).json({ success: true, order });
  } catch (error) {
    next(error);
  }
}

module.exports = { createOrder, getMyOrders, getOrderById };