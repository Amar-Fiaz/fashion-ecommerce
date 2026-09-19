const User = require("../models/User");
const Order = require("../models/Order");

async function getCustomers({ search, page = 1, limit = 20 }) {
  const filter = { role: "customer" };
  if (search) {
    filter.$or = [{ name: new RegExp(search, "i") }, { email: new RegExp(search, "i") }];
  }

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Number(limit));
  const skip = (pageNum - 1) * limitNum;

  const [users, total] = await Promise.all([
    User.find(filter).select("-password").skip(skip).limit(limitNum).sort({ createdAt: -1 }),
    User.countDocuments(filter),
  ]);

  // Order count per customer, for the list view - a lightweight
  // aggregate rather than a full order list per row.
  const usersWithOrderCounts = await Promise.all(
    users.map(async (user) => {
      const orderCount = await Order.countDocuments({ user: user._id });
      return { ...user.toObject(), orderCount };
    })
  );

  return {
    customers: usersWithOrderCounts,
    pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) },
  };
}

async function getCustomerById(userId) {
  const user = await User.findOne({ _id: userId, role: "customer" }).select("-password");
  if (!user) {
    const error = new Error("Customer not found");
    error.statusCode = 404;
    throw error;
  }
  const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
  return { user, orders };
}

module.exports = { getCustomers, getCustomerById };