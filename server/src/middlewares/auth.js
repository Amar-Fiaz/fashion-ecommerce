const { verifyAccessToken } = require("../utils/jwt");

// Protects a route by requiring a valid access token in the
// Authorization header ("Bearer <token>"). Attaches the decoded
// payload (id, role) to req.user for downstream use. Not yet applied
// to any route in this step - profile/address endpoints (a later
// Phase 7 step) will use this.
function protect(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    const error = new Error("Not authenticated");
    error.statusCode = 401;
    return next(error);
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch {
    const error = new Error("Invalid or expired token");
    error.statusCode = 401;
    next(error);
  }
}

// Role-based authorization, layered on top of `protect`. Usage:
// router.get('/admin-only', protect, authorize('admin'), handler)
function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      const error = new Error("Not authorized to access this resource");
      error.statusCode = 403;
      return next(error);
    }
    next();
  };
}

module.exports = { protect, authorize };