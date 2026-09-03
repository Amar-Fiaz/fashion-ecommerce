const { verifyAccessToken } = require("../utils/jwt");

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

// Like protect, but never rejects the request - attaches req.user if
// a valid token is present, otherwise leaves it undefined and
// continues. Used by routes that must work for both guests and
// authenticated users (e.g. checkout), where auth state changes
// behavior but is never required.
function optionalProtect(req, res, next) {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      req.user = verifyAccessToken(token);
    } catch {
      // Invalid/expired token on an optional route - proceed as a
      // guest rather than rejecting the request.
    }
  }

  next();
}

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

module.exports = { protect, optionalProtect, authorize };