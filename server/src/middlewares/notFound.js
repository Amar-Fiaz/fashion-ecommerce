// Catches any request that didn't match a defined route and forwards
// a consistent 404 error to the centralized error handler, rather
// than letting Express return its default HTML error page.
function notFound(req, res, next) {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

module.exports = notFound;