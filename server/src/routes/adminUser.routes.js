const express = require("express");
const { protect, authorize } = require("../middlewares/auth");
const { listCustomers, getCustomer } = require("../controllers/adminUser.controller");

const router = express.Router();

router.use(protect, authorize("admin"));

router.get("/", listCustomers);
router.get("/:id", getCustomer);

module.exports = router;