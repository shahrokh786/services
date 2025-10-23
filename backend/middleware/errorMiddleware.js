// File: backend/middleware/errorMiddleware.js

// Middleware to handle requests for routes that don't exist (404 Not Found)
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error); // Pass the error to the next error handler
};

// Centralized error handler middleware
// Needs to have these exact 4 parameters (err, req, res, next) for Express to recognize it as an error handler
const errorHandler = (err, req, res, next) => {
    // Determine the status code: Use the status code from the response if already set, otherwise default to 500 (Internal Server Error)
    // If the error originated from Mongoose (e.g., CastError for invalid ObjectId), set a 404
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;

    // Specific check for Mongoose CastError (often occurs with invalid ObjectId formats)
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        statusCode = 404;
        message = 'Resource not found';
    }

    // Specific check for Mongoose Validation Errors
    if (err.name === 'ValidationError') {
        statusCode = 400; // Bad Request
        // Combine multiple validation error messages if present
        message = Object.values(err.errors).map(val => val.message).join(', ');
    }

    // Send the formatted error response as JSON
    res.status(statusCode).json({
        message: message,
        // Include stack trace only in development mode for debugging
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

export { notFound, errorHandler };