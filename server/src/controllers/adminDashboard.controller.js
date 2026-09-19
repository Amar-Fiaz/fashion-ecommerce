const adminDashboardService = require("../services/adminDashboard.service");

async function getOverview(req, res, next) {
  try {
    const overview = await adminDashboardService.getDashboardOverview();
    res.status(200).json({ success: true, overview });
  } catch (error) {
    next(error);
  }
}

module.exports = { getOverview };