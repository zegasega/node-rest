import { ApiResponse } from '../utils/response.js';

export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    return ApiResponse.error(
      res,
      err.message,
      err.statusCode,
      {
        status: err.status,
        error: err,
        stack: err.stack
      }
    );
  }

  if (err.isOperational) {
    return ApiResponse.error(res, err.message, err.statusCode);
  }

  // Programming or unknown errors: don't leak error details
  console.error('ERROR 💥', err);
  return ApiResponse.error(res, 'Something went wrong!', 500);
}; 