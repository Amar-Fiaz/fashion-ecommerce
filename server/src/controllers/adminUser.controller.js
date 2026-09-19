const adminUserService = require("../services/adminUser.service");

async function listCustomers(req, res, next) {
  try {
    const result = await adminUserService.getCustomers(req.query);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

async function getCustomer(req, res, next) {
  try {
    const result = await adminUserService.getCustomerById(req.params.id);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

module.exports = { listCustomers, getCustomer };