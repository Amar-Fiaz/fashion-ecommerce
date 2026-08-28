const crypto = require("crypto");

// Generates a random token for email verification / password reset
// links. The raw token is emailed to the user; only its hash is
// stored in the database, so a leaked database never exposes usable
// tokens (same principle as password hashing).

function generateRawToken() {
  return crypto.randomBytes(32).toString("hex");
}

function hashToken(rawToken) {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}

module.exports = { generateRawToken, hashToken };