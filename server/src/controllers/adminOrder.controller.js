const orderService = require("../services/order.service");

async function listOrders(req, res, next) {
  try {
    const result = await orderService.getAllOrdersForAdmin(req.query);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

async function getOrder(req, res, next) {
  try {
    const order = await orderService.getOrderByIdForAdmin(req.params.id);
    res.status(200).json({ success: true, order });
  } catch (error) {
    next(error);
  }
}

async function updateStatus(req, res, next) {
  try {
    const order = await orderService.updateOrderStatus(req.params.id, req.body.status);
    res.status(200).json({ success: true, order });
  } catch (error) {
    next(error);
  }
}

module.exports = { listOrders, getOrder, updateStatus };