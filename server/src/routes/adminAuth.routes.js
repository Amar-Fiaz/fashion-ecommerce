const express = require("express");
const validate = require("../middlewares/validate");
const { loginSchema } = require("../validators/auth.validators");
const { adminLogin, adminLogout, adminRefresh } = require("../controllers/adminAuth.controller");

const router = express.Router();

router.post("/login", validate(loginSchema), adminLogin);
router.post("/logout", adminLogout);
router.post("/refresh", adminRefresh);

module.exports = router;