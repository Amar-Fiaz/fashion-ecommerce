const adminAuthService = require("../services/adminAuth.service");
const { NODE_ENV } = require("../config/env");

// Uses a differently-named cookie (adminRefreshToken) and a scoped
// path (/api/admin/auth), so it can never collide with or be read by
// the customer auth flow's refreshToken cookie - reinforcing the
// structural separation at the cookie level too, not just the route
// level.
const ADMIN_REFRESH_COOKIE_NAME = "adminRefreshToken";
const REFRESH_COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

function setAdminRefreshCookie(res, token) {
  res.cookie(ADMIN_REFRESH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite: "lax",
    maxAge: REFRESH_COOKIE_MAX_AGE_MS,
    path: "/api/admin/auth",
  });
}

function clearAdminRefreshCookie(res) {
  res.clearCookie(ADMIN_REFRESH_COOKIE_NAME, { path: "/api/admin/auth" });
}

async function adminLogin(req, res, next) {
  try {
    const { user, accessToken, refreshToken } = await adminAuthService.adminLogin(req.body);
    setAdminRefreshCookie(res, refreshToken);
    res.status(200).json({ success: true, user, accessToken });
  } catch (error) {
    next(error);
  }
}

async function adminLogout(req, res) {
  clearAdminRefreshCookie(res);
  res.status(200).json({ success: true, message: "Logged out successfully" });
}

async function adminRefresh(req, res, next) {
  try {
    const token = req.cookies?.adminRefreshToken;
    const { user, accessToken } = await adminAuthService.adminRefresh(token);
    res.status(200).json({ success: true, user, accessToken });
  } catch (error) {
    next(error);
  }
}

module.exports = { adminLogin, adminLogout, adminRefresh };