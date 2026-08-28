const User = require("../models/User");
const { hashPassword, comparePassword } = require("../utils/password");
const { generateRawToken, hashToken } = require("../utils/emailTokens");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("../utils/jwt");
const sendEmail = require("../utils/sendEmail");
const { CLIENT_URL } = require("../config/env");

const VERIFICATION_EXPIRES_MS = 24 * 60 * 60 * 1000; // 24 hours
const RESET_EXPIRES_MS = 60 * 60 * 1000; // 1 hour

function toSafeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isEmailVerified: user.isEmailVerified,
  };
}

async function register({ name, email, password }) {
  const existing = await User.findOne({ email });
  if (existing) {
    const error = new Error("An account with this email already exists");
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await hashPassword(password);
  const rawToken = generateRawToken();

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "customer",
    isEmailVerified: false,
    emailVerificationTokenHash: hashToken(rawToken),
    emailVerificationExpires: new Date(Date.now() + VERIFICATION_EXPIRES_MS),
  });

  const verifyUrl = `${CLIENT_URL}/verify-email/${rawToken}`;
  await sendEmail({
    to: user.email,
    subject: "Verify your email",
    html: `<p>Welcome to Fashion E-Commerce Platform. Please verify your email by clicking the link below:</p><p><a href="${verifyUrl}">${verifyUrl}</a></p><p>This link expires in 24 hours.</p>`,
  });

  return toSafeUser(user);
}

// Enforced verification: login is blocked until the user's email is
// verified, per the approved Phase 7 decision.
async function login({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) {
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

  if (!user.isEmailVerified) {
    const error = new Error("Please verify your email before logging in");
    error.statusCode = 403;
    throw error;
  }

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  return { user: toSafeUser(user), accessToken, refreshToken };
}

// Stateless refresh: verifies the refresh token's signature and
// issues a new access token. No server-side session store - see the
// note on refresh token revocation in this step's introduction.
async function refresh(refreshToken) {
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
  if (!user) {
    const error = new Error("User no longer exists");
    error.statusCode = 401;
    throw error;
  }

  const accessToken = signAccessToken(user);
  return { user: toSafeUser(user), accessToken };
}

async function verifyEmail(rawToken) {
  const tokenHash = hashToken(rawToken);

  const user = await User.findOne({
    emailVerificationTokenHash: tokenHash,
    emailVerificationExpires: { $gt: new Date() },
  });

  if (!user) {
    const error = new Error("Invalid or expired verification link");
    error.statusCode = 400;
    throw error;
  }

  user.isEmailVerified = true;
  user.emailVerificationTokenHash = null;
  user.emailVerificationExpires = null;
  await user.save();

  return toSafeUser(user);
}

async function forgotPassword(email) {
  const user = await User.findOne({ email });

  // Always respond successfully regardless of whether the email
  // exists, to avoid leaking which emails are registered.
  if (!user) return;

  const rawToken = generateRawToken();
  user.passwordResetTokenHash = hashToken(rawToken);
  user.passwordResetExpires = new Date(Date.now() + RESET_EXPIRES_MS);
  await user.save();

  const resetUrl = `${CLIENT_URL}/reset-password/${rawToken}`;
  await sendEmail({
    to: user.email,
    subject: "Reset your password",
    html: `<p>You requested a password reset. Click the link below to choose a new password:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>This link expires in 1 hour. If you didn't request this, you can ignore this email.</p>`,
  });
}

async function resetPassword(rawToken, newPassword) {
  const tokenHash = hashToken(rawToken);

  const user = await User.findOne({
    passwordResetTokenHash: tokenHash,
    passwordResetExpires: { $gt: new Date() },
  });

  if (!user) {
    const error = new Error("Invalid or expired reset link");
    error.statusCode = 400;
    throw error;
  }

  user.password = await hashPassword(newPassword);
  user.passwordResetTokenHash = null;
  user.passwordResetExpires = null;
  await user.save();
}

module.exports = {
  register,
  login,
  refresh,
  verifyEmail,
  forgotPassword,
  resetPassword,
  toSafeUser,
};