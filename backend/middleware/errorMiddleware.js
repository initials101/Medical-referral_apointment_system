const ErrorHandler = require('../utils/ErrorHandler');

const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }), // Show stack trace in dev
  });
};

module.exports = errorMiddleware;
