class ErrorHandler extends Error {
    constructor(statusCode, message) {
      super(message);
      this.statusCode = statusCode;
  
      // Capture the stack trace (only in development mode)
      if (process.env.NODE_ENV === 'development') {
        Error.captureStackTrace(this, this.constructor);
      }
    }
  }
  
  module.exports = ErrorHandler;
  