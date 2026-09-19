const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");

async function getDashboardOverview() {
  const [productCount, orderCount, customerCount, pendingOrderCount] = await Promise.all([
    Product.countDocuments(),
    Order.countDocuments(),
    User.countDocuments({ role: "customer" }),
    Order.countDocuments({ status: "pending" }),
  ]);

  return { productCount, orderCount, customerCount, pendingOrderCount };
}

module.exports = { getDashboardOverview };