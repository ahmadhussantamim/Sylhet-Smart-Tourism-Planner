// middleware/errorMiddleware.js
// -----------------------------------------------------------------------
// Catches:
// 1. Requests to URLs that don't exist (notFound)
// 2. Any error thrown/passed in the app (errorHandler)
// Keeping this in one place means controllers don't need repetitive
// try/catch boilerplate for unexpected errors.
// -----------------------------------------------------------------------

exports.notFound = (req, res, next) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
};

exports.errorHandler = (err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Something went wrong on the server.'
  });
};
