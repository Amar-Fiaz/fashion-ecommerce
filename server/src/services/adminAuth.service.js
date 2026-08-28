const User = require("../models/User");
const { comparePassword } = require("../utils/password");
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require("../utils/jwt");
const { toSafeUser } = require("./auth.service");

// Admin login is intentionally kept separate from customer login
// (auth.service.js), per ARCHITECTURE.md Section 5 - structurally
// separate flows sharing the same underlying JWT/bcrypt mechanism.
// Only users with role "admin" can authenticate through this service,
// regardless of whether their credentials are otherwise valid.
async function adminLogin({ email, password }) {
  const user = await User.findOne({ email });

  if (!user || user.role !== "admin") {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const passwordMatches = await comparePassword(password, user.password);
  if (!passwordMatches) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  return { user: toSafeUser(user), accessToken, refreshToken };
}

async function adminRefresh(refreshToken) {
  if (!refreshToken) {
    const error = new Error("No refresh token provided");
    error.statusCode = 401;
    throw error;
  }

  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    const error = new Error("Invalid or expired refresh token");
    error.statusCode = 401;
    throw error;
  }

  const user = await User.findById(payload.id);
  if (!user || user.role !== "admin") {
    const error = new Error("Not authorized");
    error.statusCode = 401;
    throw error;
  }

  const accessToken = signAccessToken(user);
  return { user: toSafeUser(user), accessToken };
}

module.exports = { adminLogin, adminRefresh };