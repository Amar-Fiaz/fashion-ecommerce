const express = require("express");
const { protect } = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const { updateProfileSchema, addressSchema } = require("../validators/user.validators");
const {
  getProfile,
  updateProfile,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} = require("../controllers/user.controller");

const router = express.Router();

router.use(protect); // every route below requires a valid access token

router.get("/profile", getProfile);
router.patch("/profile", validate(updateProfileSchema), updateProfile);

router.get("/addresses", getAddresses);
router.post("/addresses", validate(addressSchema), addAddress);
router.patch("/addresses/:addressId", validate(addressSchema), updateAddress);
router.delete("/addresses/:addressId", deleteAddress);

module.exports = router;