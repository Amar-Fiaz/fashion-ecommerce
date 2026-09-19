const express = require("express");
const { protect, authorize } = require("../middlewares/auth");
const { getOverview } = require("../controllers/adminDashboard.controller");

const router = express.Router();

router.use(protect, authorize("admin"));

router.get("/overview", getOverview);

module.exports = router;