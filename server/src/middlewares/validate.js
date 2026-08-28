// Generic validation middleware factory. Takes a Zod schema, validates
// req.body against it before the controller runs, and forwards a
// clean 400 error (via the centralized error handler) if invalid -
// per ARCHITECTURE.md's rule that validation happens at the
// route/controller boundary, before business logic executes.
function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const message = result.error.issues
        .map((issue) => issue.message)
        .join(", ");
      const error = new Error(message);
      error.statusCode = 400;
      return next(error);
    }

    req.body = result.data;
    next();
  };
}

module.exports = validate;