// Centralized error-handling middleware. Must be registered last,
// after all routes. Returns a consistent JSON error shape and never
// leaks raw stack traces or backend error details to the client,
// per CLAUDE.md Section 14.
function errorHandler(err, req, res, next) {
  const statusCode =
    err.statusCode && err.statusCode >= 400 ? err.statusCode : 500;

  console.error(err.stack || err.message);

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
}

module.exports = errorHandler;