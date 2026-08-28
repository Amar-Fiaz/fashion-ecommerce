const authService = require("../services/auth.service");
const { NODE_ENV } = require("../config/env");

const REFRESH_COOKIE_NAME = "refreshToken";
const REFRESH_COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // matches default JWT_REFRESH_EXPIRES_IN

function setRefreshCookie(res, token) {
  res.cookie(REFRESH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite: "lax",
    maxAge: REFRESH_COOKIE_MAX_AGE_MS,
    path: "/api/auth",
  });
}

function clearRefreshCookie(res) {
  res.clearCookie(REFRESH_COOKIE_NAME, { path: "/api/auth" });
}

async function register(req, res, next) {
  try {
    const user = await authService.register(req.body);
    res.status(201).json({
      success: true,
      message: "Registration successful. Please check your email to verify your account.",
      user,
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { user, accessToken, refreshToken } = await authService.login(req.body);
    setRefreshCookie(res, refreshToken);
    res.status(200).json({ success: true, user, accessToken });
  } catch (error) {
    next(error);
  }
}

async function logout(req, res) {
  clearRefreshCookie(res);
  res.status(200).json({ success: true, message: "Logged out successfully" });
}

async function refresh(req, res, next) {
  try {
    const token = req.cookies?.refreshToken;
    const { user, accessToken } = await authService.refresh(token);
    res.status(200).json({ success: true, user, accessToken });
  } catch (error) {
    next(error);
  }
}

async function verifyEmail(req, res, next) {
  try {
    const { token } = req.params;
    const user = await authService.verifyEmail(token);
    res.status(200).json({ success: true, message: "Email verified successfully", user });
  } catch (error) {
    next(error);
  }
}

async function forgotPassword(req, res, next) {
  try {
    await authService.forgotPassword(req.body.email);
    res.status(200).json({
      success: true,
      message: "If an account with that email exists, a reset link has been sent.",
    });
  } catch (error) {
    next(error);
  }
}

async function resetPassword(req, res, next) {
  try {
    const { token } = req.params;
    await authService.resetPassword(token, req.body.password);
    res.status(200).json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  logout,
  refresh,
  verifyEmail,
  forgotPassword,
  resetPassword,
};