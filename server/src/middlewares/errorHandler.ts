import { Request, Response, NextFunction } from 'express';

// Custom error interface
interface CustomError extends Error {
  status?: number;
  code?: string;
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log the error for debugging
  console.error({
    message: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method,
  });

  // Default error values
  let statusCode = err.status || 500;
  let message = err.message || 'Internal Server Error';

  // Handle specific error types
  switch (true) {
    case err instanceof SyntaxError:
      statusCode = 400;
      message = 'Invalid request syntax';
      break;

    case err instanceof TypeError:
      statusCode = 400;
      message = 'Type error occurred';
      break;

    case err.code === 'ECONNREFUSED':
      statusCode = 503;
      message = 'Service temporarily unavailable';
      break;

    case err.message.toLowerCase().includes('validation'):
      statusCode = 400;
      message = err.message;
      break;

    case err.message.toLowerCase().includes('not found'):
      statusCode = 404;
      message = err.message;
      break;

    case err.message.toLowerCase().includes('unauthorized'):
      statusCode = 401;
      message = 'Authentication required';
      break;

    case err.message.toLowerCase().includes('forbidden'):
      statusCode = 403;
      message = 'Access forbidden';
      break;
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message: message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      path: req.path,
      method: req.method,
    }),
  });
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});